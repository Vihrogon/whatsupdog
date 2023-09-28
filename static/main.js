const playGameDialog = document.getElementById('dialog');

document.forms.newGame.addEventListener("submit", async function (event) {
    event.preventDefault();

    const body = JSON.stringify({ name: this.name.value });
    const res = await fetch(this.action, { method: this.method, body: body, headers: {'content-type': 'application/json'} });
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

    const res = await fetch(this.action, { method: this.getAttribute('method').toUpperCase(), body: JSON.stringify({name: event.submitter.value}) });
    const json = await res.json().catch((error) => { return { error: true } });


    if (!json.error) {
        document.forms.playGame.requestSubmit();
    }
});

document.forms.playGame.addEventListener('submit', async function (event) {
    event.preventDefault();
    playGameDialog.showModal();
});
