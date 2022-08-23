# Moonbeam asset transaction tracker

Sample [squid](https://subsquid.io) project to track movements of assets on Moonbeam network.
It track three events (`Issued`, `Transferred`, `Burned`) of the `Assets` pallet on [Moonbeam](https://moonbeam.network) network, ingests and indexes them and serves them via graphql API. For more info consult [FAQ](./FAQ.md).

## Prerequisites

* node 16.x
* docker

## Quickly running the project

```bash
# 1. Install dependencies
npm ci

# 2. Compile typescript files
npm run build

# 3. Start target Postgres database
docker compose up -d

# 4. Apply database migrations from db/migrations
npx squid-typeorm-migration apply

# 5. Now start the processor
node -r dotenv/config lib/processor.js

# 6. The above command will block the terminal
#    being busy with fetching the chain data, 
#    transforming and storing it in the target database.
#
#    To start the graphql server open the separate terminal
#    and run
npx squid-graphql-server
```

## How to use the project

Once the processor is running, and the GraphQL server has been launched, open a browser and navigate to http://localhost:4350/graphql and in the central portion of the playground, destined to writing queries, type in this query:

```gql
query MyQuery {
  transfers(orderBy: balance_DESC, where: {to_eq: "0xd5062edd7af54658b1200ef8ad4153c4cd65c3ea"}) {
    to
    status
    id
    from
    assetId
    balance
  }
}
```

Then, in a different browser window, check this [URL](https://moonbeam.subscan.io/event?address=0xd5062edd7af54658b1200ef8ad4153c4cd65c3ea&module=assets&event=issued&startDate=&endDate=&startBlock=&endBlock=&timeType=date&version=1701) for consistency after running:

If the processor had been running long enough to index all the necessary events, you should see that the number of items found is consistent across both windows. You can have fun and replicate this with other addresses, or other events.

## Disclaimer

This is alpha-quality software. Expect some bugs and incompatible changes in coming weeks.
