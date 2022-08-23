import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'

export class TreasuryDepositEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'treasury.Deposit')
  }

  /**
   * Some funds have been deposited. \[deposit\]
   */
  get isV900(): boolean {
    return this.ctx._chain.getEventHash('treasury.Deposit') === '47b59f698451e50cce59979f0121e842fa3f8b2bcef2e388222dbd69849514f9'
  }

  /**
   * Some funds have been deposited. \[deposit\]
   */
  get asV900(): bigint {
    assert(this.isV900)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Some funds have been deposited.
   */
  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('treasury.Deposit') === 'd74027ad27459f17d7446fef449271d1b0dc12b852c175623e871d009a661493'
  }

  /**
   * Some funds have been deposited.
   */
  get asV1300(): {value: bigint} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {value: bigint} {
    deprecateLatest()
    return this.asV1300
  }
}
