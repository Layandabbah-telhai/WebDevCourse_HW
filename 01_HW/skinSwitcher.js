
const skins = [
  "SKINS/basic.css",
  "SKINS/dark.css",
  "SKINS/modern.css"
];

let currentSkinIndex = 0;

function switchSkin() {
  const link = document.getElementById("skinStylesheet");
  if (!link) return;

  
  currentSkinIndex = (currentSkinIndex + 1) % skins.length;
  link.href = skins[currentSkinIndex];
}


document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("skinButton");
  if (btn) {
    btn.addEventListener("click", switchSkin);
  }
});
