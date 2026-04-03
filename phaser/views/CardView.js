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

const INSPECT_DELAY_MS = 2000;
let activeInspectedCardView = null;

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
    this.inspectTimer = null;
    this.inspectSource = null;
    this.pressActive = false;
    this.inspectLocked = false;
    this.inspectTween = null;
    this.inspectHomeTransform = null;
    this.inspectHomeShadowAlpha = null;
    this.inspectHomeAlpha = null;
    this.inspectRaised = false;
    this.hoverTween = null;
    this.hoverShadowTween = null;
    this.settling = false;

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
    this.statAtk = scene.add.text(-24, 86, "0", { fontFamily: "Cinzel", fontSize: "14px", color: "#ffd0c8", stroke: "#130d09", strokeThickness: 3 }).setOrigin(0.5);
    this.statDef = scene.add.text(24, 86, "0", { fontFamily: "Cinzel", fontSize: "14px", color: "#cae8fa", stroke: "#130d09", strokeThickness: 3 }).setOrigin(0.5);
    this.statMem = scene.add.text(68, 86, "0", { fontFamily: "Cinzel", fontSize: "14px", color: "#ffe9bc", stroke: "#130d09", strokeThickness: 3 }).setOrigin(0.5);

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
    this.actionEnabled = true;
    this.baseY = this.y;
    this.baseScale = 1;
    this.baseAngle = this.angle;

    this.inputTarget.on("pointerover", () => {
      if (this.settling) return;
      if (opts.interactive) this.hover(true);
      if (this.layoutMode !== "phone" && this.isTruncated) this.tooltip.setVisible(true);
      this.queueInspect("hover");
    });
    this.inputTarget.on("pointerout", () => {
      if (opts.interactive) this.hover(false);
      this.tooltip.setVisible(false);
      this.cancelInspect("hover");
    });

    if (opts.interactive) {
      this.inputTarget.on("pointerdown", (pointer, localX, localY, event) => {
        if (this.settling) return;
        event?.stopPropagation();
        this.pressActive = true;
        this.inspectLocked = false;
        this.queueInspect("press");
      });
      this.inputTarget.on("pointerup", (pointer, localX, localY, event) => {
        event?.stopPropagation();
        const shouldClick = this.pressActive && !this.inspectLocked && this.actionEnabled;
        this.pressActive = false;
        this.cancelInspect("press");
        if (shouldClick) opts.onClick?.(this.card);
      });
      this.inputTarget.on("pointerupoutside", () => {
        this.pressActive = false;
        this.cancelInspect("press");
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

  applyStatRowLayout(compact = false) {
    const rowY = compact ? 70 : 76;
    const bgWidth = compact ? 150 : 144;
    const cellCenters = compact ? [-44, 0, 44] : [-40, 0, 40];
    const iconOffset = compact ? -9 : -8;
    const valueOffset = compact ? 8 : 7;
    const iconSize = compact ? 18 : 17;
    const valueSize = compact ? "15px" : "13px";

    this.statBg.setPosition(0, rowY).setSize(bgWidth, compact ? 38 : 34);
    this.iconAtk.setPosition(cellCenters[0] + iconOffset, rowY).setDisplaySize(iconSize, iconSize);
    this.iconDef.setPosition(cellCenters[1] + iconOffset, rowY).setDisplaySize(iconSize, iconSize);
    this.iconMem.setPosition(cellCenters[2] + iconOffset, rowY).setDisplaySize(iconSize, iconSize);
    this.statAtk.setPosition(cellCenters[0] + valueOffset, rowY).setFontSize(valueSize);
    this.statDef.setPosition(cellCenters[1] + valueOffset, rowY).setFontSize(valueSize);
    this.statMem.setPosition(cellCenters[2] + valueOffset, rowY).setFontSize(valueSize);
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

    this.bodyZone.setPosition(0, compact ? -2 : 2).setSize(compact ? 144 : 142, compact ? 44 : 84);
    this.body.setPosition(-62, compact ? -24 : -36).setFontSize(compact ? "13px" : "12px");
    this.body.setWordWrapWidth(compact ? 124 : 128);
    this.body.setLineSpacing(compact ? 2 : 3);

    this.applyStatRowLayout(compact);

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

    this.cost.setText(`${card.playCost ?? card.cost ?? 0}`);

    const isCharacter = card.type === "character";
    this.statBg.setVisible(isCharacter);
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

  clearHoverTweens() {
    if (this.hoverTween) {
      this.hoverTween.stop();
      this.hoverTween = null;
    }
    if (this.hoverShadowTween) {
      this.hoverShadowTween.stop();
      this.hoverShadowTween = null;
    }
  }

  queueInspect(source) {
    if (this.opts.disableInspect || !this.inputEnabled || this.settling) return;
    if (source === "hover" && this.pressActive) return;
    this.clearInspectTimer();
    this.inspectTimer = window.setTimeout(() => {
      this.inspectTimer = null;
      this.inspectSource = source;
      this.inspectLocked = source === "press";
      this.beginInspect();
    }, INSPECT_DELAY_MS);
  }

  cancelInspect(source = null) {
    this.clearInspectTimer();
    if (!this.inspectSource) return;
    if (source && this.inspectSource !== source) return;
    this.endInspect();
    this.inspectSource = null;
    this.inspectLocked = false;
  }

  clearInspectTimer() {
    if (!this.inspectTimer) return;
    window.clearTimeout(this.inspectTimer);
    this.inspectTimer = null;
  }

  beginInspect() {
    if (activeInspectedCardView && activeInspectedCardView !== this) {
      activeInspectedCardView.forceEndInspect();
    }

    activeInspectedCardView = this;
    this.clearHoverTweens();
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.killTweensOf(this.shadow);
    this.inspectHomeTransform = {
      x: this.x,
      y: this.y,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      angle: this.angle,
      depth: this.depth,
    };
    this.inspectHomeShadowAlpha = this.shadow.alpha;
    this.inspectHomeAlpha = this.alpha;

    this.scene.liftViewForInspect?.(this);
    if (this.parentContainer?.bringToTop) {
      this.parentContainer.bringToTop(this);
    }
    this.inspectRaised = true;
    this.setDepth(1600);
    this.setAlpha(1);

    const shiftY = this.inspectHomeTransform.y > this.scene.scale.height * 0.62 ? 54 : 28;
    const scaleBoost = this.inspectHomeTransform.scaleX >= 0.9 ? 1.22 : 1.16;
    const targetScale = Math.max(
      this.inspectHomeTransform.scaleX * scaleBoost,
      this.layoutMode === "phone" ? 1.18 : 1.38
    );
    this.inspectTween = this.scene.tweens.add({
      targets: this,
      y: this.inspectHomeTransform.y - shiftY,
      scaleX: targetScale,
      scaleY: targetScale,
      angle: this.inspectHomeTransform.angle * 0.18,
      duration: 170,
      ease: "Quad.Out",
    });
    this.scene.tweens.add({
      targets: this.shadow,
      alpha: 1,
      duration: 150,
      ease: "Quad.Out",
    });
  }

  endInspect(force = false) {
    if (!this.inspectHomeTransform) return;
    this.clearHoverTweens();
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.killTweensOf(this.shadow);
    const layoutTarget = this.layoutTarget;
    const target = layoutTarget
      ? {
          x: layoutTarget.x ?? this.inspectHomeTransform.x,
          y: layoutTarget.y ?? this.inspectHomeTransform.y,
          scaleX: layoutTarget.scale ?? this.inspectHomeTransform.scaleX,
          scaleY: layoutTarget.scale ?? this.inspectHomeTransform.scaleY,
          angle: layoutTarget.angle ?? this.inspectHomeTransform.angle,
          depth: layoutTarget.depth ?? this.inspectHomeTransform.depth,
        }
      : this.inspectHomeTransform;
    const finalize = () => {
      if (this.inspectRaised) {
        this.setDepth(target.depth ?? this.depth);
        this.inspectRaised = false;
      }
      this.scene.restoreViewFromInspect?.(this);
      const latestTarget = this.layoutTarget
        ? {
            x: this.layoutTarget.x,
            y: this.layoutTarget.y,
            angle: this.layoutTarget.angle,
            scale: this.layoutTarget.scale,
            depth: this.layoutTarget.depth,
          }
        : {
            x: target.x,
            y: target.y,
            angle: target.angle,
            scale: target.scaleX,
            depth: target.depth,
          };
      this.setAlpha(this.inspectHomeAlpha ?? 1);
      this.scene.finalizeViewTransform?.(this, latestTarget, this.layoutRevision ?? null, this.layoutDomain ?? null);
      if (activeInspectedCardView === this) activeInspectedCardView = null;
      this.inspectHomeTransform = null;
      this.inspectHomeShadowAlpha = null;
      this.inspectHomeAlpha = null;
    };

    if (force) {
      this.setPosition(target.x, target.y);
      this.setScale(target.scaleX, target.scaleY);
      this.setAngle(target.angle);
      this.setAlpha(this.inspectHomeAlpha ?? 1);
      this.shadow.setAlpha(this.inspectHomeShadowAlpha ?? 0.78);
      finalize();
      return;
    }

    this.inspectTween = this.scene.tweens.add({
      targets: this,
      x: target.x,
      y: target.y,
      scaleX: target.scaleX,
      scaleY: target.scaleY,
      angle: target.angle,
      duration: 150,
      ease: "Quad.Out",
      onComplete: finalize,
    });
    this.scene.tweens.add({
      targets: this.shadow,
      alpha: this.inspectHomeShadowAlpha ?? 0.78,
      duration: 140,
      ease: "Quad.Out",
    });
  }

  forceEndInspect() {
    this.endInspect(true);
    this.inspectSource = null;
    this.inspectLocked = false;
    this.pressActive = false;
    this.clearInspectTimer();
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
    if (this.opts.disableHover || this.settling) return;
    if (this.inspectRaised) return;
    this.clearHoverTweens();
    if (isHover && this.parentContainer?.bringToTop) {
      this.parentContainer.bringToTop(this);
    }
    this.hoverTween = this.scene.tweens.add({
      targets: this,
      y: isHover ? this.baseY - 24 : this.baseY,
      scaleX: isHover ? this.baseScale * 1.1 : this.baseScale,
      scaleY: isHover ? this.baseScale * 1.1 : this.baseScale,
      duration: 135,
      ease: "Quad.Out",
      onComplete: () => {
        this.hoverTween = null;
      },
    });
    this.hoverShadowTween = this.scene.tweens.add({
      targets: this.shadow,
      alpha: isHover ? 0.99 : 0.78,
      duration: 120,
      onComplete: () => {
        this.hoverShadowTween = null;
      },
    });
  }

  animateOut(onDone) {
    this.forceEndInspect();
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
    if (!enabled) {
      this.pressActive = false;
      this.clearHoverTweens();
      this.forceEndInspect();
    }
  }

  setActionEnabled(enabled) {
    this.actionEnabled = enabled;
  }

  setSettling(active) {
    this.settling = Boolean(active);
    if (!this.settling) return;
    this.tooltip.setVisible(false);
    this.pressActive = false;
    this.clearInspectTimer();
    this.clearHoverTweens();
  }
}
