import { assert, assertExists } from "https://deno.land/std/testing/asserts.ts";

Deno.test("GET /", async () => {
  const response = await fetch("https://127.0.0.1:3000/");

  const resBody = await response.text();
  console.log(resBody);
  assert(response.ok === true);
  assert(response.status === 200);
});
