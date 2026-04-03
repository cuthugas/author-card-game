import { ASSET_MANIFEST } from "../assets/manifest.js";
import { WONDERLAND_BACKGROUND_ASSETS } from "../assets/backgroundManifest.js";

const WONDERLAND_DEBUG_KEYS = new Set(["bg_base_field", "bg_frame_border"]);

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

function ensureWonderlandBackgroundPlaceholders(scene) {
  const ensureTexture = (key, width, height, painter) => {
    if (scene.textures.exists(key)) return;
    makeCanvasTexture(scene, key, width, height, painter);
    scene.registry.set(`wonderlandTextureOrigin:${key}`, "placeholder");
    console.info("[Wonderland BG][placeholder]", { key, width, height, origin: "placeholder" });
  };

  ensureTexture("bg_base_field", 1600, 900, (ctx, w, h) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#17314f");
    sky.addColorStop(0.45, "#1d2740");
    sky.addColorStop(1, "#132035");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const glow = ctx.createRadialGradient(w * 0.5, h * 0.46, 20, w * 0.5, h * 0.46, w * 0.45);
    glow.addColorStop(0, "rgba(150, 204, 255, 0.16)");
    glow.addColorStop(1, "rgba(150, 204, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    const field = ctx.createLinearGradient(0, h * 0.56, 0, h);
    field.addColorStop(0, "#2f5136");
    field.addColorStop(1, "#1e3727");
    ctx.fillStyle = field;
    ctx.fillRect(0, h * 0.56, w, h * 0.44);
  });

  ensureTexture("bg_surface_motifs", 1600, 900, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(244, 226, 183, 0.08)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i += 1) {
      const x = 110 + i * 185;
      ctx.strokeRect(x, h * 0.12, 84, 118);
    }
    for (let i = 0; i < 6; i += 1) {
      const x = 140 + i * 230;
      const y = h * 0.7 + ((i % 2) * 18);
      ctx.beginPath();
      ctx.arc(x, y, 30, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 36, y - 10, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  ensureTexture("bg_frame_border", 1600, 900, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(226, 194, 136, 0.92)";
    ctx.lineWidth = 18;
    ctx.strokeRect(14, 14, w - 28, h - 28);
    ctx.strokeStyle = "rgba(84, 55, 31, 0.95)";
    ctx.lineWidth = 7;
    ctx.strokeRect(34, 34, w - 68, h - 68);
    ctx.strokeStyle = "rgba(255, 238, 205, 0.18)";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, w - 96, h - 96);
  });

  const paintCorner = (flipX = false, flipY = false) => (ctx, w, h) => {
    ctx.save();
    ctx.translate(flipX ? w : 0, flipY ? h : 0);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(119, 37, 58, 0.96)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(w * 0.05, h * 0.03, w * 0.18, h * 0.06, w * 0.34, h * 0.08);
    ctx.bezierCurveTo(w * 0.2, h * 0.19, w * 0.1, h * 0.3, 0, h * 0.44);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(219, 196, 145, 0.58)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(36, 18);
    ctx.bezierCurveTo(80, 52, 122, 96, 158, 146);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(108, 30);
    ctx.bezierCurveTo(128, 58, 150, 88, 178, 116);
    ctx.stroke();

    ctx.fillStyle = "rgba(183, 32, 66, 0.92)";
    for (let i = 0; i < 3; i += 1) {
      const x = 62 + i * 44;
      const y = 28 + i * 26;
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(248, 228, 195, 0.22)";
      ctx.beginPath();
      ctx.arc(x - 4, y - 4, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(183, 32, 66, 0.92)";
    }
    ctx.restore();
  };

  ensureTexture("bg_corner_tl", 240, 240, paintCorner(false, false));
  ensureTexture("bg_corner_tr", 240, 240, paintCorner(true, false));
  ensureTexture("bg_corner_bl", 240, 240, paintCorner(false, true));
  ensureTexture("bg_corner_br", 240, 240, paintCorner(true, true));

  ensureTexture("bg_atmosphere", 1600, 900, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const haze = ctx.createRadialGradient(w * 0.5, h * 0.44, 30, w * 0.5, h * 0.44, w * 0.48);
    haze.addColorStop(0, "rgba(181, 220, 255, 0.22)");
    haze.addColorStop(0.45, "rgba(181, 220, 255, 0.1)");
    haze.addColorStop(1, "rgba(181, 220, 255, 0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, w, h);

    const lowerMist = ctx.createLinearGradient(0, h * 0.54, 0, h);
    lowerMist.addColorStop(0, "rgba(214, 239, 255, 0)");
    lowerMist.addColorStop(1, "rgba(214, 239, 255, 0.2)");
    ctx.fillStyle = lowerMist;
    ctx.fillRect(0, h * 0.54, w, h * 0.46);
  });
}

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    // Texture keys reserved for external assets when available.
    ASSET_MANIFEST.images.forEach((asset) => {
      if (asset.path) this.load.image(asset.key, asset.path);
    });
    WONDERLAND_BACKGROUND_ASSETS.forEach((asset) => {
      if (asset.externalPath) {
        this.registry.set(`wonderlandTexturePath:${asset.key}`, asset.externalPath);
        this.load.image(asset.key, asset.externalPath);
      }
    });

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
      g.addColorStop(0, "#355845");
      g.addColorStop(0.52, "#23362c");
      g.addColorStop(1, "#16231d");
      ctx.fillStyle = g;
      roundedRectPath(ctx, 6, 6, w - 12, h - 12, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(201,168,104,0.84)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.strokeStyle = "rgba(28,21,14,0.88)";
      ctx.lineWidth = 2;
      roundedRectPath(ctx, 16, 16, w - 32, h - 32, 10);
      ctx.stroke();
      ctx.strokeStyle = "rgba(244, 231, 196, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w * 0.24, h * 0.5);
      ctx.lineTo(w * 0.76, h * 0.5);
      ctx.moveTo(w * 0.5, h * 0.26);
      ctx.lineTo(w * 0.5, h * 0.74);
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
    WONDERLAND_BACKGROUND_ASSETS.forEach((asset) => {
      if (!WONDERLAND_DEBUG_KEYS.has(asset.key)) return;
      const existsBeforeFallback = this.textures.exists(asset.key);
      const texture = existsBeforeFallback ? this.textures.get(asset.key) : null;
      const source = texture?.getSourceImage?.();
      const width = source?.width || texture?.source?.[0]?.width || null;
      const height = source?.height || texture?.source?.[0]?.height || null;
      const origin = existsBeforeFallback && asset.externalPath ? "external" : "missing";
      if (existsBeforeFallback && asset.externalPath) {
        this.registry.set(`wonderlandTextureOrigin:${asset.key}`, "external");
      }
      console.info("[Wonderland BG][pre-fallback]", {
        key: asset.key,
        exists: existsBeforeFallback,
        width,
        height,
        origin,
        path: asset.externalPath || null,
      });
    });

    ensureWonderlandBackgroundPlaceholders(this);
    this.scene.start("match");
    this.scene.start("fx");
    this.scene.start("ui");
  }
}
