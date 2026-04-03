import { StateAdapter } from "../core/stateAdapter.js";
import { BackgroundLayerManager } from "../core/BackgroundLayerManager.js";
import { WONDERLAND_BACKGROUND_CONFIG } from "../assets/backgroundManifest.js";
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
    this.loggedBackgroundCoverageDebug = false;
  }

  create() {
    this.root = this.add.container(0, 0);
    this.backgroundArtLayer = this.add.container(0, 0);
    this.bgLayer = this.add.container(0, 0);
    this.slotLayer = this.add.container(0, 0);
    this.boardLayer = this.add.container(0, 0);
    this.handLayer = this.add.container(0, 0);
    this.inspectLayer = this.add.container(0, 0);
    this.fxLayer = this.add.container(0, 0);

    this.root.add([this.backgroundArtLayer, this.bgLayer, this.slotLayer, this.boardLayer, this.handLayer, this.inspectLayer, this.fxLayer]);

    this.backgroundLayerManager = new BackgroundLayerManager(this, this.backgroundArtLayer, WONDERLAND_BACKGROUND_CONFIG);
    this.backgroundLayerManager.create();

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
      this.backgroundLayerManager.layout(this.scale.width, this.scale.height);
      this.drawBattlefield();
      this.cardDetailOverlay.layout(this.scale.width, this.scale.height);
      this.renderState();
    });
  }

  shutdown() {
    window.removeEventListener("acg:fx", this.cardImpactHandler);
    this.backgroundLayerManager?.destroy();
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
        handShelfRatio: 0.83,
        handBaseY: this.scale.height - 118,
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
        handShelfRatio: 0.82,
        handBaseY: this.scale.height - 124,
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
        handShelfRatio: 0.812,
        handBaseY: this.scale.height - 132,
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
      handShelfRatio: 0.805,
      handBaseY: this.scale.height - 140,
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

    // Temporary Wonderland board isolation pass:
    // remove legacy guide art as well as shell remnants so the authored board
    // can be viewed with minimal overlay interference.

    this.enemyLaneGlow = null;
    this.playerLaneGlow = null;

    this.centerSigil = null;
    this.centerSigilGlow = null;
    this.handFocus = null;

    const playEdgeOffset = playWidth * 0.5 + (isPhone ? 0 : 82);
    this.playerDeckPos = { x: w * 0.5 - playEdgeOffset, y: isPhone ? h * 0.72 : h * 0.77 };
    this.enemyDeckPos = { x: w * 0.5 + playEdgeOffset, y: isPhone ? h * 0.14 : h * 0.145 };
    this.playerDeck = this.add.image(this.playerDeckPos.x, this.playerDeckPos.y, "deck-back").setDisplaySize(deckWidth, deckHeight).setAlpha(isPhone ? 0 : 0.9);
    this.enemyDeck = this.add.image(this.enemyDeckPos.x, this.enemyDeckPos.y, "deck-back").setDisplaySize(deckWidth, deckHeight).setAngle(180).setAlpha(isPhone ? 0 : 0.86);
    this.playerDeck.setVisible(!isPhone);
    this.enemyDeck.setVisible(!isPhone);

    this.bgLayer.add([
      this.playerDeck,
      this.enemyDeck,
    ]);

    if (WONDERLAND_BACKGROUND_CONFIG.debugDiagnostics && !this.loggedBackgroundCoverageDebug) {
      console.info("[Wonderland BG][coverage]", {
        backgroundArtLayer: [
          "bg_base_field",
          "bg_surface_motifs",
          "bg_frame_border",
          "bg_atmosphere",
          "bg_corner_*",
        ],
        bgLayerFullscreenOrLargeCovers: [
          { key: "bg graphics gradient", coverage: "fullscreen", alpha: 1 },
          { key: "farForest graphics", coverage: "upper/center wide", alpha: 0.58 },
          { key: "panel-base boardTable", coverage: "large center board shell", alpha: 1 },
          { key: "panel-edge boardEdge", coverage: "large center shell edge", alpha: 0.76 },
          { key: "vignette", coverage: "fullscreen", alpha: 0.7 },
        ],
        likelyResult: "Wonderland base/frame are rendered underneath, but much of their visual read is being covered by opaque or high-alpha match shell layers in bgLayer.",
      });
      this.loggedBackgroundCoverageDebug = true;
    }

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
    if (!view) return;
    const target = view.layoutTarget;
    this.lastKnownPos.set(uid, {
      x: target?.x ?? view.x,
      y: target?.y ?? view.y,
    });
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
    view.layoutTarget = { ...target };
    view.layoutDomain = opts.domain || view.layoutDomain || "free";
    const domain = view.layoutDomain;
    view.layoutRevision = (view.layoutRevision || 0) + 1;
    const revision = view.layoutRevision;
    if (view.inspectRaised) {
      return;
    }
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
        this.finalizeViewTransform(view, target, revision, domain);
        opts.onComplete?.();
      },
    });
  }

  finalizeViewTransform(view, target, revision = null, domain = null) {
    if (!view || !target) return;
    if (revision !== null && view.layoutRevision !== revision) return;
    if (domain !== null && view.layoutDomain !== domain) return;
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
    this.inspectLayer.sort("depth");
  }

  liftViewForInspect(view) {
    if (!view || view.parentContainer === this.inspectLayer) return;
    const parent = view.parentContainer;
    if (!parent) return;
    view.inspectParentContainer = parent;
    view.inspectParentIndex = typeof parent.getIndex === "function" ? parent.getIndex(view) : null;
    parent.remove(view);
    this.inspectLayer.add(view);
  }

  restoreViewFromInspect(view) {
    if (!view || view.parentContainer !== this.inspectLayer) return;
    const parent = view.inspectParentContainer;
    this.inspectLayer.remove(view);
    if (parent) {
      const index = view.inspectParentIndex;
      const childCount = Array.isArray(parent.list) ? parent.list.length : (typeof parent.length === "number" ? parent.length : 0);
      if (typeof index === "number" && typeof parent.addAt === "function") {
        parent.addAt(view, Math.min(index, childCount));
      } else {
        parent.add(view);
      }
    } else {
      this.boardLayer.add(view);
    }
    view.inspectParentContainer = null;
    view.inspectParentIndex = null;
    this.boardLayer.sort("depth");
    this.handLayer.sort("depth");
    this.inspectLayer.sort("depth");
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
      const lastTarget = view.layoutTarget ? { ...view.layoutTarget } : null;
      view.layoutRevision = (view.layoutRevision || 0) + 1;
      view.layoutDomain = null;
      view.layoutTarget = null;
      this.tweens.killTweensOf(view);
      if (view.shadow) this.tweens.killTweensOf(view.shadow);
      view.clearHoverTweens?.();
      view.forceEndInspect?.();
      if (lastTarget) {
        this.lastKnownPos.set(uid, { x: lastTarget.x, y: lastTarget.y });
      } else {
        this.recordPosition(uid, view);
      }
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
      const sourceHandView = prevZone === "hand" ? this.handViews.get(card.uid) : null;
      const handOrigin = sourceHandView?.layoutTarget
        ? { x: sourceHandView.layoutTarget.x, y: sourceHandView.layoutTarget.y }
        : sourceHandView
          ? { x: sourceHandView.x, y: sourceHandView.y }
          : null;
      const fromPos = handOrigin || this.lastKnownPos.get(card.uid);

      if (!view) {
        view = this.createView(card, {
          interactive: true,
          disableHover: isEnemy,
          layoutMode: profile.cardLayout,
          onClick: () => {
            if (
              this.viewState.winner ||
              this.viewState.pendingQuiz ||
              this.viewState.pendingHandDiscard ||
              this.viewState.currentPlayer !== "player"
            ) return;
            if (this.viewState.pendingTarget?.effect === "swing_target_character_turn" && card.type === "character") {
              this.adapter.actions.resolveCardTarget?.(card.uid);
              return;
            }
            if (!isEnemy) {
              this.adapter.actions.selectAttacker?.(card.uid);
              return;
            }
            if (this.viewState.selectedAttackerUid) this.adapter.actions.attackUnit?.(card.uid);
          },
        });

        let origin;
        if (prevZone === "hand" && handOrigin) {
          origin = handOrigin;
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
      const discardMode = Boolean(this.viewState.pendingHandDiscard);
      const pendingTargeting = Boolean(this.viewState.pendingTarget?.effect === "swing_target_character_turn");
      const canUseAsCardTarget =
        pendingTargeting &&
        this.viewState.currentPlayer === "player" &&
        !this.viewState.winner &&
        !this.viewState.pendingQuiz &&
        !discardMode &&
        card.type === "character";
      view.setSelected(!discardMode && !pendingTargeting && !isEnemy && this.viewState.selectedAttackerUid === card.uid);
      view.setTargetable(
        canUseAsCardTarget ||
        Boolean(isEnemy && this.viewState.currentPlayer === "player" && !this.viewState.winner && !this.viewState.pendingQuiz && !discardMode && !pendingTargeting && this.viewState.selectedAttackerUid)
      );

      this.moveTo(view, targetTransform, {
        domain: side === "ai" ? "ai-board" : "player-board",
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
      const lastTarget = view.layoutTarget ? { ...view.layoutTarget } : null;
      view.layoutRevision = (view.layoutRevision || 0) + 1;
      view.layoutTarget = null;
      this.tweens.killTweensOf(view);
      if (view.shadow) this.tweens.killTweensOf(view.shadow);
      view.clearHoverTweens?.();
      view.forceEndInspect?.();
      if (lastTarget) {
        this.lastKnownPos.set(uid, { x: lastTarget.x, y: lastTarget.y });
      } else {
      this.recordPosition(uid, view);
      }
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
      const discardMode = Boolean(this.viewState?.pendingHandDiscard?.ownerKey === "player");
      const canPlay = Boolean(card.playable);
      const canAct = discardMode || canPlay;
      let view = this.handViews.get(card.uid);
      const prevZone = this.prevZones.get(card.uid);
      const fromPos = this.lastKnownPos.get(card.uid);

      if (!view) {
        view = this.createView(card, {
          interactive: true,
          disableHover: false,
          layoutMode: profile.cardLayout,
          onClick: () => {
            if (this.viewState?.pendingHandDiscard) {
              this.adapter.actions.discardHandCard?.(card.uid);
              return;
            }
            this.adapter.actions.playHandCard?.(card.uid);
          },
        });

        const origin = fromPos || this.playerDeckPos;
        view.setPosition(origin.x, origin.y);
        view.setScale(0.58);
        view.setAngle(8);
        view.setAlpha(0.8);
        view.setSettling(true);
        this.handLayer.add(view);
        this.handViews.set(card.uid, view);
      } else if (prevZone !== "hand") {
        view.setSettling(true);
      }

      view.setLayout(profile.cardLayout);
      view.updateData(card);
      view.alpha = canAct ? 1 : 0.56;
      view.setInputEnabled(true);
      view.setActionEnabled(canAct);
      view.setThemeMatch(Boolean(card.matchesTheme));
      view.setTargetable(discardMode);
      this.handLayer.bringToTop(view);

      const target = {
        x: fan.x,
        y: fan.y,
        angle: fan.angle,
        scale: profile.handScale * (fan.scale ?? 1),
        depth: fan.depth,
      };

      this.moveTo(view, target, {
        domain: "hand",
        duration: prevZone ? 190 : 280,
        ease: prevZone ? "Quad.Out" : "Cubic.Out",
        onComplete: () => {
          view.setSettling(false);
          this.recordPosition(card.uid, view);
        },
      });
    });
  }

  pulseActiveLane() {
    if (!this.viewState) return;
    const isPlayer = this.viewState.currentPlayer === "player";
    const active = isPlayer ? this.playerLaneGlow : this.enemyLaneGlow;
    const passive = isPlayer ? this.enemyLaneGlow : this.playerLaneGlow;

    if (passive) this.tweens.add({ targets: passive, alpha: 0.03, duration: 180, ease: "Sine.Out" });
    if (active) this.tweens.add({ targets: active, alpha: 0.12, duration: 220, yoyo: true, ease: "Sine.Out" });
    if (this.handFocus) {
      this.tweens.add({
        targets: this.handFocus,
        alpha: isPlayer ? 0.12 : 0.05,
        duration: 220,
        ease: "Sine.Out",
      });
    }
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

  update(time, delta) {
    this.backgroundLayerManager?.update(delta);
  }
}
