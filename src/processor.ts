import * as ss58 from "@subsquid/ss58";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
  toHex,
} from "@subsquid/substrate-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { Transfer, AssetStatus } from "./model";
import {
  AssetsBurnedEvent,
  AssetsIssuedEvent,
  AssetsTransferredEvent,
} from "./types/events";

const processor = new SubstrateBatchProcessor()
  .setBatchSize(500)
  .setDataSource({
    archive: lookupArchive("moonbeam", { release: "FireSquid" }),
  })
  .addEvent("Assets.Issued")
  .addEvent("Assets.Transferred")
  .addEvent("Assets.Burned");

processor.setBlockRange({ from: 950000 });

processor.run(new TypeormDatabase(), async (ctx) => {
  const assetTransfers = getTransfers(ctx);

  await ctx.store.insert(assetTransfers);
});

type Item = BatchProcessorItem<typeof processor>;
type Ctx = BatchContext<Store, Item>;

function getTransfers(ctx: Ctx): Transfer[] {
  const assetTransfers: Transfer[] = [];

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "Assets.Transferred") {
        const event = new AssetsTransferredEvent(ctx, item.event).asV1201;

        const transferred = new Transfer();
        transferred.id = item.event.id;
        transferred.assetId = event.assetId.toString();
        transferred.balance = event.amount;
        transferred.from = toHex(event.from);
        transferred.to = toHex(event.to);
        transferred.status = AssetStatus.TRANSFERRED;

        assetTransfers.push(transferred);
      }
      if (item.name === "Assets.Issued") {
        const event = new AssetsIssuedEvent(ctx, item.event).asV1201;

        const transferred = new Transfer();
        transferred.id = item.event.id;
        transferred.assetId = event.assetId.toString();
        transferred.to = toHex(event.owner);
        transferred.from = "";
        transferred.balance = event.totalSupply;
        transferred.status = AssetStatus.ISSUED;

        assetTransfers.push(transferred);
      }
      if (item.name === "Assets.Burned") {
        const event = new AssetsBurnedEvent(ctx, item.event).asV1201;

        const transferred = new Transfer();
        transferred.id = item.event.id;
        transferred.assetId = event.assetId.toString();
        transferred.balance = event.balance;
        transferred.from = toHex(event.owner);
        transferred.to = "";
        transferred.status = AssetStatus.BURNED;

        assetTransfers.push(transferred);
      }
    }
  }

  return assetTransfers;
}
