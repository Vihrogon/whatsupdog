import { html } from "../jstt.ts";

export function gamesList(games) {
    let result = "";

    games.forEach((value, key) => {
        result += html`<div class="game">
    <span>${key}</span>
    <span>${value}</span>
    <button type="submit" value="${key}">join game</button>
</div>`;
    });

    return result;
}
