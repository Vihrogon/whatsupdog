import { serveTls } from "https://deno.land/std/http/mod.ts";
import { loadSync } from "https://deno.land/std/dotenv/mod.ts";

switch (Deno.env.get("ENV")) {
  case "dev":
  default:
    loadSync({
      export: true,
      envPath: "./dev/.env",
      defaultsPath: "./dev/.env.defaults",
      examplePath: "./dev/.env.example",
    });
}

function handler(_req: Request) {
  return new Response();
}

serveTls(handler, {
  hostname: Deno.env.get("HOST"),
  port: Number(Deno.env.get("PORT")),
  keyFile: Deno.env.get("KEY"),
  certFile: Deno.env.get("CERT"),
  onListen: () => {
    console.log("whatsupdog?");
  },
});
