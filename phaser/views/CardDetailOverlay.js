export class CardDetailOverlay extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, scene.scale.width * 0.5, scene.scale.height * 0.5);
    this.scene = scene;
    this.onAction = null;
    this.payload = null;

    this.scrim = scene.add.rectangle(0, 0, scene.scale.width, scene.scale.height, 0x03060c, 0.82);
    this.scrim.setInteractive();
    this.scrim.on("pointerdown", () => this.hide());

    this.panel = scene.add.image(0, 0, "panel-base").setTint(0x20170f).setDisplaySize(430, 320);
    this.edge = scene.add.image(0, 0, "panel-edge").setDisplaySize(436, 326).setAlpha(0.92);

    this.typeBadge = scene.add.rectangle(0, -122, 126, 22, 0x2b1f16, 0.94).setStrokeStyle(1, 0xc89b5c, 0.82);
    this.typeText = scene.add
      .text(0, -122, "CARD", {
        fontFamily: "Cinzel",
        fontSize: "12px",
        color: "#f4deaf",
      })
      .setOrigin(0.5);

    this.title = scene.add
      .text(0, -88, "", {
        fontFamily: "Cinzel",
        fontSize: "28px",
        color: "#f8e4ba",
        align: "center",
        wordWrap: { width: 330 },
        stroke: "#140d09",
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    this.subtitle = scene.add
      .text(0, -46, "", {
        fontFamily: "Spectral",
        fontSize: "17px",
        color: "#dccaa4",
        align: "center",
      })
      .setOrigin(0.5);

    this.stats = scene.add
      .text(0, -12, "", {
        fontFamily: "Cinzel",
        fontSize: "18px",
        color: "#f4e7ca",
        align: "center",
      })
      .setOrigin(0.5);

    this.effect = scene.add
      .text(0, 52, "", {
        fontFamily: "Spectral",
        fontSize: "18px",
        color: "#eadfc7",
        align: "center",
        wordWrap: { width: 348 },
        lineSpacing: 5,
      })
      .setOrigin(0.5);

    this.closeText = scene.add
      .text(0, 126, "Tap outside to close", {
        fontFamily: "Spectral",
        fontSize: "14px",
        color: "#bda98a",
      })
      .setOrigin(0.5);

    this.actionBtn = scene.add.container(0, 164);
    this.actionGlow = scene.add.image(0, 0, "button-glow").setDisplaySize(208, 70).setAlpha(0.35);
    this.actionBase = scene.add.image(0, 0, "button-base").setDisplaySize(184, 54);
    this.actionText = scene.add
      .text(0, 0, "OPEN", {
        fontFamily: "Cinzel",
        fontSize: "24px",
        color: "#f5e8c5",
        stroke: "#190f09",
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    this.actionBtn.add([this.actionGlow, this.actionBase, this.actionText]);
    this.actionBase.setInteractive({ useHandCursor: true });
    this.actionBase.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      const action = this.onAction;
      this.hide();
      action?.();
    });

    this.add([
      this.scrim,
      this.panel,
      this.edge,
      this.typeBadge,
      this.typeText,
      this.title,
      this.subtitle,
      this.stats,
      this.effect,
      this.closeText,
      this.actionBtn,
    ]);

    this.setDepth(1330);
    this.setVisible(false);
    this.setAlpha(0);
    scene.add.existing(this);
    scene.scale.on("resize", (size) => this.layout(size.width, size.height));
  }

  layout(width, height) {
    this.setPosition(width * 0.5, height * 0.5);
    this.scrim.setSize(width, height);
    const compact = width < 900 || height < 600;
    const panelW = Math.min(width * 0.92, compact ? 420 : 520);
    const panelH = Math.min(height * 0.82, compact ? 360 : 410);

    this.panel.setDisplaySize(panelW, panelH);
    this.edge.setDisplaySize(panelW + 6, panelH + 6);
    this.typeBadge.setPosition(0, -panelH * 0.38).setSize(Math.min(130, panelW * 0.32), compact ? 20 : 22);
    this.typeText.setPosition(0, -panelH * 0.38).setFontSize(compact ? "11px" : "12px");
    this.title.setPosition(0, -panelH * 0.27).setFontSize(compact ? "24px" : "28px");
    this.title.setWordWrapWidth(panelW * 0.78);
    this.subtitle.setPosition(0, -panelH * 0.14).setFontSize(compact ? "15px" : "17px");
    this.stats.setPosition(0, -panelH * 0.03).setFontSize(compact ? "16px" : "18px");
    this.effect.setPosition(0, panelH * 0.14).setFontSize(compact ? "16px" : "18px");
    this.effect.setWordWrapWidth(panelW * 0.82);
    this.closeText.setPosition(0, panelH * 0.3).setFontSize(compact ? "13px" : "14px");
    this.actionBtn.setPosition(0, panelH * 0.41);
    this.actionGlow.setDisplaySize(compact ? 188 : 208, compact ? 60 : 70);
    this.actionBase.setDisplaySize(compact ? 166 : 184, compact ? 48 : 54);
    this.actionText.setFontSize(compact ? "21px" : "24px");
  }

  describeStats(card) {
    if (card.type === "character") {
      return `Cost ${card.cost ?? 0}   ATK ${card.attack ?? 0}   DEF ${card.defense ?? 0}   MEM ${card.memorability ?? 0}`;
    }
    const subtype = card.subtype === "literary_device" ? "Device" : (card.type || "Card");
    return `Cost ${card.cost ?? 0}   ${subtype.toUpperCase()}`;
  }

  open(card, config = {}) {
    this.payload = card;
    this.onAction = config.onAction || null;
    this.typeText.setText(config.typeLabel || (card.type === "character" ? "CHARACTER" : card.subtype === "literary_device" ? "DEVICE" : (card.type || "CARD").toUpperCase()));
    this.title.setText(card.name || "");
    this.subtitle.setText(card.author || "");
    this.stats.setText(this.describeStats(card));

    const lines = [];
    if (card.effectText) lines.push(card.effectText);
    if (card.source) lines.push(`Source: ${card.source}`);
    if (card.functionText) lines.push(`Function: ${card.functionText}`);
    this.effect.setText(lines.join("\n\n") || "No special effect.");

    const hasAction = Boolean(config.actionLabel && this.onAction);
    this.actionBtn.setVisible(hasAction);
    this.actionText.setText(config.actionLabel || "");
    this.closeText.setText(hasAction ? "Tap outside to close" : "Tap anywhere outside to close");

    this.setVisible(true);
    this.setAlpha(0);
    this.scene.tweens.add({ targets: this, alpha: 1, duration: 160, ease: "Quad.Out" });
  }

  hide() {
    if (!this.visible) return;
    this.onAction = null;
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 120,
      ease: "Quad.Out",
      onComplete: () => this.setVisible(false),
    });
  }
}
