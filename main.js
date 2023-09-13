import {
    getCookies,
    setCookie,
} from "https://deno.land/std@0.198.0/http/mod.ts";
import { Router } from "./deno-helpers/router.js";
import { home } from "./templates/home.js";
import { gamesList } from "./templates/gamesList.js";

const router = new Router();
const sockets = new Map();
const games = new Map();

router.static();

router.get("/", ({ req, _ }) => {
    const body = home(games);
    const headers = new Headers({ "content-type": "text/html" });
    // TODO validate UUID
    if (!getCookies(req.headers).id) {
        // setCookie(headers, { id: crypto.randomUUID() });
        headers.set("set-cookie", `id=${crypto.randomUUID()}`);
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

router.get("/games", ({ req }) => {
    let body = gamesList(games);
    const res = { error: false, data: body };

    return new Response(JSON.stringify(res), {
        headers: { "content-type": "application/json" },
    });
});

router.post("/games", async ({ req }) => {
    const body = await getBody(req);
    const { id } = getCookies(req.headers);
    const res = { error: true, data: "cannot create new game" };
    let proceed = true;

    if (!id || !/^\w{3,27}$/.test(body.name) || games.has(body.name)) {
        proceed = false;
    }

    if (proceed) {
        for (let [key, value] of games) {
            if (value.includes(id)) {
                proceed = false;
                break;
            }
        }
    }

    if (proceed) {
        games.set(body.name, [id]);
        res.error = false;
        res.data = "game created";
    }

    return new Response(JSON.stringify(res), {
        headers: { "content-type": "application/json" },
    });
});

Deno.serve((req, remote) => {
    // TODO something with remote
    return router.route(req);
});

async function getBody(req) {
    let result = null;
    try {
        result = await req.json();
    } catch (e) {
        console.error(e);
    }
    return result;
}
