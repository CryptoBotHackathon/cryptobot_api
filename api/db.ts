import { MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

import { Logger } from "https://deno.land/x/loggaby/mod.ts";

const logger = new Logger(true);

const mongoDbPassword = Deno.env.get("mongoDbPassword");

if (!mongoDbPassword) {
	logger.error('No "mongoDbPassword" enviroment variable found');
	Deno.exit();
}

const client = new MongoClient();

const mongoClusterNumber = 1;

await client.connect({
	db: "roeh",
	tls: true,
	servers: [
		{
			host: `cluster0-shard-00-0${mongoClusterNumber}.3htzt.mongodb.net`,
			port: 27017,
		},
	],

	credential: {
		username: "iccee0",
		password: mongoDbPassword,
		db: "CryptoBotHackathon",
		mechanism: "SCRAM-SHA-1",
	},
});

export enum Operation {
	buy,
	sell
}

interface payment {
  _id: { $oid: string };
  coinName: string;
  amount: number;
  operation: Operation;
  transactionDate: Date;
}

interface balance {
  _id: { $oid: string };
  balance: number;
  date: Date;
}

const db = client.database("CryptoBotHackathon");

const MongoPayments = db.collection<payment>("payment");
const MongoBalances = db.collection<balance>("balance");

export async function getPayments() {
	return await MongoPayments.find(undefined, {
		noCursorTimeout: false,
	} as any).toArray();
}

export async function getBalance() {
	return await MongoBalances.find(undefined, {
		noCursorTimeout: false,
	} as any).toArray();
}

export async function addPayment(coinName: string, amount: number, operation: Operation, transactionDate: Date) {
  await MongoPayments.insertOne({
		coinName: coinName,
		amount: amount,
		operation: operation,
		transactionDate: transactionDate,
  });
}

export async function addBalance(balance: number, date: Date) {
  await MongoBalances.insertOne({
		balance: balance,
		date: date
  });
}
