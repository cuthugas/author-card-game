export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create() {
    this.cameras.main.fadeIn(260, 0, 0, 0);
    this.scene.start("preload");
  }
}
