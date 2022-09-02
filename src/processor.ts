import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
  toHex,
} from "@subsquid/substrate-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { Reward } from "./model";
import {
  ParachainStakingRewardedEvent,
} from "./types/events";

const processor = new SubstrateBatchProcessor()
  .setBatchSize(500)
  .setDataSource({
    archive: lookupArchive("moonbeam", { release: "FireSquid" }),
  })
  .addEvent("ParachainStaking.Rewarded")
  .addEvent("ParachainStaking.DelegatorDueReward")

processor.setBlockRange({ from: 171060, to: 1557181 });

processor.run(new TypeormDatabase(), async (ctx) => {
  const rewards = await getRewards(ctx);
  await ctx.store.insert(rewards);
});

type Item = BatchProcessorItem<typeof processor>;
type Ctx = BatchContext<Store, Item>;

async function getRewards(ctx: Ctx): Promise<Reward[]> {
  const rewards: Reward[] = []
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "ParachainStaking.Rewarded") {

        const event = new ParachainStakingRewardedEvent(ctx, item.event);
        let balance;
        let account: string;

        if (event.isV900){
          account = toHex(event.asV900[0]);
          balance = event.asV900[1];
        } else {
          account = toHex(event.asV1300.account);
          balance = event.asV1300.rewards;
        }

        const [blockNo, eventIdx] = item.event.id.split('-');
        const reward = new Reward();

        let index = parseInt(eventIdx, 10).toString();
        if (index.length == 1) {
          index = `00${index}`;
        } else if (index.length == 2) {
          index = `0${index}`
        }
        
        reward.id = `${parseInt(blockNo, 10)}-${index}`
        reward.account = account;
        reward.balance = balance;
        reward.timestamp = BigInt(block.header.timestamp);
        reward.dateMonth = (new Date(block.header.timestamp).getUTCMonth() + 1).toString() + "/" + new Date(block.header.timestamp).getUTCDate().toString();

        rewards.push(reward);
      }
    }
  }
  return rewards;
}
