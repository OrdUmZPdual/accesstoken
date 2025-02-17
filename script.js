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

    document.body.addEventListener("click", async function (e) {
        let target = e.target.closest("#share-btn");
        if (!target) return;

        e.preventDefault();
        console.log("✅ Button wurde geklickt!");

        let urlParams = new URLSearchParams(window.location.search);
        let page = urlParams.get("id") || "start";

        // 🔥 Fix 1: `:` statt `/` in der ID für DokuWiki
        page = decodeURIComponent(page).replace(/\//g, ":").trim();

        // 🔥 Fix 2: Base-URL inkl. `/OrdUm-ZP_Wiki/` setzen
        let baseUrl = window.location.origin + "/OrdUm-ZP_Wiki/";

        let token = await sha256(page + Date.now());
        let shareUrl = baseUrl + "doku.php?id=" + page + "&token=" + token;
        
        console.log("🔗 Generierter Link:", shareUrl);

        navigator.clipboard.writeText(shareUrl).then(() => {
            alert("🔗 Link kopiert:\n" + shareUrl);
        }).catch(err => {
            console.error("❌ Fehler beim Kopieren:", err);
        });
    });
});

// Hash-Funktion (SHA-256)
async function sha256(str) {
    let buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
