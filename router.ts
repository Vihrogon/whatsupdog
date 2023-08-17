type Route = {
  pattern: URLPattern;
  handler: Function;
};

/**
 * A Router designed to work with Deno native server
 *
 * **CAN THROW!**
 */
export class Router {
  #routes = new Map<string, Route[]>([["GET", []], ["POST", []]]);

  #add(method: string, pathname: string, handler: Function) {
    if (typeof pathname !== "string" || pathname === "") {
      throw new Error("Invalid pathname");
    }

    this.#routes.get(method)!.push({
      pattern: new URLPattern({ pathname }),
      handler,
    });
  }

  get(pathname: string, handler: Function) {
    this.#add("GET", pathname, handler);
  }

  post(pathname: string, handler: Function) {
    this.#add("POST", pathname, handler);
  }

  async route(req: Request): Promise<Response> {
    let status = 405;

    if (this.#routes.has(req.method)) {
      for (const { pattern, handler } of this.#routes.get(req.method) || []) {
        if (pattern.test(req.url)) {
          const params = pattern.exec(req.url)!.pathname.groups;
          try {
            return await handler({ req, params });
          } catch (error) {
            console.error(error);
            status = 500;
          }
        } else {
          status = 404;
        }
      }
    }

    return new Response(null, { status });
  }
}

import {
  assert,
  assertThrows,
} from "https://deno.land/std@0.172.0/testing/asserts.ts";

Deno.test("Router - invalid pathname throws", () => {
  const router = new Router();
  assertThrows(
    () => router.get("", () => {}),
    Error,
    "Invalid pathname",
  );
});
Deno.test("Router - get route with params works", async () => {
  const router = new Router();
  router.get("/test/:id", async ({ params }) => {
    return new Response(`test, ${params.id}!`);
  });
  const response = await router.route(
    new Request("http://localhost/test/123"),
  );
  assert(await response.text(), "test, 123!");
});

Deno.test("Router - post route with body works", async () => {
  const router = new Router();
  router.post("/test", async ({ req }) => {
    const body = await req.json();
    return new Response(`test, ${body.test}!`);
  });
  const response = await router.route(
    new Request("http://localhost/test", {
      method: "POST",
      body: JSON.stringify({ test: "TEST" }),
    }),
  );
  assert(await response.text(), "test, TEST!");
});

Deno.test("Router - unknown method returns 405", async () => {
  const router = new Router();
  const response = await router.route(
    new Request("http://localhost/test", { method: "TEST" }),
  );
  assert(response.status, 405);
});

Deno.test("Router - unknown route returns 404", async () => {
  const router = new Router();
  router.get("/test", async () => {});
  const response = await router.route(
    new Request("http://localhost/bar"),
  );
  assert(response.status, 404);
});

Deno.test("Router - server error returns 500", async () => {
  const router = new Router();
  router.get("/test", async () => {
    throw new Error("TEST");
  });
  const response = await router.route(
    new Request("http://localhost/test"),
  );
  assert(response.status, 500);
});
