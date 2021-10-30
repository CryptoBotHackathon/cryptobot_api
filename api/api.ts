import { parse } from "https://deno.land/std@0.100.0/flags/mod.ts";
import { Application } from "https://deno.land/x/abc@v1.3.1/mod.ts";
import * as DB from "./db.ts";

const app = new Application();

const { args } = Deno;
const DEFAULT_PORT = 8080;
const argPort = parse(args).port;
const PORT = argPort ? Number(argPort) : DEFAULT_PORT;

console.log(PORT);

console.log(`Listening on Port: ${PORT}`);
console.log(`http://localhost:${PORT}/`);

app
  .get(
    "/",
    () =>
      "https://secret-ocean-93187.herokuapp.com/executable\nhttps://secret-ocean-93187.herokuapp.com/project\nhttps://secret-ocean-93187.herokuapp.com/module\nhttps://secret-ocean-93187.herokuapp.com/number"
  )
  .post("/balance", async (c: any) => {
    const body = await c.body;
    DB.addBalance(body.balance, body.date);
  })
  .start({ port: PORT });
