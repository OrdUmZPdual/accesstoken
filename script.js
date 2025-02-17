document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script.js läuft!");

    let tools = document.querySelector("#dokuwiki__pagetools ul");

    if (tools && !document.getElementById("share-btn")) {
        let shareBtn = document.createElement("li");
        shareBtn.classList.add("plugin_accesstoken");
        shareBtn.innerHTML = `
            <a href="#" id="share-btn" title="Seite teilen">
                <img src="${DOKU_BASE}lib/plugins/accesstoken/share.svg" alt="Seite teilen">
            </a>`;
        tools.appendChild(shareBtn);
    }

    // Event-Listener NUR EINMAL registrieren!
    document.body.removeEventListener("click", generateShareLink); // Falls doppelt
    document.body.addEventListener("click", generateShareLink);
});

async function generateShareLink(e) {
    let target = e.target.closest("#share-btn");
    if (!target) return;

    e.preventDefault();
    console.log("✅ Button wurde geklickt!");

    let urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get("id") || "start"; // Falls keine ID vorhanden, nutze "start"
    page = decodeURIComponent(page).replace(/:/g, "/").trim(); // Namensräume angleichen

    let token = await sha256(page + Date.now());
    let baseUrl = "http://halvar01.ba-cw.verwalt-berlin.de/";
    let shareUrl = baseUrl + "doku.php?id=" + page + "&token=" + token;

    
    console.log("🔗 Generierter Link:", shareUrl);

    // Nachricht nur EINMAL anzeigen
    alert("🔗 Link kopiert:\n" + shareUrl);
    
    navigator.clipboard.writeText(shareUrl).catch(err => {
        console.error("❌ Fehler beim Kopieren:", err);
    });
}

// Hash-Funktion (SHA-256)
async function sha256(str) {
    let buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
