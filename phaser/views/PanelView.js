export class PanelView extends Phaser.GameObjects.Container {
  constructor(scene, x, y, side, title = "Writer") {
    super(scene, x, y);
    this.scene = scene;
    this.side = side;
    this.targetable = false;
    this.targetPulseTween = null;
    this.layoutMode = "default";

    this.shadow = scene.add.rectangle(0, 8, 398, 108, 0x090708, 0.34).setOrigin(0.5);
    this.bg = scene.add.image(0, 0, "panel-base").setDisplaySize(396, 112).setTint(0x3d2f24, 0x2d241d, 0x1f1915, 0x33281f);
    this.edge = scene.add.image(0, 0, "panel-edge").setDisplaySize(402, 118).setAlpha(0.88);
    this.link = scene.add.image(0, side === "player" ? -66 : 66, "hud-link")
      .setDisplaySize(260, 34)
      .setAlpha(0.52)
      .setFlipY(side === "player");
    this.topShine = scene.add.rectangle(0, -42, 332, 18, 0xffedc6, 0.11).setOrigin(0.5);
    this.title = scene.add
      .text(-176, -37, title, {
        fontFamily: "Cinzel",
        fontSize: "22px",
        color: "#f3dfb2",
        stroke: "#1b140f",
        strokeThickness: 4,
      })
      .setOrigin(0, 0.5);

    this.primary = scene.add
      .text(-176, -4, "REP 0  INSP 0/0", {
        fontFamily: "Cinzel",
        fontSize: "19px",
        color: "#fff0ca",
      })
      .setOrigin(0, 0.5);

    this.secondary = scene.add
      .text(-176, 26, "KNW 0/10  DECK 0  HAND 0", {
        fontFamily: "Spectral",
        fontSize: "17px",
        color: "#e0d0ad",
      })
      .setOrigin(0, 0.5);

    this.turnGlow = scene.add.image(146, -2, "button-glow").setDisplaySize(146, 92).setAlpha(0.18).setTint(0xdca85f);
    this.orb = scene.add.circle(168, -1, 10, 0xe7b264, 0.9).setStrokeStyle(2, 0x2c1c10, 0.8).setAlpha(0.48);
    this.targetRing = scene.add
      .image(0, 0, "panel-edge")
      .setDisplaySize(426, 136)
      .setTint(0xffd07d)
      .setAlpha(0);
    this.targetHint = scene.add
      .text(0, side === "ai" ? 44 : -44, "DIRECT ATTACK", {
        fontFamily: "Cinzel",
        fontSize: "15px",
        color: "#ffe7b9",
        stroke: "#1b140f",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.add([
      this.shadow,
      this.link,
      this.bg,
      this.edge,
      this.targetRing,
      this.topShine,
      this.turnGlow,
      this.orb,
      this.title,
      this.primary,
      this.secondary,
      this.targetHint,
    ]);
    this.setSize(410, 120);
    this.inputTarget = this.bg;
    this.inputTarget.setInteractive({ useHandCursor: true });
    scene.add.existing(this);
    this.setLayout("default");
  }

  update(data, knowledgeToWin, isActiveTurn) {
    if (this.layoutMode === "phone-player") {
      this.title.setText("YOU");
      this.primary.setText(`R ${data.reputation}  I ${data.inspiration}/${data.maxInspiration}`);
      this.secondary.setText(`K ${data.knowledge}/${knowledgeToWin}  D ${data.deckCount} H ${data.handCount}`);
    } else {
      this.title.setText(`${data.name} - ${data.author}`);
    }
    if (this.layoutMode === "phone") {
      this.primary.setText(`REP ${data.reputation} | IN ${data.inspiration}/${data.maxInspiration}`);
      this.secondary.setText(`KNW ${data.knowledge}/${knowledgeToWin} | D ${data.deckCount} H ${data.handCount}`);
    } else if (this.layoutMode !== "phone-player") {
      this.primary.setText(`REP ${data.reputation}   INSP ${data.inspiration}/${data.maxInspiration}`);
      this.secondary.setText(`KNW ${data.knowledge}/${knowledgeToWin}   DECK ${data.deckCount}   HAND ${data.handCount}`);
    }
    this.scene.tweens.add({
      targets: this.turnGlow,
      alpha: isActiveTurn ? 0.54 : 0.12,
      duration: 180,
      ease: "Sine.Out",
    });
    this.scene.tweens.add({
      targets: this.orb,
      alpha: isActiveTurn ? 0.98 : 0.4,
      scaleX: isActiveTurn ? 1.12 : 1,
      scaleY: isActiveTurn ? 1.12 : 1,
      duration: 180,
      ease: "Sine.Out",
    });
  }

  setLayout(mode = "default") {
    this.layoutMode = mode;
    const compact = mode === "phone";
    const playerCompact = mode === "phone-player";

    this.shadow.setSize(playerCompact ? 194 : compact ? 284 : 398, playerCompact ? 56 : compact ? 74 : 108).setPosition(0, playerCompact ? 4 : compact ? 6 : 8);
    this.bg.setDisplaySize(playerCompact ? 190 : compact ? 280 : 396, playerCompact ? 58 : compact ? 78 : 112);
    this.edge.setDisplaySize(playerCompact ? 196 : compact ? 286 : 402, playerCompact ? 64 : compact ? 84 : 118);
    this.link
      .setPosition(0, this.side === "player" ? (playerCompact ? -30 : compact ? -44 : -66) : playerCompact ? 30 : compact ? 44 : 66)
      .setDisplaySize(playerCompact ? 118 : compact ? 176 : 260, playerCompact ? 14 : compact ? 22 : 34)
      .setAlpha(playerCompact ? 0 : 0.52);
    this.topShine.setSize(playerCompact ? 146 : compact ? 220 : 332, playerCompact ? 8 : compact ? 12 : 18).setPosition(0, playerCompact ? -21 : compact ? -28 : -42);
    this.title.setPosition(playerCompact ? -78 : compact ? -124 : -176, playerCompact ? -15 : compact ? -24 : -37).setFontSize(playerCompact ? "11px" : compact ? "14px" : "22px");
    this.primary.setPosition(playerCompact ? -78 : compact ? -124 : -176, playerCompact ? 1 : compact ? -1 : -4).setFontSize(playerCompact ? "10px" : compact ? "12px" : "19px");
    this.secondary.setPosition(playerCompact ? -78 : compact ? -124 : -176, playerCompact ? 16 : compact ? 19 : 26).setFontSize(playerCompact ? "9px" : compact ? "10px" : "17px");
    this.turnGlow.setPosition(playerCompact ? 68 : compact ? 100 : 146, playerCompact ? 0 : compact ? -1 : -2).setDisplaySize(playerCompact ? 52 : compact ? 102 : 146, playerCompact ? 34 : compact ? 62 : 92);
    this.orb.setPosition(playerCompact ? 82 : compact ? 118 : 168,  playerCompact ? 0 : compact ? -1 : -1).setRadius(playerCompact ? 5 : compact ? 7 : 10);
    this.targetRing.setDisplaySize(playerCompact ? 212 : compact ? 304 : 426, playerCompact ? 76 : compact ? 96 : 136);
    this.targetHint
      .setPosition(0, this.side === "ai" ? (playerCompact ? 22 : compact ? 28 : 44) : playerCompact ? -22 : compact ? -28 : -44)
      .setFontSize(playerCompact ? "9px" : compact ? "11px" : "15px");
    this.setSize(playerCompact ? 200 : compact ? 290 : 410, playerCompact ? 62 : compact ? 84 : 120);
  }

  flashPrimary(color = "#fff0ca") {
    this.primary.setColor(color);
    this.scene.tweens.add({
      targets: this.primary,
      scaleX: { from: 1.02, to: 1 },
      scaleY: { from: 1.02, to: 1 },
      duration: 220,
      ease: "Quad.Out",
      onComplete: () => this.primary.setColor("#fff0ca"),
    });
  }

  flashSecondary(color = "#e0d0ad") {
    this.secondary.setColor(color);
    this.scene.tweens.add({
      targets: this.secondary,
      scaleX: { from: 1.02, to: 1 },
      scaleY: { from: 1.02, to: 1 },
      duration: 220,
      ease: "Quad.Out",
      onComplete: () => this.secondary.setColor("#e0d0ad"),
    });
  }

  setTargetable(enabled) {
    if (this.targetable === enabled) return;
    this.targetable = enabled;

    if (this.targetPulseTween) {
      this.targetPulseTween.stop();
      this.targetPulseTween = null;
    }

    if (!enabled) {
      this.scene.tweens.add({
        targets: [this.targetRing, this.targetHint],
        alpha: 0,
        duration: 110,
        ease: "Sine.Out",
      });
      return;
    }

    this.scene.tweens.add({
      targets: this.targetHint,
      alpha: 0.94,
      duration: 130,
      ease: "Sine.Out",
    });
    this.targetPulseTween = this.scene.tweens.add({
      targets: this.targetRing,
      alpha: { from: 0.4, to: 0.86 },
      duration: 520,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }

  onPrimaryAction(callback) {
    this.inputTarget.removeAllListeners("pointerdown");
    this.inputTarget.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      callback?.();
    });
  }
}
