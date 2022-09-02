import { ApiPromise, WsProvider } from '@polkadot/api';
import axios from "axios";

const main = async () => {
    // Set up Polkadot.js API
    const wsProvider = new WsProvider('wss://moonbeam.api.onfinality.io/public-ws');
    const api = await ApiPromise.create({ provider: wsProvider });

    const versionMap = {
        "1101": {
            "collator": "candidateState",
            "delegator": "delegatorState"
        },
        "1102": {
            "collator": "candidateState",
            "delegator": "delegatorState"
        },
        "1103": {
            "collator": "candidateState",
            "delegator": "delegatorState"
        },
        "1201": {
            "collator": "candidateInfo",
            "delegator": "delegatorState"
        },
        "1300": {
            "collator": "candidateState",
            "delegator": "delegatorState"
        },
    }

    const getMonthlyRewards = async (query) => {
        let delBalance = 0;
        let colBalance = 0;
        let currentBlock;
        let spec;

        try {
            const req = await axios({
                url: 'http://localhost:4350/graphql',
                method: 'post',
                data: {
                    query
                }
            });
            const rewards = req.data.data.rewards;

            rewards.forEach(async (reward, index) => {
                // assign current block
                const firstBlockNo = rewards[0].id.split('-')[0]; // '1000200'
                const blockNo = reward.id.split('-')[0];
                if (blockNo == currentBlock || blockNo != firstBlockNo) {
                    // update the delegator balance
                    delBalance += parseInt(reward.balance, 10);
                } else {
                    /* first event in the block is the collator event
                    so calculate collator inflation */
                    currentBlock = blockNo;

                    // get the block hash from the block # & use it to get info for this block
                    const blockHash = await api.rpc.chain.getBlockHash(blockNo);
                    const apiAt = await api.at(blockHash);

                    // get current runtime
                    // use method based on runtime version
                    const specVersion = apiAt.runtimeVersion.specVersion.toString()
                    spec = specVersion;
                    const collatorMethod = versionMap[specVersion]["collator"];

                    // get the collators total stake
                    const collatorStake = await apiAt.query.parachainStaking[collatorMethod](reward.account);
                    console.log(spec, reward.account, blockHash.toString(), reward.id);
                    const collatorBond = parseInt(collatorStake.toHuman().bond.replaceAll(',', ''), 10)

                    // get the delegator event & reward
                    const delegatorEvent = rewards[index + 1];
                    const delegatorReward = delegatorEvent.reward;

                    // get the delegator stake
                    const delegatorDelegations = await apiAt.query.parachainStaking.delegatorState(delegatorEvent.account);
                    const delegationInfo = delegatorDelegations.toHuman().delegations.find(delegation => {
                        if (delegation.owner.toLowerCase() == reward.account.toLowerCase()) {
                            return delegation
                        }
                    })
                    const delegatorStake = parseInt(delegationInfo.amount.replaceAll(',', ''), 10);

                    const collatorReward = collatorBond * delegatorReward / delegatorStake;
                    const inflation = parseInt(reward.balance, 10) - collatorReward;

                    colBalance += inflation;
                }
            })
        } catch (e) {
            console.log(spec);
            console.log(e);
        }
        return { delBalance, colBalance };
    }

    const dates = ['1/']
    //  '2/', '3/', '4/', '5/', '6/', '7/'];
    const limit = 10000;
    let hasMore = true;
    let offset = 0;

    dates.forEach(async date => {
        do {
            const query = `query {
                rewards(limit: ${limit}, offset: ${offset}, orderBy: id_ASC, where: {dateMonth_startsWith: "${date}"}) {
                    id
                        account
                        balance
                    }
                }`
            const balances = await getMonthlyRewards(query);

            console.log(date);
            console.log(balances);
            console.log("Delegator Balance: ", balances.delBalance);
            console.log("Collator Balance: ", balances.colBalance);
            console.log();

            offset += 10000;
            if (dates.length < 10000) {
                console.log("has more", hasMore)
                hasMore = false;
            } else {
                console.log("no more", hasMore)
            }
        } while (hasMore)
    })
}

main();