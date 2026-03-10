(() => {
  function makeNoiseTexture(scene, key, width, height, base, variance, alpha = 255) {
    const tex = scene.textures.createCanvas(key, width, height);
    const ctx = tex.context;
    const img = ctx.createImageData(width, height);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = Math.max(0, Math.min(255, base + ((Math.random() * 2 - 1) * variance)));
      img.data[i] = n * 0.55;
      img.data[i + 1] = n * 0.65;
      img.data[i + 2] = n * 0.78;
      img.data[i + 3] = alpha;
    }
    ctx.putImageData(img, 0, 0);
    tex.refresh();
  }

  class AppalachianScene extends Phaser.Scene {
    constructor() {
      super("AppalachianScene");
      this.layers = {};
    }

    create() {
      const { width, height } = this.scale;
      this.cameras.main.setBackgroundColor("#070a12");

      makeNoiseTexture(this, "noise_fine", 256, 256, 62, 18, 90);
      makeNoiseTexture(this, "noise_soft", 256, 256, 84, 34, 52);

      this.layers.backGlow = this.add.rectangle(width * 0.5, height * 0.45, width * 1.25, height * 1.25, 0x0f1d34, 0.8);
      this.layers.backGlow.setBlendMode(Phaser.BlendModes.SCREEN);

      this.layers.forestSilhouetteA = this.add.graphics();
      this.layers.forestSilhouetteB = this.add.graphics();
      this.layers.groundMist = this.add.graphics();
      this.layers.vignette = this.add.graphics();
      this.layers.lightning = this.add.graphics();

      this.noiseFine = this.add.tileSprite(width * 0.5, height * 0.5, width, height, "noise_fine");
      this.noiseFine.setTint(0x5d7792).setAlpha(0.08).setBlendMode(Phaser.BlendModes.SOFT_LIGHT);

      this.noiseSoft = this.add.tileSprite(width * 0.5, height * 0.5, width, height, "noise_soft");
      this.noiseSoft.setTint(0x89a6bf).setAlpha(0.07).setBlendMode(Phaser.BlendModes.OVERLAY);

      const fogParticles = this.add.particles(0, 0, "noise_soft", {
        x: { min: -100, max: width + 100 },
        y: { min: height * 0.18, max: height * 0.92 },
        speedX: { min: -18, max: 18 },
        speedY: { min: -2, max: 3 },
        scale: { start: 0.9, end: 1.5 },
        alpha: { start: 0.08, end: 0 },
        lifespan: { min: 6000, max: 12000 },
        quantity: 1,
        frequency: 420,
        blendMode: "SCREEN",
      });
      this.layers.fogParticles = fogParticles;

      const fireflies = this.add.particles(0, 0, "noise_fine", {
        x: { min: 0, max: width },
        y: { min: height * 0.22, max: height * 0.95 },
        speedX: { min: -10, max: 10 },
        speedY: { min: -8, max: 6 },
        scale: { start: 0.07, end: 0.01 },
        alpha: { start: 0.42, end: 0 },
        tint: [0xd3a45d, 0x9ac1df],
        lifespan: { min: 1800, max: 3000 },
        frequency: 130,
        quantity: 1,
        blendMode: "ADD",
      });
      this.layers.fireflies = fireflies;

      this.drawForest(width, height);
      this.drawGroundMist(width, height);
      this.drawVignette(width, height);

      this.time.addEvent({
        delay: 3600,
        loop: true,
        callback: () => this.flashLightning(),
      });

      this.scale.on("resize", (gameSize) => {
        this.resizeScene(gameSize.width, gameSize.height);
      });
    }

    flashLightning() {
      const g = this.layers.lightning;
      g.clear();
      const { width, height } = this.scale;
      const x0 = Phaser.Math.Between(Math.floor(width * 0.2), Math.floor(width * 0.8));
      const segs = Phaser.Math.Between(5, 8);
      let x = x0;
      let y = 0;
      g.lineStyle(2.3, 0x8bc6ff, 0.22);
      g.beginPath();
      g.moveTo(x, y);
      for (let i = 0; i < segs; i += 1) {
        x += Phaser.Math.Between(-60, 60);
        y += height / segs;
        g.lineTo(x, y);
      }
      g.strokePath();
      this.tweens.add({
        targets: g,
        alpha: { from: 0.42, to: 0 },
        duration: 260,
        ease: "Cubic.easeOut",
      });
    }

    drawForest(width, height) {
      const a = this.layers.forestSilhouetteA;
      const b = this.layers.forestSilhouetteB;
      a.clear();
      b.clear();

      a.fillStyle(0x0f1a1f, 0.96);
      b.fillStyle(0x111f26, 0.75);

      for (let i = 0; i < 11; i += 1) {
        const x = (i / 10) * width + Phaser.Math.Between(-18, 20);
        const w = Phaser.Math.Between(16, 36);
        const h = Phaser.Math.Between(Math.floor(height * 0.32), Math.floor(height * 0.56));
        a.fillRect(x, height - h, w, h);
      }

      for (let i = 0; i < 18; i += 1) {
        const x = (i / 17) * width + Phaser.Math.Between(-22, 18);
        const w = Phaser.Math.Between(10, 24);
        const h = Phaser.Math.Between(Math.floor(height * 0.22), Math.floor(height * 0.44));
        b.fillRect(x, height - h, w, h);
      }
    }

    drawGroundMist(width, height) {
      const g = this.layers.groundMist;
      g.clear();
      g.fillGradientStyle(0xffffff, 0xffffff, 0x9bbad2, 0x9bbad2, 0.14, 0.14, 0.02, 0.02);
      g.fillEllipse(width * 0.5, height * 0.9, width * 1.2, height * 0.35);
    }

    drawVignette(width, height) {
      const g = this.layers.vignette;
      g.clear();
      g.fillStyle(0x000000, 0.3);
      g.fillRect(0, 0, width, height);
      g.fillStyle(0x000000, 0.0);
      g.fillEllipse(width * 0.5, height * 0.55, width * 0.9, height * 0.8);
      g.setBlendMode(Phaser.BlendModes.MULTIPLY);
    }

    resizeScene(width, height) {
      this.layers.backGlow.setPosition(width * 0.5, height * 0.45).setSize(width * 1.25, height * 1.25);
      this.noiseFine.setPosition(width * 0.5, height * 0.5).setSize(width, height);
      this.noiseSoft.setPosition(width * 0.5, height * 0.5).setSize(width, height);
      this.drawForest(width, height);
      this.drawGroundMist(width, height);
      this.drawVignette(width, height);
    }

    update(time, delta) {
      const d = delta * 0.0006;
      this.noiseFine.tilePositionX += d * 14;
      this.noiseFine.tilePositionY += d * 9;
      this.noiseSoft.tilePositionX -= d * 6;
      this.noiseSoft.tilePositionY += d * 4;
    }
  }

  function bootPhaser() {
    if (!window.Phaser) return;
    const host = document.getElementById("phaser-stage");
    if (!host) return;

    new Phaser.Game({
      type: Phaser.WEBGL,
      parent: "phaser-stage",
      backgroundColor: "#070a12",
      transparent: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: host.clientWidth || window.innerWidth,
        height: host.clientHeight || window.innerHeight,
      },
      scene: [AppalachianScene],
      fps: {
        min: 30,
        target: 60,
        forceSetTimeOut: true,
      },
      render: {
        antialias: true,
        powerPreference: "high-performance",
      },
    });
  }

  window.addEventListener("load", bootPhaser);
})();
