const saveButton = document.getElementById("saveButton");
saveButton.onclick = saveProfilePicture;
async function saveProfilePicture() {
    const code = sessionStorage.getItem("session-id");
    const pic = JSON.parse(sessionStorage.getItem("profile-picture"));
    if (!code || !pic) {
        console.log("Fehlende Sitzungsdaten.");
        return;
    }
    try {
        const ipRes = await fetch("../../api/ip.txt");
        const baseUrl = (await ipRes.text()).trim();
        const res = await fetch(baseUrl + "/skins/profilepic", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code,
                pic
            })
        });
        const data = await res.json();
        if (data.ok) {
            console.log("Profilbild gespeichert.");
        } else {
            console.log("Speichern fehlgeschlagen.");
        }
    } catch (err) {
        console.error(err);
        console.log("Netzwerkfehler.");
    }
}