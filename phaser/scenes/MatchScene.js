import { StateAdapter } from "../core/stateAdapter.js";
import { CardView } from "../views/CardView.js";
import { HandFan } from "../views/HandFan.js";
import { CardDetailOverlay } from "../views/CardDetailOverlay.js";

export class MatchScene extends Phaser.Scene {
  constructor() {
    super("match");
    this.adapter = new StateAdapter();
    this.viewState = null;
    this.lastTurn = null;

    this.handViews = new Map();
    this.boardViews = { player: new Map(), ai: new Map() };
    this.prevZones = new Map();
    this.currentZones = new Map();
    this.lastKnownPos = new Map();

    this.cardImpactHandler = (e) => this.handleCardImpact(e.detail || {});
  }

  create() {
    this.root = this.add.container(0, 0);
    this.bgLayer = this.add.container(0, 0);
    this.slotLayer = this.add.container(0, 0);
    this.boardLayer = this.add.container(0, 0);
    this.handLayer = this.add.container(0, 0);
    this.fxLayer = this.add.container(0, 0);

    this.root.add([this.bgLayer, this.slotLayer, this.boardLayer, this.handLayer, this.fxLayer]);

    this.handFan = new HandFan(this, this.handLayer);
    this.cardDetailOverlay = new CardDetailOverlay(this);
    this.cardDetailOverlay.layout(this.scale.width, this.scale.height);
    this.drawBattlefield();

    const connected = this.adapter.connect((mapped) => {
      this.viewState = mapped;
      this.renderState();
      this.game.events.emit("acg:view-state", mapped);
    });

    if (!connected) {
      this.add
        .text(this.scale.width * 0.5, this.scale.height * 0.5, "Waiting for game logic...", {
          fontFamily: "Cinzel",
          fontSize: "32px",
          color: "#f2d9a8",
        })
        .setOrigin(0.5);
    }

    window.addEventListener("acg:fx", this.cardImpactHandler);

    this.scale.on("resize", () => {
      this.drawBattlefield();
      this.cardDetailOverlay.layout(this.scale.width, this.scale.height);
      this.renderState();
    });
  }

  shutdown() {
    window.removeEventListener("acg:fx", this.cardImpactHandler);
  }

  getProfile() {
    const w = this.scale.width;
    const h = this.scale.height;
    if (w < 900 || h < 540) {
      return {
        mode: "phone",
        cardLayout: "phone",
        handScale: 0.7,
        boardScale: 0.52,
        boardCenterRatio: 0.485,
        enemyLaneRatio: 0.34,
        playerLaneRatio: 0.64,
        handShelfRatio: 0.81,
        handBaseY: h - 52,
        handSidePadding: Math.max(118, w * 0.22),
        handAngle: 8,
        handAngleStep: 2.8,
        handLiftStep: 1.1,
        handMinSpread: 44,
        handMaxSpread: 100,
        handEdgeScaleBoost: 0.08,
        handCenterScaleBase: 0.88,
        slotInset: Math.max(78, w * 0.13),
        slotBend: 8,
        slotWidth: 108,
        slotHeight: 72,
        playWidthRatio: 0.9,
        playWidthMax: w * 0.9,
      };
    }
    if (w < 1020) {
      return {
        mode: "compact",
        cardLayout: "default",
        handScale: 1.02,
        boardScale: 0.68,
        boardCenterRatio: 0.485,
        enemyLaneRatio: 0.335,
        playerLaneRatio: 0.595,
        handShelfRatio: 0.845,
        handBaseY: this.scale.height - 88,
        handSidePadding: Math.max(92, w * 0.14),
        handAngle: 12,
        handAngleStep: 3.4,
        handLiftStep: 2.2,
        handMinSpread: 58,
        handMaxSpread: 128,
        handEdgeScaleBoost: 0.1,
        handCenterScaleBase: 0.92,
        slotInset: Math.max(84, w * 0.13),
        slotBend: 14,
        slotWidth: 124,
        slotHeight: 82,
        playWidthRatio: 0.8,
        playWidthMax: 920,
      };
    }
    if (w < 1320) {
      return {
        mode: "medium",
        cardLayout: "default",
        handScale: 1.08,
        boardScale: 0.72,
        boardCenterRatio: 0.49,
        enemyLaneRatio: 0.35,
        playerLaneRatio: 0.605,
        handShelfRatio: 0.84,
        handBaseY: this.scale.height - 92,
        handSidePadding: Math.max(132, w * 0.16),
        handAngle: 14,
        handAngleStep: 3.8,
        handLiftStep: 3,
        handMinSpread: 70,
        handMaxSpread: 144,
        handEdgeScaleBoost: 0.12,
        handCenterScaleBase: 0.94,
        slotInset: Math.max(132, w * 0.16),
        slotBend: 14,
        slotWidth: 132,
        slotHeight: 88,
        playWidthRatio: 0.76,
        playWidthMax: 1040,
      };
    }
    if (w < 1680) {
      return {
        mode: "desktop",
        cardLayout: "default",
        handScale: 1.14,
        boardScale: 0.74,
        boardCenterRatio: 0.5,
        enemyLaneRatio: 0.355,
        playerLaneRatio: 0.61,
        handShelfRatio: 0.835,
        handBaseY: this.scale.height - 94,
        handSidePadding: Math.max(156, w * 0.17),
        handAngle: 14,
        handAngleStep: 3.6,
        handLiftStep: 3.6,
        handMinSpread: 76,
        handMaxSpread: 154,
        handEdgeScaleBoost: 0.12,
        handCenterScaleBase: 0.95,
        slotInset: Math.max(156, w * 0.17),
        slotBend: 12,
        slotWidth: 136,
        slotHeight: 90,
        playWidthRatio: 0.72,
        playWidthMax: 1180,
      };
    }
    return {
      mode: "wide",
      cardLayout: "default",
      handScale: 1.2,
      boardScale: 0.76,
      boardCenterRatio: 0.505,
      enemyLaneRatio: 0.36,
      playerLaneRatio: 0.615,
      handShelfRatio: 0.83,
      handBaseY: this.scale.height - 96,
      handSidePadding: Math.max(190, w * 0.18),
      handAngle: 12,
      handAngleStep: 3.1,
      handLiftStep: 3.4,
      handMinSpread: 88,
      handMaxSpread: 168,
      handEdgeScaleBoost: 0.14,
      handCenterScaleBase: 0.96,
      slotInset: Math.max(180, w * 0.18),
      slotBend: 12,
      slotWidth: 136,
      slotHeight: 90,
      playWidthRatio: 0.68,
      playWidthMax: 1320,
    };
  }

  drawBattlefield() {
    this.bgLayer.removeAll(true);
    this.slotLayer.removeAll(true);

    const w = this.scale.width;
    const h = this.scale.height;
    const profile = this.getProfile();
    const isPhone = profile.mode === "phone";
    const playWidth = Math.min(w * profile.playWidthRatio, profile.playWidthMax);
    const boardCenterY = h * profile.boardCenterRatio;
    const enemyLaneY = h * profile.enemyLaneRatio;
    const playerLaneY = h * profile.playerLaneRatio;
    const handShelfY = h * profile.handShelfRatio;
    const deckWidth = isPhone ? 64 : 84;
    const deckHeight = isPhone ? 86 : 112;

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0f11, 0x121a1d, 0x202521, 0x090b0d, 1);
    bg.fillRect(0, 0, w, h);

    const farForest = this.add.graphics();
    farForest.fillStyle(0x101814, 0.58);
    for (let i = 0; i < 9; i += 1) {
      const x = (w / 8) * i;
      farForest.fillTriangle(x - 80, h * 0.44, x + 28, h * 0.18, x + 132, h * 0.44);
    }

    const boardTableWidth = Math.min(w * (isPhone ? 0.9 : 0.88), playWidth + (isPhone ? 120 : 220));
    const boardTable = this.add.image(w * 0.5, boardCenterY, "panel-base").setDisplaySize(boardTableWidth, h * (isPhone ? 0.5 : 0.54)).setTint(0x60452d, 0x3d2b1d, 0x271c13, 0x513825);
    const boardEdge = this.add.image(w * 0.5, boardCenterY, "panel-edge").setDisplaySize(boardTableWidth + (isPhone ? 8 : 10), h * (isPhone ? 0.51 : 0.548)).setAlpha(0.76);
    const boardFrameInner = this.add.image(w * 0.5, boardCenterY, "panel-edge").setDisplaySize(playWidth + (isPhone ? 36 : 78), h * (isPhone ? 0.42 : 0.46)).setAlpha(0.28);

    this.enemyLaneGlow = this.add.image(w * 0.5, enemyLaneY, "lane-pulse").setDisplaySize(playWidth * 0.98, h * (isPhone ? 0.15 : 0.2)).setAlpha(0.1);
    this.playerLaneGlow = this.add.image(w * 0.5, playerLaneY, "lane-pulse").setDisplaySize(playWidth * 0.98, h * (isPhone ? 0.18 : 0.21)).setAlpha(0.14);

    const enemyInlay = this.add.image(w * 0.5, enemyLaneY, "panel-edge").setDisplaySize(playWidth, h * (isPhone ? 0.1 : 0.13)).setAlpha(0.22);
    const playerInlay = this.add.image(w * 0.5, playerLaneY, "panel-edge").setDisplaySize(playWidth, h * (isPhone ? 0.12 : 0.145)).setAlpha(0.24);
    const enemyLaneBar = this.add.rectangle(w * 0.5, enemyLaneY, playWidth * 0.96, h * (isPhone ? 0.07 : 0.095), 0x13181b, 0.34);
    const playerLaneBar = this.add.rectangle(w * 0.5, playerLaneY, playWidth * 0.96, h * (isPhone ? 0.085 : 0.104), 0x111519, 0.36);

    this.centerSigil = this.add.image(w * 0.5, boardCenterY - (isPhone ? h * 0.01 : h * 0.02), "center-sigil").setDisplaySize(playWidth * 0.66, h * 0.22).setAlpha(0.74);
    this.centerSigilGlow = this.add.image(w * 0.5, boardCenterY - (isPhone ? h * 0.01 : h * 0.02), "lane-pulse").setDisplaySize(playWidth * 0.48, h * 0.12).setAlpha(0.12);
    const centerSpine = this.add.image(w * 0.5, boardCenterY - (isPhone ? h * 0.01 : h * 0.02), "hud-link").setDisplaySize(playWidth * 0.56, h * 0.06).setAlpha(0.52);
    const centerSpineV = this.add.image(w * 0.5, boardCenterY - (isPhone ? h * 0.01 : h * 0.02), "hud-link").setDisplaySize(h * 0.14, h * 0.06).setAngle(90).setAlpha(0.4);

    const divider = this.add.rectangle(w * 0.5, boardCenterY - (isPhone ? h * 0.01 : h * 0.02), playWidth * 0.8, 2, 0xdab06e, 0.34);
    const dividerGlow = this.add.rectangle(w * 0.5, boardCenterY - (isPhone ? h * 0.01 : h * 0.02), playWidth * 0.84, 18, 0xd59e54, 0.09);

    const foregroundFog = this.add.tileSprite(w * 0.5, h * 0.78, w * 1.1, h * 0.32, "particle-fog").setAlpha(0.14);
    this.tweens.add({ targets: foregroundFog, tilePositionX: 80, duration: 26000, repeat: -1 });

    const upperFocus = this.add.image(w * 0.5, boardCenterY - h * 0.02, "lane-pulse").setDisplaySize(w * 0.52, h * (isPhone ? 0.24 : 0.34)).setAlpha(0.2);
    this.handFocus = this.add.image(w * 0.5, handShelfY - h * 0.005, "lane-pulse").setDisplaySize(playWidth * 0.92, h * (isPhone ? 0.18 : 0.22)).setAlpha(0.36);
    const handShelf = this.add.image(w * 0.5, handShelfY, "panel-edge").setDisplaySize(playWidth * 0.88, h * (isPhone ? 0.08 : 0.11)).setAlpha(0.24);
    const vignette = this.add.image(w * 0.5, h * 0.5, "vignette").setDisplaySize(w, h).setAlpha(0.7);

    const playEdgeOffset = playWidth * 0.5 + (isPhone ? 0 : 82);
    this.playerDeckPos = { x: w * 0.5 - playEdgeOffset, y: isPhone ? h * 0.72 : h * 0.77 };
    this.enemyDeckPos = { x: w * 0.5 + playEdgeOffset, y: isPhone ? h * 0.14 : h * 0.145 };
    this.playerDeck = this.add.image(this.playerDeckPos.x, this.playerDeckPos.y, "deck-back").setDisplaySize(deckWidth, deckHeight).setAlpha(isPhone ? 0 : 0.9);
    this.enemyDeck = this.add.image(this.enemyDeckPos.x, this.enemyDeckPos.y, "deck-back").setDisplaySize(deckWidth, deckHeight).setAngle(180).setAlpha(isPhone ? 0 : 0.86);
    this.playerDeck.setVisible(!isPhone);
    this.enemyDeck.setVisible(!isPhone);

    this.bgLayer.add([
      bg,
      farForest,
      boardTable,
      boardEdge,
      this.enemyLaneGlow,
      this.playerLaneGlow,
      boardFrameInner,
      enemyLaneBar,
      playerLaneBar,
      enemyInlay,
      playerInlay,
      this.centerSigil,
      this.centerSigilGlow,
      centerSpine,
      centerSpineV,
      dividerGlow,
      divider,
      foregroundFog,
      upperFocus,
      this.handFocus,
      handShelf,
      this.playerDeck,
      this.enemyDeck,
      vignette,
    ]);

    this.buildSlotAnchors();
  }

  buildSlotAnchors() {
    const w = this.scale.width;
    const h = this.scale.height;
    const profile = this.getProfile();
    const playWidth = Math.min(w * profile.playWidthRatio, profile.playWidthMax);
    const slots = 7;
    this.slotAnchors = { player: [], ai: [] };
    this.slotSprites = { player: [], ai: [] };
    const startX = w * 0.5 - playWidth * 0.5;

    for (let i = 0; i < slots; i += 1) {
      const t = i / (slots - 1);
      const x = startX + playWidth * t;
      const bend = Math.cos((t - 0.5) * Math.PI) * profile.slotBend;

      const enemyY = h * profile.enemyLaneRatio - bend * 0.45;
      const playerY = h * profile.playerLaneRatio + bend * 0.45;

      this.slotAnchors.ai.push({ x, y: enemyY });
      this.slotAnchors.player.push({ x, y: playerY });

      const enemySlot = this.add.image(x, enemyY, "slot-anchor").setDisplaySize(profile.slotWidth, profile.slotHeight).setAlpha(0.32);
      const playerSlot = this.add.image(x, playerY, "slot-anchor").setDisplaySize(profile.slotWidth, profile.slotHeight).setAlpha(0.38);
      this.slotSprites.ai.push(enemySlot);
      this.slotSprites.player.push(playerSlot);
      this.slotLayer.add([enemySlot, playerSlot]);
    }
  }

  buildZoneMap() {
    const zones = new Map();
    if (!this.viewState) return zones;
    this.viewState.player.hand.forEach((c) => zones.set(c.uid, "hand"));
    this.viewState.player.board.forEach((c) => zones.set(c.uid, "player-board"));
    this.viewState.ai.board.forEach((c) => zones.set(c.uid, "ai-board"));
    return zones;
  }

  recordPosition(uid, view) {
    this.lastKnownPos.set(uid, { x: view.x, y: view.y });
  }

  createView(card, config) {
    const view = new CardView(this, card, {
      interactive: config.interactive,
      disableHover: config.disableHover,
      layoutMode: config.layoutMode || this.getProfile().cardLayout,
      onClick: () => config.onClick?.(card),
    });
    return view;
  }

  isPhoneLayout() {
    return this.getProfile().mode === "phone";
  }

  openPhoneDetail(card, config = {}) {
    const typeLabel = card.type === "character" ? "CHARACTER" : card.subtype === "literary_device" ? "DEVICE" : (card.type || "CARD").toUpperCase();
    this.cardDetailOverlay.open(card, {
      typeLabel,
      actionLabel: config.actionLabel,
      onAction: config.onAction,
    });
  }

  moveTo(view, target, opts = {}) {
    this.tweens.killTweensOf(view);
    if (view.shadow) this.tweens.killTweensOf(view.shadow);
    if (opts.movingDepth !== undefined) view.setDepth(opts.movingDepth);
    this.tweens.add({
      targets: view,
      x: target.x,
      y: target.y,
      angle: target.angle ?? 0,
      scaleX: target.scale ?? view.scaleX,
      scaleY: target.scale ?? view.scaleY,
      duration: opts.duration ?? 230,
      ease: opts.ease ?? "Quad.Out",
      onComplete: () => {
        this.finalizeViewTransform(view, target);
        opts.onComplete?.();
      },
    });
  }

  finalizeViewTransform(view, target) {
    if (!view || !target) return;
    view.setPosition(target.x ?? view.x, target.y ?? view.y);
    view.setAngle(target.angle ?? view.angle);
    if (target.scale !== undefined) {
      view.setScale(target.scale);
    }
    if (target.depth !== undefined) {
      view.setDepth(target.depth);
    }
    view.setHomeTransform();
    this.boardLayer.sort("depth");
    this.handLayer.sort("depth");
  }

  getSlotTargets(side, count) {
    const anchors = this.slotAnchors[side];
    if (!count) return [];
    const start = Math.max(0, Math.floor((anchors.length - count) / 2));
    return anchors.slice(start, start + count);
  }

  syncBoard(side, cards, isEnemy) {
    const map = this.boardViews[side];
    const desired = new Set(cards.map((c) => c.uid));
    const profile = this.getProfile();

    for (const [uid, view] of map.entries()) {
      if (desired.has(uid)) continue;
      map.delete(uid);
      this.recordPosition(uid, view);
      view.animateOut(() => view.destroy());
    }

    const slots = this.getSlotTargets(side, cards.length);

    cards.forEach((card, index) => {
      const target = slots[index] || { x: this.scale.width * 0.5, y: side === "ai" ? this.scale.height * 0.32 : this.scale.height * 0.58 };
      const targetTransform = {
        x: target.x,
        y: target.y,
        angle: 0,
        scale: profile.boardScale,
        depth: side === "ai" ? 70 + index : 90 + index,
      };

      let view = map.get(card.uid);
      const prevZone = this.prevZones.get(card.uid);
      const fromPos = this.lastKnownPos.get(card.uid);

      if (!view) {
        view = this.createView(card, {
          interactive: true,
          disableHover: isEnemy,
          layoutMode: profile.cardLayout,
          onClick: () => {
            if (this.viewState.winner || this.viewState.pendingQuiz || this.viewState.currentPlayer !== "player") return;
            if (!isEnemy) {
              this.adapter.actions.selectAttacker?.(card.uid);
              return;
            }
            if (this.viewState.selectedAttackerUid) this.adapter.actions.attackUnit?.(card.uid);
          },
        });

        let origin;
        if (prevZone === "hand" && fromPos) {
          origin = fromPos;
        } else if (fromPos) {
          origin = fromPos;
        } else if (side === "ai" && profile.mode === "phone") {
          origin = {
            x: target.x,
            y: Math.min(target.y - 56, this.scale.height * Math.max(0.18, profile.enemyLaneRatio - 0.1)),
          };
        } else {
          origin = side === "ai" ? this.enemyDeckPos : this.playerDeckPos;
        }

        view.setPosition(origin.x, origin.y);
        view.setScale(prevZone === "hand" ? this.getProfile().handScale : 0.58);
        view.setAngle(prevZone === "hand" ? 0 : side === "ai" ? -8 : 8);
        view.setAlpha(side === "ai" && profile.mode === "phone" ? 0.92 : 0.8);
        this.boardLayer.add(view);
        map.set(card.uid, view);
      }

      view.setLayout(profile.cardLayout);
      view.updateData(card);
      view.alpha = card.exhausted ? 0.68 : 1;
      view.setSelected(!isEnemy && this.viewState.selectedAttackerUid === card.uid);
      view.setTargetable(Boolean(isEnemy && this.viewState.currentPlayer === "player" && !this.viewState.winner && !this.viewState.pendingQuiz && this.viewState.selectedAttackerUid));

      this.moveTo(view, targetTransform, {
        duration: prevZone === "hand" ? 270 : 210,
        ease: side === "ai" && profile.mode === "phone" && !fromPos ? "Cubic.Out" : prevZone === "hand" ? "Cubic.Out" : "Quad.Out",
        movingDepth: side === "ai" && profile.mode === "phone" ? 118 + index : undefined,
        onComplete: () => this.recordPosition(card.uid, view),
      });
    });
  }

  syncHand(cards) {
    const desired = new Set(cards.map((c) => c.uid));
    const profile = this.getProfile();

    for (const [uid, view] of this.handViews.entries()) {
      if (desired.has(uid)) continue;
      this.handViews.delete(uid);
      this.recordPosition(uid, view);
      if (this.currentZones.has(uid) && this.currentZones.get(uid).includes("board")) {
        this.tweens.add({
          targets: view,
          alpha: 0,
          duration: 120,
          onComplete: () => view.destroy(),
        });
      } else {
        view.animateOut(() => view.destroy());
      }
    }

    const fanTargets = this.handFan.computeTargets(cards.length, {
      width: this.scale.width,
      height: this.scale.height,
      baseY: profile.handBaseY,
      sidePadding: profile.handSidePadding,
      minSpread: profile.handMinSpread,
      maxAngle: profile.handAngle,
      angleStep: profile.handAngleStep,
      liftStep: profile.handLiftStep,
      maxSpread: profile.handMaxSpread,
      edgeScaleBoost: profile.handEdgeScaleBoost,
      centerScaleBase: profile.handCenterScaleBase,
    });
    cards.forEach((card, index) => {
      const fan = fanTargets[index];
      const canPlay =
        !this.viewState.winner &&
        !this.viewState.pendingQuiz &&
        this.viewState.currentPlayer === "player" &&
        (card.playCost ?? card.cost ?? 0) <= this.viewState.player.inspiration;
      let view = this.handViews.get(card.uid);
      const prevZone = this.prevZones.get(card.uid);
      const fromPos = this.lastKnownPos.get(card.uid);

      if (!view) {
        view = this.createView(card, {
          interactive: true,
          disableHover: false,
          layoutMode: profile.cardLayout,
          onClick: () => this.adapter.actions.playHandCard?.(card.uid),
        });

        const origin = fromPos || this.playerDeckPos;
        view.setPosition(origin.x, origin.y);
        view.setScale(0.58);
        view.setAngle(8);
        view.setAlpha(0.8);
        this.handLayer.add(view);
        this.handViews.set(card.uid, view);
      }

      view.setLayout(profile.cardLayout);
      view.updateData(card);
      view.alpha = canPlay ? 1 : 0.56;
      view.setInputEnabled(canPlay);
      view.setThemeMatch(Boolean(card.matchesTheme));
      this.handLayer.bringToTop(view);

      const target = {
        x: fan.x,
        y: fan.y,
        angle: fan.angle,
        scale: profile.handScale * (fan.scale ?? 1),
        depth: fan.depth,
      };

      this.moveTo(view, target, {
        duration: prevZone ? 190 : 280,
        ease: prevZone ? "Quad.Out" : "Cubic.Out",
        onComplete: () => this.recordPosition(card.uid, view),
      });
    });
  }

  pulseActiveLane() {
    if (!this.viewState) return;
    const isPlayer = this.viewState.currentPlayer === "player";
    const active = isPlayer ? this.playerLaneGlow : this.enemyLaneGlow;
    const passive = isPlayer ? this.enemyLaneGlow : this.playerLaneGlow;

    this.tweens.add({ targets: passive, alpha: 0.08, duration: 180, ease: "Sine.Out" });
    this.tweens.add({ targets: active, alpha: 0.34, duration: 220, yoyo: true, ease: "Sine.Out" });
    this.tweens.add({
      targets: this.centerSigilGlow,
      alpha: isPlayer ? 0.2 : 0.15,
      duration: 200,
      yoyo: true,
      ease: "Sine.Out",
    });
    this.tweens.add({
      targets: this.handFocus,
      alpha: isPlayer ? 0.34 : 0.18,
      duration: 220,
      ease: "Sine.Out",
    });
    this.tweens.add({
      targets: this.slotSprites.player,
      alpha: isPlayer ? 0.52 : 0.33,
      scaleX: isPlayer ? 1.06 : 1,
      scaleY: isPlayer ? 1.06 : 1,
      duration: 200,
      ease: "Sine.Out",
    });
    this.tweens.add({
      targets: this.slotSprites.ai,
      alpha: isPlayer ? 0.3 : 0.5,
      scaleX: isPlayer ? 1 : 1.06,
      scaleY: isPlayer ? 1 : 1.06,
      duration: 200,
      ease: "Sine.Out",
    });
  }

  handleCardImpact(detail) {
    if (!detail) return;
    if (detail.uid) {
      const view = this.handViews.get(detail.uid) || this.boardViews.player.get(detail.uid) || this.boardViews.ai.get(detail.uid);
      if (view) {
        this.tweens.add({ targets: view, x: view.x + 7, yoyo: true, repeat: 2, duration: 56, ease: "Sine.InOut" });
      }
    }

    if (detail.kind === "hit") {
      this.cameras.main.shake(165, 0.0017);
    }
  }

  renderState() {
    if (!this.viewState) return;

    if (!this.isPhoneLayout() || this.viewState.pendingQuiz || this.viewState.winner) {
      this.cardDetailOverlay.hide();
    }

    this.prevZones = this.currentZones;
    this.currentZones = this.buildZoneMap();

    this.syncBoard("ai", this.viewState.ai.board, true);
    this.syncBoard("player", this.viewState.player.board, false);
    this.syncHand(this.viewState.player.hand);

    if (this.lastTurn !== this.viewState.currentPlayer || this.lastTurn === null) {
      const label = this.viewState.currentPlayer === "player" ? "YOUR TURN" : "ENEMY TURN";
      this.game.events.emit("acg:turn-banner", label);
      this.pulseActiveLane();
      this.lastTurn = this.viewState.currentPlayer;
    }
  }
}
