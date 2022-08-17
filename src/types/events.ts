import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result} from './support'

export class AssetsBurnedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Assets.Burned')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some assets were destroyed.
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Assets.Burned') === '7b313023dcadc0790714779ac69e85195d0b94fbfc5c5b1c65234ca592e0d3f7'
  }

  /**
   * Some assets were destroyed.
   */
  get asV1201(): {assetId: bigint, owner: Uint8Array, balance: bigint} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }
}

export class AssetsIssuedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Assets.Issued')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some assets were issued.
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Assets.Issued') === '00b4e83fd8a2b78206f9e4f83e5841b01b15461279b6952b593fddd97bfa57f8'
  }

  /**
   * Some assets were issued.
   */
  get asV1201(): {assetId: bigint, owner: Uint8Array, totalSupply: bigint} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }
}

export class AssetsTransferredEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Assets.Transferred')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some assets were transferred.
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Assets.Transferred') === 'f65815f0a2516ce398b9e72fe858b92dc308f7815d5ec2c9ca9344c57874f4c2'
  }

  /**
   * Some assets were transferred.
   */
  get asV1201(): {assetId: bigint, from: Uint8Array, to: Uint8Array, amount: bigint} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }
}
