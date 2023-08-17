import {
    getCookies,
    setCookie,
} from "https://deno.land/std@0.198.0/http/mod.ts";
import { Router } from "./router.ts";
import { page } from "./page.js";

const router = new Router();
const sockets = new Map();
const games = new Map();

router.get("/", ({ req, _ }) => {
    const body = page();
    const headers = new Headers({ "content-type": "text/html" });

    // TODO validate UUID
    if (!getCookies(req.headers).id) {
        setCookie(headers, { id: crypto.randomUUID() });
    }

    const res = new Response(body, { headers });

    return res;
});

router.get("/ws", ({ req }) => {
    if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 });
    }

    const { id } = getCookies(req.headers);

    // TODO validate UUID
    if (!id) {
        return new Response(null, { status: 400 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    sockets.set(id, socket);

    socket.onopen = () => console.log("socket opened");
    socket.onmessage = (e) => {
        console.log(e);
        // TODO route messages to specific sockets
        socket.send("test from server");
    };
    socket.onerror = (e) => console.log("socket errored:", e);
    socket.onclose = () => console.log("socket closed");

    return response;
});

router.post("/new-game", ({ req }) => {
    console.log("test");
    // const body = await req.body;
    // console.log("new", body);
    return new Response("test");
});

Deno.serve((req) => {
    return router.route(req);
});
