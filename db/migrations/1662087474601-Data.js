module.exports = class Data1662087474601 {
  name = 'Data1662087474601'

  async up(db) {
    await db.query(`CREATE TABLE "reward" ("id" character varying NOT NULL, "balance" numeric NOT NULL, "timestamp" numeric NOT NULL, "date_month" text NOT NULL, "account" text NOT NULL, CONSTRAINT "PK_a90ea606c229e380fb341838036" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "reward"`)
  }
}
