import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {AssetStatus} from "./_assetStatus"

@Entity_()
export class Transfer {
  constructor(props?: Partial<Transfer>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("text", {nullable: true})
  to!: string | undefined | null

  @Column_("text", {nullable: true})
  from!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balance!: bigint

  @Column_("varchar", {length: 11, nullable: false})
  status!: AssetStatus
}
