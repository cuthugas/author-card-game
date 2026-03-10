import { ASSET_MANIFEST } from "../assets/manifest.js";

function makeCanvasTexture(scene, key, width, height, painter) {
  const tex = scene.textures.createCanvas(key, width, height);
  const ctx = tex.getContext();
  painter(ctx, width, height);
  tex.refresh();
}

function stampNoise(ctx, width, height, alpha = 0.06, step = 3) {
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const v = Math.floor(20 + Math.random() * 42);
      ctx.fillStyle = `rgba(${v},${v},${v},${alpha})`;
      ctx.fillRect(x, y, step, step);
    }
  }
}

function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    // Texture keys reserved for external assets when available.
    ASSET_MANIFEST.images.forEach(() => {});

    makeCanvasTexture(this, "panel-base", 512, 160, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#2f261f");
      g.addColorStop(0.5, "#231b16");
      g.addColorStop(1, "#14100d");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      stampNoise(ctx, w, h, 0.045, 2);
      ctx.strokeStyle = "rgba(196,157,93,0.7)";
      ctx.lineWidth = 4;
      ctx.strokeRect(3, 3, w - 6, h - 6);
      ctx.strokeStyle = "rgba(38,26,16,0.85)";
      ctx.lineWidth = 2;
      ctx.strokeRect(8, 8, w - 16, h - 16);
    });

    makeCanvasTexture(this, "panel-edge", 512, 160, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const rg = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.55);
      rg.addColorStop(0, "rgba(241,213,153,0.25)");
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(224,175,102,0.62)";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    makeCanvasTexture(this, "button-base", 320, 120, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#7c4a2d");
      g.addColorStop(0.45, "#5a321f");
      g.addColorStop(1, "#321d14");
      ctx.fillStyle = g;
      roundedRectPath(ctx, 8, 8, w - 16, h - 16, 26);
      ctx.fill();
      const hg = ctx.createLinearGradient(0, 8, 0, h * 0.42);
      hg.addColorStop(0, "rgba(255,235,194,0.46)");
      hg.addColorStop(1, "rgba(255,235,194,0)");
      ctx.fillStyle = hg;
      roundedRectPath(ctx, 16, 14, w - 32, h * 0.34, 18);
      ctx.fill();
      ctx.strokeStyle = "rgba(239,187,110,0.95)";
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.strokeStyle = "rgba(24,14,9,0.95)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,240,209,0.2)";
      ctx.lineWidth = 1;
      roundedRectPath(ctx, 20, 20, w - 40, h - 46, 14);
      ctx.stroke();
      stampNoise(ctx, w, h, 0.05, 3);
    });

    makeCanvasTexture(this, "button-glow", 320, 120, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w * 0.5, h * 0.5, 8, w * 0.5, h * 0.5, w * 0.5);
      g.addColorStop(0, "rgba(244,180,82,0.65)");
      g.addColorStop(1, "rgba(244,180,82,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });

    makeCanvasTexture(this, "card-base", 320, 460, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#4b3a2d");
      g.addColorStop(0.28, "#3b2d23");
      g.addColorStop(0.68, "#2a221d");
      g.addColorStop(1, "#1c1714");
      ctx.fillStyle = g;
      roundedRectPath(ctx, 10, 10, w - 20, h - 20, 24);
      ctx.fill();
      const ig = ctx.createLinearGradient(0, 24, 0, h * 0.5);
      ig.addColorStop(0, "rgba(255,239,203,0.24)");
      ig.addColorStop(1, "rgba(255,239,203,0)");
      ctx.fillStyle = ig;
      roundedRectPath(ctx, 18, 18, w - 36, h * 0.36, 16);
      ctx.fill();
      stampNoise(ctx, w, h, 0.055, 2);
      ctx.strokeStyle = "rgba(21,14,11,0.95)";
      ctx.lineWidth = 5;
      ctx.stroke();
    });

    makeCanvasTexture(this, "card-frame", 320, 460, (ctx, w, h) => {
      roundedRectPath(ctx, 8, 8, w - 16, h - 16, 24);
      ctx.strokeStyle = "rgba(224,178,108,0.92)";
      ctx.lineWidth = 6;
      ctx.stroke();
      roundedRectPath(ctx, 16, 16, w - 32, h - 32, 18);
      ctx.strokeStyle = "rgba(121,87,46,0.95)";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    makeCanvasTexture(this, "card-shadow", 340, 500, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.5);
      g.addColorStop(0, "rgba(0,0,0,0.58)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });

    makeCanvasTexture(this, "particle-fog", 64, 64, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 3, w / 2, h / 2, w / 2);
      g.addColorStop(0, "rgba(215,228,240,0.65)");
      g.addColorStop(1, "rgba(215,228,240,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });

    makeCanvasTexture(this, "particle-ember", 24, 24, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 1, w / 2, h / 2, w / 2);
      g.addColorStop(0, "rgba(255,205,112,0.95)");
      g.addColorStop(0.5, "rgba(255,118,48,0.78)");
      g.addColorStop(1, "rgba(255,118,48,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });

    makeCanvasTexture(this, "icon-attack", 56, 56, (ctx, w, h) => {
      ctx.fillStyle = "rgba(28,12,12,0.8)";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(188,85,66,0.9)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "#ffb1a1";
      ctx.font = "bold 24px Cinzel";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("A", w / 2, h / 2 + 1);
    });

    makeCanvasTexture(this, "icon-defense", 56, 56, (ctx, w, h) => {
      ctx.fillStyle = "rgba(11,20,30,0.82)";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(110,162,208,0.9)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "#b6ddff";
      ctx.font = "bold 24px Cinzel";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("D", w / 2, h / 2 + 1);
    });

    makeCanvasTexture(this, "icon-mem", 56, 56, (ctx, w, h) => {
      ctx.fillStyle = "rgba(30,16,9,0.82)";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(210,176,106,0.92)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "#f7ddb1";
      ctx.font = "bold 24px Cinzel";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("M", w / 2, h / 2 + 1);
    });

    makeCanvasTexture(this, "slot-anchor", 240, 146, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 12, w / 2, h / 2, w * 0.5);
      g.addColorStop(0, "rgba(255,219,158,0.34)");
      g.addColorStop(1, "rgba(255,219,158,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      roundedRectPath(ctx, 6, 8, w - 12, h - 16, 22);
      ctx.strokeStyle = "rgba(214,165,89,0.8)";
      ctx.lineWidth = 3.2;
      ctx.stroke();
      roundedRectPath(ctx, 14, 16, w - 28, h - 32, 16);
      ctx.strokeStyle = "rgba(68,45,23,0.92)";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.strokeStyle = "rgba(246,210,145,0.42)";
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.25, h * 0.5);
      ctx.lineTo(w * 0.75, h * 0.5);
      ctx.moveTo(w * 0.5, h * 0.22);
      ctx.lineTo(w * 0.5, h * 0.78);
      ctx.strokeStyle = "rgba(214,170,105,0.34)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, 18, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(214,170,105,0.42)";
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, 30, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(214,170,105,0.22)";
      ctx.stroke();
    });

    makeCanvasTexture(this, "lane-pulse", 640, 220, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.5);
      g.addColorStop(0, "rgba(239,176,94,0.36)");
      g.addColorStop(1, "rgba(239,176,94,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });

    makeCanvasTexture(this, "vignette", 1024, 768, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.62);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.72)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });

    makeCanvasTexture(this, "deck-back", 180, 240, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#2d3b5d");
      g.addColorStop(1, "#171f32");
      ctx.fillStyle = g;
      roundedRectPath(ctx, 6, 6, w - 12, h - 12, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(192,156,89,0.86)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.strokeStyle = "rgba(33,22,14,0.9)";
      ctx.lineWidth = 2;
      roundedRectPath(ctx, 16, 16, w - 32, h - 32, 10);
      ctx.stroke();
    });

    makeCanvasTexture(this, "center-sigil", 520, 220, (ctx, w, h) => {
      const rg = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.42);
      rg.addColorStop(0, "rgba(230,179,102,0.2)");
      rg.addColorStop(1, "rgba(230,179,102,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(194,145,84,0.72)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.5, 178, 58, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.5, 124, 38, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.5, 92, 26, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(194,145,84,0.42)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.18, h * 0.5);
      ctx.lineTo(w * 0.82, h * 0.5);
      ctx.moveTo(w * 0.5, h * 0.24);
      ctx.lineTo(w * 0.5, h * 0.76);
      ctx.strokeStyle = "rgba(184,132,69,0.4)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      const points = 8;
      for (let i = 0; i < points; i += 1) {
        const a = (Math.PI * 2 * i) / points;
        const x = w * 0.5 + Math.cos(a) * 88;
        const y = h * 0.5 + Math.sin(a) * 26;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(221,178,119,0.65)";
        ctx.fill();
      }
    });

    makeCanvasTexture(this, "hud-link", 420, 72, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, "rgba(208,162,95,0)");
      g.addColorStop(0.5, "rgba(208,162,95,0.42)");
      g.addColorStop(1, "rgba(208,162,95,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(18, h * 0.5);
      ctx.lineTo(w - 18, h * 0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - 22, h * 0.5 - 8);
      ctx.lineTo(w * 0.5, h * 0.5);
      ctx.lineTo(w * 0.5 - 22, h * 0.5 + 8);
      ctx.strokeStyle = "rgba(208,162,95,0.58)";
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.5 + 22, h * 0.5 - 8);
      ctx.lineTo(w * 0.5, h * 0.5);
      ctx.lineTo(w * 0.5 + 22, h * 0.5 + 8);
      ctx.stroke();
    });
  }

  create() {
    this.scene.start("match");
    this.scene.start("fx");
    this.scene.start("ui");
  }
}
