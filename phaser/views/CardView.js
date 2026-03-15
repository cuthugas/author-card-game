const TYPE_SKINS = {
  character: {
    tintA: 0x5d4937,
    tintB: 0x3b2f25,
    edge: 0xd8b06f,
    title: "#fff0d0",
    body: "#f2e4cb",
    tag: "CHARACTER",
  },
  plot: {
    tintA: 0x31474f,
    tintB: 0x253841,
    edge: 0x8ab6d8,
    title: "#e7f4ff",
    body: "#e0edf2",
    tag: "PLOT",
  },
  artifact: {
    tintA: 0x4a4136,
    tintB: 0x322b23,
    edge: 0xbba67f,
    title: "#f4e9d3",
    body: "#ebdfcd",
    tag: "ARTIFACT",
  },
};

function clampText(text = "", maxLength = 128) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

export class CardView extends Phaser.GameObjects.Container {
  constructor(scene, card, opts = {}) {
    super(scene, 0, 0);
    this.scene = scene;
    this.opts = opts;
    this.card = null;
    this.isTruncated = false;
    this.selected = false;
    this.selectionPulseTween = null;
    this.layoutMode = opts.layoutMode || "default";

    this.selectionGlow = scene.add.image(0, 0, "button-glow").setDisplaySize(222, 292).setTint(0xf1ca74).setAlpha(0);
    this.shadow = scene.add.image(6, 10, "card-shadow").setDisplaySize(182, 250).setAlpha(0.78);
    this.base = scene.add.image(0, 0, "card-base").setDisplaySize(164, 234);
    this.frame = scene.add.image(0, 0, "card-frame").setDisplaySize(166, 236);
    this.selectionRing = scene.add.image(0, 0, "card-frame").setDisplaySize(182, 252).setTint(0xffdf94).setAlpha(0);
    this.targetGlow = scene.add.image(0, 0, "button-glow").setDisplaySize(214, 284).setTint(0xff9c78).setAlpha(0);
    this.targetRing = scene.add.image(0, 0, "card-frame").setDisplaySize(178, 248).setTint(0xffb194).setAlpha(0);
    this.targetPulseTween = null;
    this.themeGlow = scene.add.image(0, -6, "button-glow").setDisplaySize(184, 244).setTint(0x9ed89f).setAlpha(0);
    this.themeGem = scene.add.circle(58, -100, 9, 0x8dc878, 0.96).setStrokeStyle(2, 0x17311a, 0.85).setVisible(false);
    this.themeSpark = scene.add.circle(58, -100, 16, 0xbde7af, 0.18).setVisible(false);

    this.typeBadge = scene.add.rectangle(0, -102, 118, 18, 0x2c2017, 0.9).setStrokeStyle(1, 0xba945f, 0.72);
    this.typeLabel = scene.add
      .text(0, -102, "", {
        fontFamily: "Cinzel",
        fontSize: "11px",
        color: "#f2ddb5",
        letterSpacing: 0.8,
      })
      .setOrigin(0.5);

    this.costZone = scene.add.circle(-64, -100, 18, 0x27425a, 0.95).setStrokeStyle(2.3, 0x8bc8ea, 0.95);
    this.cost = scene.add
      .text(-64, -100, "0", {
        fontFamily: "Cinzel",
        fontSize: "19px",
        color: "#c4e8ff",
        stroke: "#0f202f",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.titleZone = scene.add.rectangle(0, -76, 144, 34, 0x0a0908, 0.3).setStrokeStyle(1, 0xc19a65, 0.5);
    this.title = scene.add
      .text(0, -76, "", {
        fontFamily: "Cinzel",
        fontSize: "17px",
        color: "#f6e4bf",
        align: "center",
        stroke: "#140f0b",
        strokeThickness: 4,
        wordWrap: { width: 132 },
      })
      .setOrigin(0.5);

    this.author = scene.add
      .text(0, -52, "", {
        fontFamily: "Spectral",
        fontSize: "12px",
        color: "#ead9b8",
      })
      .setOrigin(0.5);

    this.bodyZone = scene.add.rectangle(0, 10, 142, 100, 0x11131a, 0.72).setStrokeStyle(1, 0xae8552, 0.46);
    this.body = scene.add
      .text(-64, -32, "", {
        fontFamily: "Spectral",
        fontSize: "12px",
        lineSpacing: 3,
        color: "#ddd2bf",
        wordWrap: { width: 128, useAdvancedWrap: true },
      })
      .setOrigin(0, 0);

    this.iconAtk = scene.add.image(-50, 86, "icon-attack").setDisplaySize(18, 18);
    this.iconDef = scene.add.image(-2, 86, "icon-defense").setDisplaySize(18, 18);
    this.iconMem = scene.add.image(46, 86, "icon-mem").setDisplaySize(18, 18);
    this.statBg = scene.add.rectangle(0, 86, 142, 38, 0x171b23, 0.9).setStrokeStyle(1, 0xa67f4e, 0.66);
    this.statAtk = scene.add.text(-24, 86, "0", { fontFamily: "Cinzel", fontSize: "14px", color: "#ffd0c8" }).setOrigin(0.5);
    this.statDef = scene.add.text(24, 86, "0", { fontFamily: "Cinzel", fontSize: "14px", color: "#cae8fa" }).setOrigin(0.5);
    this.statMem = scene.add.text(68, 86, "0", { fontFamily: "Cinzel", fontSize: "14px", color: "#ffe9bc" }).setOrigin(0.5);

    this.tooltip = scene.add.container(0, -146).setVisible(false);
    const tipBg = scene.add.image(0, 0, "panel-base").setDisplaySize(232, 86).setTint(0x1c1510);
    const tipEdge = scene.add.image(0, 0, "panel-edge").setDisplaySize(236, 90);
    this.tooltipText = scene.add
      .text(0, 0, "", {
        fontFamily: "Spectral",
        fontSize: "12px",
        color: "#e6dbc8",
        align: "center",
        wordWrap: { width: 214 },
      })
      .setOrigin(0.5);
    this.tooltip.add([tipBg, tipEdge, this.tooltipText]);

    this.add([
      this.selectionGlow,
      this.shadow,
      this.base,
      this.targetGlow,
      this.themeGlow,
      this.frame,
      this.targetRing,
      this.selectionRing,
      this.typeBadge,
      this.typeLabel,
      this.costZone,
      this.cost,
      this.themeSpark,
      this.themeGem,
      this.titleZone,
      this.title,
      this.author,
      this.bodyZone,
      this.body,
      this.statBg,
      this.iconAtk,
      this.iconDef,
      this.iconMem,
      this.statAtk,
      this.statDef,
      this.statMem,
      this.tooltip,
    ]);

    this.setSize(166, 236);
    this.inputTarget = this.frame;
    this.inputTarget.setInteractive({ useHandCursor: true });
    this.inputEnabled = true;
    this.baseY = this.y;
    this.baseScale = 1;
    this.baseAngle = this.angle;

    this.inputTarget.on("pointerover", () => {
      if (opts.interactive) this.hover(true);
      if (this.layoutMode !== "phone" && this.isTruncated) this.tooltip.setVisible(true);
    });
    this.inputTarget.on("pointerout", () => {
      if (opts.interactive) this.hover(false);
      this.tooltip.setVisible(false);
    });

    if (opts.interactive) {
      this.inputTarget.on("pointerdown", (pointer, localX, localY, event) => {
        event?.stopPropagation();
        opts.onClick?.(this.card);
      });
    }

    this.setLayout(this.layoutMode);
    this.updateData(card);
    scene.add.existing(this);
  }

  truncateBody(text) {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    const maxLength = this.layoutMode === "phone" ? 54 : 128;
    if (clean.length <= maxLength) {
      this.isTruncated = false;
      return clean || "No special effect.";
    }
    this.isTruncated = true;
    return clampText(clean, maxLength) || "No special effect.";
  }

  getTypeLabel(card) {
    const skin = TYPE_SKINS[card.type] || TYPE_SKINS.character;
    return card.type === "character" ? skin.tag : card.subtype === "literary_device" ? "DEVICE" : skin.tag;
  }

  setLayout(mode = "default") {
    this.layoutMode = mode;
    const compact = mode === "phone";

    this.selectionGlow.setDisplaySize(compact ? 234 : 222, compact ? 308 : 292);
    this.shadow.setDisplaySize(compact ? 188 : 182, compact ? 258 : 250).setPosition(6, compact ? 12 : 10);
    this.base.setDisplaySize(164, 234);
    this.frame.setDisplaySize(166, 236);
    this.selectionRing.setDisplaySize(compact ? 188 : 182, compact ? 262 : 252);
    this.targetGlow.setDisplaySize(compact ? 226 : 214, compact ? 298 : 284);
    this.targetRing.setDisplaySize(compact ? 184 : 178, compact ? 256 : 248);
    this.themeGlow.setDisplaySize(compact ? 194 : 184, compact ? 256 : 244).setPosition(0, compact ? -2 : -6);
    this.themeGem.setPosition(58, compact ? -94 : -100);
    this.themeSpark.setPosition(58, compact ? -94 : -100);

    this.typeBadge.setPosition(0, compact ? -104 : -102).setSize(compact ? 98 : 118, compact ? 16 : 18);
    this.typeLabel.setPosition(0, compact ? -104 : -102).setFontSize(compact ? "10px" : "11px");
    this.costZone.setPosition(-62, compact ? -96 : -100).setRadius(compact ? 20 : 18);
    this.cost.setPosition(-62, compact ? -96 : -100).setFontSize(compact ? "22px" : "19px");

    this.titleZone.setPosition(0, compact ? -68 : -76).setSize(compact ? 148 : 144, compact ? 40 : 34);
    this.title.setPosition(0, compact ? -68 : -76).setFontSize(compact ? "20px" : "17px");
    this.title.setWordWrapWidth(compact ? 138 : 132);

    this.author.setPosition(0, compact ? -38 : -52).setFontSize(compact ? "13px" : "12px");

    this.bodyZone.setPosition(0, compact ? 2 : 10).setSize(compact ? 144 : 142, compact ? 52 : 100);
    this.body.setPosition(-62, compact ? -18 : -32).setFontSize(compact ? "13px" : "12px");
    this.body.setWordWrapWidth(compact ? 124 : 128);
    this.body.setLineSpacing(compact ? 2 : 3);

    this.iconAtk.setPosition(compact ? -56 : -50, compact ? 74 : 86).setDisplaySize(compact ? 19 : 18, compact ? 19 : 18);
    this.iconDef.setPosition(compact ? 0 : -2, compact ? 74 : 86).setDisplaySize(compact ? 19 : 18, compact ? 19 : 18);
    this.iconMem.setPosition(compact ? 56 : 46, compact ? 74 : 86).setDisplaySize(compact ? 19 : 18, compact ? 19 : 18);
    this.statBg.setPosition(0, compact ? 78 : 86).setSize(compact ? 148 : 142, compact ? 48 : 38);
    this.statAtk.setPosition(compact ? -38 : -24, compact ? 78 : 86).setFontSize(compact ? "18px" : "14px");
    this.statDef.setPosition(compact ? 18 : 24, compact ? 78 : 86).setFontSize(compact ? "18px" : "14px");
    this.statMem.setPosition(compact ? 72 : 68, compact ? 78 : 86).setFontSize(compact ? "18px" : "14px");

    this.tooltip.setPosition(0, compact ? -156 : -146);
    this.tooltip.setVisible(false);
    this.setSize(166, 236);
  }

  updateData(card) {
    this.card = card;
    const skin = TYPE_SKINS[card.type] || TYPE_SKINS.character;
    this.base.setTint(skin.tintA, skin.tintA, skin.tintB, skin.tintB);
    this.frame.setTint(skin.edge);
    this.typeLabel.setText(this.getTypeLabel(card));
    this.typeLabel.setColor(skin.title);

    this.title.setText(card.name || "");
    this.title.setColor(skin.title);
    this.author.setText(card.author || "");
    this.body.setColor(skin.body);
    this.body.setStroke("#0d0d0d", 1.2);

    const effect = this.truncateBody(card.effectText || "No special effect.");
    this.body.setText(effect);
    const detailLines = [card.effectText || "No special effect."];
    if (card.source) detailLines.push(`Source: ${card.source}`);
    if (card.functionText) detailLines.push(`Function: ${card.functionText}`);
    this.tooltipText.setText(detailLines.join("\n"));

    this.cost.setText(`${card.cost ?? 0}`);

    const isCharacter = card.type === "character";
    this.iconAtk.setVisible(isCharacter);
    this.iconDef.setVisible(isCharacter);
    this.iconMem.setVisible(isCharacter);
    this.statAtk.setVisible(isCharacter);
    this.statDef.setVisible(isCharacter);
    this.statMem.setVisible(isCharacter);

    if (isCharacter) {
      this.statAtk.setText(`${card.attack ?? 0}`);
      this.statDef.setText(`${card.defense ?? 0}`);
      this.statMem.setText(`${card.memorability ?? 0}`);
    } else {
      this.statAtk.setVisible(false);
      this.statDef.setVisible(false);
      this.statMem.setVisible(false);
      this.iconAtk.setVisible(false);
      this.iconDef.setVisible(false);
      this.iconMem.setVisible(false);
      if (this.layoutMode === "phone") {
        this.body.setText(clampText(card.effectText || "No special effect.", 44) || "No special effect.");
      }
    }

    this.setThemeMatch(Boolean(card.matchesTheme));
  }

  setSelected(selected) {
    if (this.selected === selected) return;
    this.selected = selected;

    if (this.selectionPulseTween) {
      this.selectionPulseTween.stop();
      this.selectionPulseTween = null;
    }

    this.frame.setTint(selected ? 0xfff0b5 : (TYPE_SKINS[this.card?.type] || TYPE_SKINS.character).edge);
    this.scene.tweens.add({
      targets: this,
      y: selected ? this.baseY - 14 : this.baseY,
      duration: 150,
      ease: "Quad.Out",
    });
    this.scene.tweens.add({
      targets: [this.selectionGlow, this.selectionRing],
      alpha: selected ? 1 : 0,
      duration: selected ? 150 : 120,
      ease: "Quad.Out",
    });
    this.scene.tweens.add({
      targets: this.shadow,
      alpha: selected ? 0.98 : 0.78,
      duration: 140,
      ease: "Quad.Out",
    });

    if (!selected) {
      this.selectionGlow.setScale(1);
      this.selectionRing.setScale(1);
      return;
    }

    this.selectionPulseTween = this.scene.tweens.add({
      targets: this.selectionGlow,
      scaleX: { from: 1, to: 1.06 },
      scaleY: { from: 1, to: 1.08 },
      alpha: { from: 0.42, to: 0.72 },
      duration: 620,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }

  setHomeTransform() {
    this.baseY = this.y;
    this.baseScale = this.scaleX;
    this.baseAngle = this.angle;
  }

  setThemeMatch(enabled) {
    this.themeGlow.setAlpha(enabled ? 0.22 : 0);
    this.themeGem.setVisible(enabled);
    this.themeSpark.setVisible(enabled);
  }

  setTargetable(enabled) {
    if (this.targetPulseTween) {
      this.targetPulseTween.stop();
      this.targetPulseTween = null;
    }

    this.targetGlow.setAlpha(enabled ? 0.22 : 0);
    this.targetRing.setAlpha(enabled ? 0.7 : 0);

    if (!enabled) {
      this.targetGlow.setScale(1);
      this.targetRing.setScale(1);
      return;
    }

    this.targetPulseTween = this.scene.tweens.add({
      targets: [this.targetGlow, this.targetRing],
      alpha: { from: 0.28, to: 0.82 },
      duration: 480,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }

  hover(isHover) {
    if (this.opts.disableHover) return;
    this.scene.tweens.add({
      targets: this,
      y: isHover ? this.baseY - 16 : this.baseY,
      scaleX: isHover ? this.baseScale * 1.07 : this.baseScale,
      scaleY: isHover ? this.baseScale * 1.07 : this.baseScale,
      duration: 135,
      ease: "Quad.Out",
    });
    this.scene.tweens.add({ targets: this.shadow, alpha: isHover ? 0.99 : 0.78, duration: 120 });
  }

  animateOut(onDone) {
    this.setInputEnabled(false);
    this.scene.tweens.add({
      targets: this,
      scaleX: this.scaleX * 0.86,
      scaleY: this.scaleY * 0.86,
      alpha: 0,
      angle: this.angle + 4,
      y: this.y - 18,
      duration: 230,
      ease: "Quad.In",
      onComplete: () => onDone?.(),
    });
  }

  setInputEnabled(enabled) {
    if (this.inputEnabled === enabled) return;
    this.inputEnabled = enabled;
    if (!this.inputTarget.input) return;
    this.inputTarget.input.enabled = enabled;
  }
}
