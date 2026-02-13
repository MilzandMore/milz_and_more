// Wir nutzen "window.", um sicherzugehen, dass es nur einmal existiert
if (!window.logoImg) {
    window.logoImg = null;
}
var isAdmin = false; 

function preload() {
    // Falls das Logo nicht lädt, wird der Fehler hier abgefangen
    try {
        window.logoImg = loadImage('logo.png');
    } catch (e) {
        console.log("Logo konnte nicht geladen werden.");
    }
}
