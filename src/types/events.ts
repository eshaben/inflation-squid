import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result} from './support'

export class ParachainStakingDelegatorDueRewardEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.DelegatorDueReward')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Delegator, Collator, Due reward (as per counted delegation for collator)
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.DelegatorDueReward') === 'dfcae516f053c47e7cb49e0718f01587efcb64cea4e3baf4c6973a29891f7841'
  }

  /**
   * Delegator, Collator, Due reward (as per counted delegation for collator)
   */
  get asV1001(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingRewardedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.Rewarded')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Paid the account (nominator or collator) the balance as liquid rewards
   */
  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.Rewarded') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * Paid the account (nominator or collator) the balance as liquid rewards
   */
  get asV900(): [Uint8Array, bigint] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Paid the account (delegator or collator) the balance as liquid rewards.
   */
  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.Rewarded') === '44a7364018ebad92746e4ca7c7c23d24d5da43cda2e63a90c665b522994ef1e2'
  }

  /**
   * Paid the account (delegator or collator) the balance as liquid rewards.
   */
  get asV1300(): {account: Uint8Array, rewards: bigint} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }
}
