import { Application, Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { parse } from "https://deno.land/std@0.100.0/flags/mod.ts";
import { validateJwt } from "https://deno.land/x/djwt@v1.5/validate.ts";
import { makeJwt, setExpiration,Jose,Payload } from "https://deno.land/x/djwt@v1.5/create.ts";

const app = new Application();
const { args } = Deno;

const DEFAULT_PORT = 8080;
const argPort = parse(args).port;
const PORT = argPort ? Number(argPort) : DEFAULT_PORT;

console.log(`Listening on Port: ${PORT}`);
console.log(`http://localhost:${PORT}/`);


const key = "mynameisxyzekpot";

const header: Jose = {
    alg: "HS256",
    typ: "JWT",
}

let payloader = (name:string) => {
  let payload:Payload = {
    iss: name,
    exp: setExpiration(new Date("2021-01-01"))
  }
  return payload
}

const generateJWT = (name:string) => {
  return makeJwt({ key:key, header, payload:payloader(name) })
}

const validateToken = (token: string) => {
  return validateJwt({ jwt: token, key: key, algorithm: header.alg });
};

//create a new instance of router
const router = new Router();
router
    .post("/generate", async (context) => {
        let body: any = await context.request.body();
        const { name } = await body.value;
        let token = await generateJWT(name)
        context.response.body = { status: true, data: name,token:token };
    })
    .post("/validate", async (context) => {
        let body: any = await context.request.body();
        const { token } = await body.value;
        console.log(token);
        
        let validator =  await validateToken(token)
        context.response.body = {validator};
  })
  .get("/test", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/user", (context) => {
    context.response.body = "My name is Wisdom Ekpot";
  })
  app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: PORT });