module.exports = class Data1660727697807 {
  name = 'Data1660727697807'

  async up(db) {
    await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "asset_id" text NOT NULL, "to" text, "from" text, "balance" numeric NOT NULL, "status" character varying(11) NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "transfer"`)
  }
}
