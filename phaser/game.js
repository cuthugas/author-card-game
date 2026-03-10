import { DEFAULT_VIEWPORT } from "./assets/manifest.js";
import { BootScene } from "./scenes/BootScene.js";
import { PreloadScene } from "./scenes/PreloadScene.js";
import { MatchScene } from "./scenes/MatchScene.js";
import { UIScene } from "./scenes/UIScene.js";
import { FXScene } from "./scenes/FXScene.js";

function bootPhaser() {
  const host = document.getElementById("phaser-stage");
  if (!host || !window.Phaser) return;

  const config = {
    type: Phaser.AUTO,
    parent: "phaser-stage",
    width: DEFAULT_VIEWPORT.width,
    height: DEFAULT_VIEWPORT.height,
    transparent: true,
    backgroundColor: "#000000",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, PreloadScene, MatchScene, FXScene, UIScene],
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
  };

  window.__ACG_PHASER = new Phaser.Game(config);
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(bootPhaser, 0);
} else {
  window.addEventListener("DOMContentLoaded", bootPhaser, { once: true });
}
