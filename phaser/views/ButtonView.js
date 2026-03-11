export class ButtonView extends Phaser.GameObjects.Container {
  constructor(scene, x, y, label, onClick) {
    super(scene, x, y);
    this.scene = scene;
    this.shadow = scene.add.rectangle(0, 8, 150, 44, 0x090606, 0.35).setOrigin(0.5);
    this.bevel = scene.add.rectangle(0, -15, 128, 14, 0xffe4b4, 0.16).setOrigin(0.5);
    this.bg = scene.add.image(0, 0, "button-base").setDisplaySize(164, 58);
    this.glow = scene.add.image(0, 0, "button-glow").setDisplaySize(184, 70).setAlpha(0.28);
    this.text = scene.add
      .text(0, 0, label, {
        fontFamily: "Cinzel",
        fontSize: "24px",
        color: "#f7e7bf",
        stroke: "#22180f",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add([this.shadow, this.glow, this.bg, this.bevel, this.text]);
    this.setSize(164, 58);
    this.setInteractive({ useHandCursor: true });

    this.enabled = true;
    this.on("pointerover", () => {
      if (!this.enabled) return;
      scene.tweens.add({ targets: this, scaleX: 1.05, scaleY: 1.05, duration: 110, ease: "Quad.Out" });
      scene.tweens.add({ targets: this.glow, alpha: 0.68, duration: 110, ease: "Quad.Out" });
      scene.tweens.add({ targets: this.shadow, alpha: 0.48, y: 10, duration: 110 });
      scene.tweens.add({ targets: this.bevel, alpha: 0.28, duration: 110 });
    });
    this.on("pointerout", () => {
      if (!this.enabled) return;
      scene.tweens.add({ targets: this, scaleX: 1, scaleY: 1, duration: 120, ease: "Quad.Out" });
      scene.tweens.add({ targets: this.glow, alpha: 0.28, duration: 120, ease: "Quad.Out" });
      scene.tweens.add({ targets: this.shadow, alpha: 0.35, y: 8, duration: 120 });
      scene.tweens.add({ targets: this.bevel, alpha: 0.16, duration: 120 });
    });
    this.on("pointerdown", () => {
      if (!this.enabled) return;
      scene.tweens.add({ targets: this, scaleX: 0.975, scaleY: 0.975, y: this.y + 1.5, yoyo: true, duration: 72 });
      scene.tweens.add({ targets: this.shadow, alpha: 0.22, yoyo: true, duration: 72 });
      onClick?.();
    });

    scene.add.existing(this);
    this.setLayout("default");
  }

  setLabel(label) {
    this.text.setText(label);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    this.disableInteractive();
    if (enabled) {
      this.setInteractive({ useHandCursor: true });
      this.alpha = 1;
      this.shadow.setAlpha(0.35);
    } else {
      this.alpha = 0.5;
      this.scale = 1;
      this.glow.setAlpha(0.12);
      this.shadow.setAlpha(0.2);
    }
  }

  setLayout(mode = "default") {
    const compact = mode === "phone";
    this.shadow.setSize(compact ? 92 : 150, compact ? 28 : 44).setPosition(0, compact ? 5 : 8);
    this.bevel.setSize(compact ? 78 : 128, compact ? 8 : 14).setPosition(0, compact ? -10 : -15);
    this.bg.setDisplaySize(compact ? 100 : 164, compact ? 38 : 58);
    this.glow.setDisplaySize(compact ? 114 : 184, compact ? 48 : 70);
    this.text.setFontSize(compact ? "14px" : "24px");
    this.setSize(compact ? 100 : 164, compact ? 38 : 58);
  }
}
