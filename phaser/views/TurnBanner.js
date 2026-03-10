export class TurnBanner extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, scene.scale.width * 0.5, scene.scale.height * 0.5);
    this.bg = scene.add.image(0, 0, "panel-base").setDisplaySize(520, 100).setTint(0x2a2118).setAlpha(0.9);
    this.edge = scene.add.image(0, 0, "panel-edge").setDisplaySize(526, 106).setAlpha(0.9);
    this.text = scene.add
      .text(0, 0, "YOUR TURN", {
        fontFamily: "Cinzel",
        fontSize: "42px",
        color: "#f5e4bd",
        stroke: "#16110d",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add([this.bg, this.edge, this.text]);
    this.setAlpha(0);
    this.setDepth(1000);
    scene.add.existing(this);
  }

  show(label) {
    this.text.setText(label);
    this.y = this.scene.scale.height * 0.5 + 24;
    this.setAlpha(0);
    this.scene.tweens.add({ targets: this, alpha: 1, y: this.scene.scale.height * 0.5, duration: 260, ease: "Back.Out" });
    this.scene.time.delayedCall(840, () => {
      this.scene.tweens.add({ targets: this, alpha: 0, y: this.scene.scale.height * 0.5 - 26, duration: 300, ease: "Quad.In" });
    });
  }
}
