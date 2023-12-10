const playGameDialog = document.getElementById("dialog");

document.forms.newGame.addEventListener("submit", async function (event) {
    event.preventDefault();

    const body = JSON.stringify({ name: this.name.value });
    const res = await fetch(this.action, {
        method: this.method,
        body: body,
        headers: { "content-type": "application/json" },
    });
    const json = await res.json();

    if (!json.error) {
        document.forms.refreshGames.requestSubmit();
        document.forms.playGame.requestSubmit();
    }
});

document.forms.refreshGames.addEventListener("submit", async function (event) {
    event.preventDefault();

    const res = await fetch(this.action, { method: this.method });
    const json = await res.json();

    if (!json.error) {
        document.forms.joinGame.innerHTML = json.data;
    }
});

document.forms.joinGame.addEventListener("submit", async function (event) {
    event.preventDefault();

    const res = await fetch(this.action, {
        method: this.getAttribute("method").toUpperCase(),
        body: JSON.stringify({ name: event.submitter.value }),
    });
    const json = await res.json().catch((error) => {
        return { error: true };
    });

    if (!json.error) {
        document.forms.playGame.requestSubmit();
    }
});

document.forms.playGame.addEventListener("submit", async function (event) {
    event.preventDefault();
    playGameDialog.showModal();
});

document.forms.exitGame.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("exit", event);
    console.log("exit", this);
    // exit game
});

playGameDialog.addEventListener("close", function (event) {
    event.preventDefault();
    console.log("close", event);
    console.log("close", this);
    // exit game
});


const websocket = new WebSocket("ws://localhost:8000/ws")
websocket.onopen = () => {
    websocket.send('test')
}

websocket.addEventListener('message',function(event) {
    console.dir(event)
})

window.test = function(msg) {
    websocket.send(JSON.stringify({type:'game',name}));
}
