import { parse } from "https://deno.land/std@0.100.0/flags/mod.ts";
import { Application } from "https://deno.land/x/abc@v1.3.1/mod.ts";
import { DefaultCORSConfig, cors } from "https://deno.land/x/abc@v1.3.1/middleware/cors.ts";
import * as DB from "./db.ts";

const app = new Application();
app.use(cors(DefaultCORSConfig));

const { args } = Deno;
const DEFAULT_PORT = 8080;
const argPort = parse(args).port;
const PORT = argPort ? Number(argPort) : DEFAULT_PORT;

console.log(PORT);

console.log(`Listening on Port: ${PORT}`);
console.log(`http://localhost:${PORT}/`);

app
  .get("/payments", async () => await DB.getPayments())
  .get("/balance", async () => await DB.getBalance())
  .post("/payments", async (c: any) => {
    const body = await c.body;    
    const operation = body.operation == "buy" ? DB.Operation.buy : DB.Operation.sell;
    DB.addPayment(body.coinName, body.amount, operation, body.date);
  })
  .post("/balance", async (c: any) => {
    const body = await c.body;
    DB.addBalance(body.balance, body.date);
  })
  .start({ port: PORT });
