export class WinnerOverlay extends Phaser.GameObjects.Container {
  constructor(scene, onRestart) {
    super(scene, scene.scale.width * 0.5, scene.scale.height * 0.5);
    this.scene = scene;
    this.onRestart = onRestart;

    this.scrim = scene.add.rectangle(0, 0, scene.scale.width, scene.scale.height, 0x04070d, 0.76);
    this.panel = scene.add.image(0, 0, "panel-base").setDisplaySize(560, 300).setTint(0x2a1d13);
    this.edge = scene.add.image(0, 0, "panel-edge").setDisplaySize(566, 306).setAlpha(0.9);

    this.title = scene.add
      .text(0, -58, "VICTORY", {
        fontFamily: "Cinzel",
        fontSize: "58px",
        color: "#f6e5bd",
        stroke: "#140e0a",
        strokeThickness: 7,
      })
      .setOrigin(0.5);

    this.reason = scene.add
      .text(0, 2, "", {
        fontFamily: "Spectral",
        fontSize: "28px",
        color: "#d2c1a1",
      })
      .setOrigin(0.5);

    this.restartBtn = scene.add.container(0, 86);
    this.btnGlow = scene.add.image(0, 0, "button-glow").setDisplaySize(246, 84).setAlpha(0.35);
    this.btnBase = scene.add.image(0, 0, "button-base").setDisplaySize(220, 66);
    this.btnText = scene.add
      .text(0, 0, "Play Again", {
        fontFamily: "Cinzel",
        fontSize: "30px",
        color: "#f6e6c0",
        stroke: "#180f09",
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    this.restartBtn.add([this.btnGlow, this.btnBase, this.btnText]);
    this.restartBtn.setSize(220, 66);
    this.btnBase.setInteractive({ useHandCursor: true });
    this.btnBase.on("pointerover", () => {
      this.scene.tweens.add({ targets: this.restartBtn, scaleX: 1.04, scaleY: 1.04, duration: 110 });
      this.scene.tweens.add({ targets: this.btnGlow, alpha: 0.62, duration: 110 });
    });
    this.btnBase.on("pointerout", () => {
      this.scene.tweens.add({ targets: this.restartBtn, scaleX: 1, scaleY: 1, duration: 110 });
      this.scene.tweens.add({ targets: this.btnGlow, alpha: 0.35, duration: 110 });
    });
    this.btnBase.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      this.onRestart?.();
    });

    this.add([this.scrim, this.panel, this.edge, this.title, this.reason, this.restartBtn]);
    this.setDepth(1500);
    this.setVisible(false);
    this.setAlpha(0);

    scene.add.existing(this);
    scene.scale.on("resize", (size) => this.layout(size.width, size.height));
  }

  layout(width, height) {
    this.setPosition(width * 0.5, height * 0.5);
    this.scrim.setSize(width, height);
    const compact = width < 900 || height < 600;
    const pw = compact ? Math.min(width * 0.88, 440) : width < 1100 ? Math.min(width * 0.82, 500) : 560;
    const ph = compact ? Math.min(height * 0.72, 250) : width < 1100 ? Math.min(height * 0.56, 280) : 300;
    this.panel.setDisplaySize(pw, ph);
    this.edge.setDisplaySize(pw + 6, ph + 6);
    this.title.setFontSize(compact ? 34 : width < 1100 ? 48 : 58);
    this.title.setPosition(0, -ph * 0.2);
    this.reason.setFontSize(compact ? "18px" : "28px");
    this.reason.setPosition(0, 2);
    this.btnGlow.setDisplaySize(compact ? 190 : 246, compact ? 64 : 84);
    this.btnBase.setDisplaySize(compact ? 172 : 220, compact ? 48 : 66);
    this.btnText.setFontSize(compact ? "22px" : "30px");
    this.restartBtn.setSize(compact ? 172 : 220, compact ? 48 : 66);
    this.restartBtn.setPosition(0, ph * (compact ? 0.24 : 0.28));
  }

  show(data) {
    const isVictory = data?.winner === "player";
    this.title.setText(isVictory ? "VICTORY" : "DEFEAT");
    this.title.setColor(isVictory ? "#f5e2b5" : "#f0b8b8");
    const reason = data?.reason === "knowledge" ? "Knowledge track reached" : "Reputation reduced to zero";
    this.reason.setText(reason);

    this.setVisible(true);
    this.y += 18;
    this.setAlpha(0);
    this.scene.tweens.add({ targets: this, alpha: 1, y: this.scene.scale.height * 0.5, duration: 220, ease: "Back.Out" });
  }

  hide() {
    if (!this.visible) return;
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 160,
      onComplete: () => this.setVisible(false),
    });
  }
}
