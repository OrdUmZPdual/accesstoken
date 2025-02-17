<?php
if (!defined('DOKU_INC')) die();

class action_plugin_accesstoken extends DokuWiki_Action_Plugin {

    private $secretKey = "supersecret"; // Dieser Schlüssel muss mit JS übereinstimmen

    public function register(Doku_Event_Handler $controller) {
        $controller->register_hook('DOKUWIKI_STARTED', 'BEFORE', $this, 'checkAccessToken');
        $controller->register_hook('TPL_METAHEADER_OUTPUT', 'BEFORE', $this, 'loadAssets');
    }

    public function loadAssets(Doku_Event $event) {
        $event->data["script"][] = [
            "type" => "text/javascript",
            "src" => DOKU_BASE . "lib/plugins/accesstoken/script.js"
        ];
    }

    public function checkAccessToken() {
    global $ID, $INFO;

    // Falls der Benutzer bereits reguläre Berechtigung hat, nichts tun
    if (auth_quickaclcheck($ID) >= AUTH_READ) {
        return;
    }

    // Token aus der URL holen
    $token = $_GET['token'] ?? null;
    if (!$token) return;

    // Der Token muss ein gültiger SHA256-Hash sein
    if (!preg_match('/^[a-f0-9]{64}$/', $token)) return;

    // Token ist gültig → Temporäre Leseberechtigung geben
    $INFO['userinfo'] = ['name' => 'guest', 'grps' => ['user']];
    $INFO['perm'] = AUTH_READ;
    $INFO['isadmin'] = false;
    $INFO['ismanager'] = false;

    error_log("✅ Temporäre Leserechte für $ID mit Token $token gesetzt!");
}



}
