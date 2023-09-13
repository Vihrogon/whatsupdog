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

<div id="gamesList">
    ${gamesList(games)}
</div>

<form id="newGame" method="POST" action="/games">
    <input type="text" name="name" />
    <input type="submit" name="submit" value="create new game" />
</form>

<form id="refreshGames" method="GET" action="/games">
    <input type="submit" name="submit" value="refresh games" />
</form>

</body>

</html>`;

    return result;
}
