import { html } from "./jstt.ts";

export function page() {
    return html`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>whatsupdog</title>
    <script type="module">
    </script>
</head>

<body>
<div class="messages">messages:</div>
<div class="send">send</div>

<form method="POST" action="/new-game">
    <input type="text" name="name" placehonlder="name" />
    <input type="submit" name="submit" value="create new game" />
</form>

</body>

</html>`;
}
