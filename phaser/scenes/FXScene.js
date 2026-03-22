export class FXScene extends Phaser.Scene {
  constructor() {
    super("fx");
  }

  create() {
    this.overlay = this.add.container(0, 0);

    this.fog = this.add.particles(0, 0, "particle-fog", {
      x: { min: 0, max: this.scale.width },
      y: { min: 0, max: this.scale.height },
      lifespan: 14000,
      speedX: { min: -9, max: 9 },
      speedY: { min: -2, max: 2 },
      quantity: 1,
      frequency: 250,
      scale: { start: 0.2, end: 1.8 },
      alpha: { start: 0.06, end: 0 },
      blendMode: "SCREEN",
    });

    this.embers = this.add.particles(0, this.scale.height, "particle-ember", {
      x: { min: 0, max: this.scale.width },
      y: { min: this.scale.height - 120, max: this.scale.height + 40 },
      lifespan: 2800,
      speedY: { min: -40, max: -90 },
      speedX: { min: -12, max: 12 },
      quantity: 2,
      frequency: 150,
      scale: { start: 0.24, end: 0 },
      alpha: { start: 0.42, end: 0 },
      blendMode: "ADD",
    });

    this.hitTextLayer = this.add.container(0, 0);
    this.overlay.add([this.hitTextLayer]);

    window.addEventListener("acg:fx", (e) => this.playFx(e.detail));

    this.scale.on("resize", () => {});
  }

  playFx(detail = {}) {
    const w = this.scale.width;
    const h = this.scale.height;
    let x = w * 0.5;
    let y = h * 0.5;

    if (detail.side === "player") {
      x = w * 0.5;
      y = h - 50;
    } else if (detail.side === "ai") {
      x = w * 0.5;
      y = 52;
    }

    const color = detail.kind === "heal" ? "#9ef3b2" : detail.kind === "info" ? "#a5cfff" : "#ff9d9d";
    const txt = this.add
      .text(x, y, detail.text || "HIT", {
        fontFamily: "Cinzel",
        fontSize: detail.fontSize || (detail.kind === "info" ? "22px" : "28px"),
        color,
        stroke: "#120b08",
        strokeThickness: 4,
        align: "center",
        wordWrap: detail.maxWidth ? { width: detail.maxWidth, useAdvancedWrap: true } : undefined,
      })
      .setOrigin(0.5)
      .setDepth(900);

    this.hitTextLayer.add(txt);
    this.tweens.add({
      targets: txt,
      y: y - 52,
      alpha: 0,
      duration: 660,
      ease: "Quad.Out",
      onComplete: () => txt.destroy(),
    });

    if (detail.kind === "hit") {
      this.cameras.main.shake(175, 0.0019);
    }
  }
}
