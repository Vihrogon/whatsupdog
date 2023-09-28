import { html } from "../jstt.ts";
import { gamesList } from "./gamesList.js";

export function home(games) {
    const result = html`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>whatsupdog</title>
    <script type="module" src="/static/main.js"></script>
</head>

<body>
<div class="messages">messages:</div>
<div class="send">send</div>

<form id="joinGame" method="patch" action="/games">
    ${gamesList(games)}
</form>

<form id="refreshGames" method="get" action="/games">
    <input type="submit" name="submit" value="refresh games" />
</form>

<form id="newGame" method="post" action="/games">
    <input type="text" name="name" />
    <input type="submit" name="submit" value="create new game" />
</form>

<form id="playGame" method="dialog"></form>

<dialog id="dialog">
    <section>
        game
    </section>
    <form id="exitGame" method="delete" action="/games">
        <button type="submit">close</button>
    </form>
</dialog>

</body>

</html>`;

    return result;
}
