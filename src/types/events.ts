import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v1201 from './v1201'

export class AssetsBurnedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'assets.Burned')
  }

  /**
   * Some assets were destroyed.
   */
  get isV1201(): boolean {
    return this.ctx._chain.getEventHash('assets.Burned') === '7b313023dcadc0790714779ac69e85195d0b94fbfc5c5b1c65234ca592e0d3f7'
  }

  /**
   * Some assets were destroyed.
   */
  get asV1201(): {assetId: bigint, owner: v1201.AccountId20, balance: bigint} {
    assert(this.isV1201)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1201
  }

  get asLatest(): {assetId: bigint, owner: v1201.AccountId20, balance: bigint} {
    deprecateLatest()
    return this.asV1201
  }
}

export class AssetsIssuedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'assets.Issued')
  }

  /**
   * Some assets were issued.
   */
  get isV1201(): boolean {
    return this.ctx._chain.getEventHash('assets.Issued') === '00b4e83fd8a2b78206f9e4f83e5841b01b15461279b6952b593fddd97bfa57f8'
  }

  /**
   * Some assets were issued.
   */
  get asV1201(): {assetId: bigint, owner: v1201.AccountId20, totalSupply: bigint} {
    assert(this.isV1201)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1201
  }

  get asLatest(): {assetId: bigint, owner: v1201.AccountId20, totalSupply: bigint} {
    deprecateLatest()
    return this.asV1201
  }
}

export class AssetsTransferredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'assets.Transferred')
  }

  /**
   * Some assets were transferred.
   */
  get isV1201(): boolean {
    return this.ctx._chain.getEventHash('assets.Transferred') === 'f65815f0a2516ce398b9e72fe858b92dc308f7815d5ec2c9ca9344c57874f4c2'
  }

  /**
   * Some assets were transferred.
   */
  get asV1201(): {assetId: bigint, from: v1201.AccountId20, to: v1201.AccountId20, amount: bigint} {
    assert(this.isV1201)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1201
  }

  get asLatest(): {assetId: bigint, from: v1201.AccountId20, to: v1201.AccountId20, amount: bigint} {
    deprecateLatest()
    return this.asV1201
  }
}
