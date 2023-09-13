import { html } from "../jstt.ts";

export function gamesList(games) {
    let result = "";

    games.forEach((value, key) => {
        result += html`<div>
    <span>${key}</span>
    <span>${value}</span>
</div>`;
    });

    return result;
}
