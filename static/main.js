document.forms.newGame.addEventListener("submit", async function (event) {
    event.preventDefault();

    let body = JSON.stringify({ name: this.name.value });
    let res = await fetch(this.action, { method: this.method, body: body });
    let json = await res.json();
    console.log("post:", json);

    if (!json.error) {
        document.forms.refreshGames.requestSubmit();
    }
});

document.forms.refreshGames.addEventListener("submit", async function (event) {
    event.preventDefault();

    let res = await fetch(this.action, { method: this.method });
    let json = await res.json();
    console.log("get:", json);

    if (!json.error) {
        document.getElementById("gamesList").innerHTML = json.data;
    }
});
