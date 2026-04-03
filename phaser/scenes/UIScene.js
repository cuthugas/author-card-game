import { PanelView } from "../views/PanelView.js";
import { ButtonView } from "../views/ButtonView.js";
import { TurnBanner } from "../views/TurnBanner.js";
import { StateAdapter } from "../core/stateAdapter.js";
import { QuizOverlay } from "../views/QuizOverlay.js";
import { WinnerOverlay } from "../views/WinnerOverlay.js";
import { CardView } from "../views/CardView.js";

const HAND_REVEAL_EVENT_NAME = "acg:hand-reveal";
const APP_BUILD_ID = window.__ACG_APP_BUILD_ID || "LOCAL-2026-04-03-B";
export class UIScene extends Phaser.Scene {
  constructor() {
    super("ui");
    this.adapter = new StateAdapter();
    this.current = null;
    this.previous = null;
    this.lastWinner = null;
    this.canDirectAttack = false;
    this.fullscreenChangeHandler = null;
    this.handRevealHandler = null;
    this.handRevealViews = [];
    this.handRevealTimer = null;
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    this.attemptDirectAttack = () => {
      if (!this.canDirectAttack) return;
      this.adapter.actions.attackWriter?.();
    };

    this.playerPanel = new PanelView(this, w * 0.5, h - 46, "player", "You");
    this.enemyPanel = new PanelView(this, w * 0.5, 48, "ai", "AI");
    this.enemyPanel.onPrimaryAction(() => this.attemptDirectAttack());

    this.playerPanelDock = this.add.image(0, 0, "panel-edge").setAlpha(0.28);
    this.enemyPanelDock = this.add.image(0, 0, "panel-edge").setAlpha(0.24);
    this.enemyPanelDock.setInteractive({ useHandCursor: true });
    this.enemyPanelDock.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      this.attemptDirectAttack();
    });
    this.actionDock = this.add.image(0, 0, "panel-base").setTint(0x2a1f17).setAlpha(0.72);
    this.actionDockEdge = this.add.image(0, 0, "panel-edge").setAlpha(0.5);
    this.actionLink = this.add.image(0, 0, "hud-link").setAlpha(0.45);
    this.infoDock = this.add.image(0, 0, "panel-base").setTint(0x2d2219).setAlpha(0.78);
    this.infoDockEdge = this.add.image(0, 0, "panel-edge").setAlpha(0.56);
    this.infoLink = this.add.image(0, 0, "hud-link").setAlpha(0.42);
    this.utilityDock = this.add.image(0, 0, "panel-base").setTint(0x221913).setAlpha(0.62);
    this.utilityDockEdge = this.add.image(0, 0, "panel-edge").setAlpha(0.46);

    this.drawBtn = new ButtonView(this, w - 208, h - 118, "DRAW", () => this.adapter.actions.draw?.());
    this.endTurnBtn = new ButtonView(this, w - 208, h - 52, "END TURN", () => this.adapter.actions.endTurn?.());
    this.fullscreenBtn = new ButtonView(this, w - 208, h - 184, "FULL", async () => {
      const success = await this.adapter.actions.toggleFullscreen?.();
      if (success === false) {
        this.updateFullscreenButton();
      }
    });
    this.drawBtn.setDepth(1130);
    this.endTurnBtn.setDepth(1130);
    this.fullscreenBtn.setDepth(1130);
    this.playerPanel.setDepth(1120);
    this.enemyPanel.setDepth(1120);

    this.turnInfo = this.add
      .text(48, 94, "Turn 1", {
        fontFamily: "Cinzel",
        fontSize: "26px",
        color: "#f1ddaf",
        stroke: "#1a130d",
        strokeThickness: 4,
      })
      .setOrigin(0, 0.5);

    this.themeInfo = this.add
      .text(48, 124, "Theme", {
        fontFamily: "Spectral",
        fontSize: "20px",
        color: "#d7c7a5",
      })
      .setOrigin(0, 0.5);
    this.themeReminder = this.add
      .text(48, 150, "", {
        fontFamily: "Spectral",
        fontSize: "16px",
        color: "#f2deaa",
        wordWrap: { width: 460 },
      })
      .setOrigin(0, 0.5);
    this.modeInfo = this.add
      .text(w * 0.5, h - 208, "", {
        fontFamily: "Spectral",
        fontSize: "20px",
        color: "#ffd3a1",
        stroke: "#2a130c",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5)
      .setAlpha(0);
    this.buildMarker = this.add
      .text(18, h - 18, `BUILD ${APP_BUILD_ID}`, {
        fontFamily: "Spectral",
        fontSize: "12px",
        color: "#d6c29a",
        stroke: "#120d09",
        strokeThickness: 3,
      })
      .setOrigin(0, 1)
      .setAlpha(0.82);

    this.turnInfo.setDepth(1150);
    this.themeInfo.setDepth(1150);
    this.themeReminder.setDepth(1150);
    this.modeInfo.setDepth(1152);
    this.buildMarker.setDepth(1150);
    this.playerPanelDock.setDepth(1080);
    this.enemyPanelDock.setDepth(1080);
    this.actionDock.setDepth(1080);
    this.actionDockEdge.setDepth(1081);
    this.actionLink.setDepth(1082);
    this.utilityDock.setDepth(1084);
    this.utilityDockEdge.setDepth(1085);
    this.infoDock.setDepth(1086);
    this.infoDockEdge.setDepth(1087);
    this.infoLink.setDepth(1088);

    this.turnBanner = new TurnBanner(this);
    this.quizOverlay = new QuizOverlay(this);
    this.winnerOverlay = new WinnerOverlay(this, () => this.adapter.actions.newGame?.());
    this.handRevealShade = this.add.rectangle(w * 0.5, h * 0.5, w, h, 0x05070b, 0.48).setVisible(false).setAlpha(0).setDepth(1180);
    this.handRevealShade.setInteractive();
    this.handRevealShade.on("pointerdown", () => this.hideHandReveal());
    this.handRevealPanel = this.add.image(w * 0.5, h * 0.46, "panel-base").setTint(0x1d1611).setVisible(false).setAlpha(0).setDepth(1181);
    this.handRevealEdge = this.add.image(w * 0.5, h * 0.46, "panel-edge").setVisible(false).setAlpha(0).setDepth(1182);
    this.handRevealTitle = this.add.text(w * 0.5, h * 0.2, "", {
      fontFamily: "Cinzel",
      fontSize: "24px",
      color: "#f3dfb2",
      stroke: "#1b140f",
      strokeThickness: 4,
      align: "center",
    }).setOrigin(0.5).setVisible(false).setAlpha(0).setDepth(1183);
    this.handRevealHint = this.add.text(w * 0.5, h * 0.72, "Tap anywhere to close", {
      fontFamily: "Spectral",
      fontSize: "15px",
      color: "#e2d3b6",
      align: "center",
    }).setOrigin(0.5).setVisible(false).setAlpha(0).setDepth(1183);

    this.game.events.on("acg:view-state", (state) => {
      this.previous = this.current;
      this.current = state;
      this.renderState();
    });
    this.game.events.on("acg:turn-banner", (label) => this.turnBanner.show(label));

    this.adapter.connect((state) => {
      this.previous = this.current;
      this.current = state;
      this.renderState();
    });

    if (window.ACGCore?.ui) {
      window.ACGCore.ui.setQuizHandler((payload) => {
        return this.quizOverlay.open(payload);
      });
      window.ACGCore.ui.setWinnerHandler((payload) => {
        if (payload) this.winnerOverlay.show(payload);
        else this.winnerOverlay.hide();
      });
    }

    this.fullscreenChangeHandler = () => {
      this.updateFullscreenButton();
      this.layout(this.scale.width, this.scale.height);
    };
    document.addEventListener("fullscreenchange", this.fullscreenChangeHandler);
    document.addEventListener("webkitfullscreenchange", this.fullscreenChangeHandler);
    this.handRevealHandler = (e) => this.showHandReveal(e.detail || {});
    window.addEventListener(HAND_REVEAL_EVENT_NAME, this.handRevealHandler);

    this.scale.on("resize", (size) => this.layout(size.width, size.height));
    this.layout(w, h);
  }

  shutdown() {
    if (this.fullscreenChangeHandler) {
      document.removeEventListener("fullscreenchange", this.fullscreenChangeHandler);
      document.removeEventListener("webkitfullscreenchange", this.fullscreenChangeHandler);
      this.fullscreenChangeHandler = null;
    }
    if (this.handRevealHandler) {
      window.removeEventListener(HAND_REVEAL_EVENT_NAME, this.handRevealHandler);
      this.handRevealHandler = null;
    }
  }

  getLayoutProfile(w, h) {
    if (w < 900 || h < 540) {
      return {
        mode: "phone",
        enemyPanelPos: { x: 88, y: 22 },
        playerPanelPos: { x: 88, y: h - 20 },
        actionPos: { x: w - 58, y: h - 52 },
        fullscreenPos: { x: w - 58, y: h - 134 },
        drawPos: { x: w - 58, y: h - 84 },
        endTurnPos: { x: w - 58, y: h - 34 },
        playerDockSize: { w: 0, h: 0 },
        enemyDockSize: { w: 0, h: 0 },
        actionDockSize: { w: 0, h: 0 },
        actionEdgeSize: { w: 0, h: 0 },
        actionLinkSize: { w: 0, h: 0 },
        actionLinkOffset: 0,
        infoDockPos: { x: 0, y: 0 },
        infoDockSize: { w: 0, h: 0 },
        infoEdgeSize: { w: 0, h: 0 },
        infoLinkSize: { w: 0, h: 0 },
        utilityDockPos: { x: 0, y: 0 },
        utilityDockSize: { w: 0, h: 0 },
        utilityEdgeSize: { w: 0, h: 0 },
        playerPanelScale: 0.92,
        enemyPanelScale: 0.92,
        playerPanelLayout: "phone-player",
        enemyPanelLayout: "phone",
        drawScale: 0.92,
        endTurnScale: 0.92,
        fullscreenScale: 0.9,
        buttonLayout: "phone",
        fullscreenLabel: "FULL",
        drawLabel: "DRAW",
        endTurnLabel: "END",
        showActionDock: false,
        showInfoDock: false,
        showUtilityDock: false,
        turnInfo: { x: 12, y: 18, size: "11px" },
        themeInfo: { x: 12, y: 33, size: "10px" },
        themeReminder: { x: 12, y: 46, size: "9px", width: Math.max(144, w * 0.24), visible: false },
      };
    }

    if (w < 1180) {
      return {
        mode: "compact",
        enemyPanelPos: { x: 188, y: 74 },
        playerPanelPos: { x: 208, y: h - 144 },
        actionPos: { x: w - 132, y: h - 118 },
        fullscreenPos: { x: w - 86, y: 58 },
        drawPos: { x: w - 132, y: h - 150 },
        endTurnPos: { x: w - 132, y: h - 86 },
        playerDockSize: { w: 312, h: 96 },
        enemyDockSize: { w: 312, h: 96 },
        actionDockSize: { w: 136, h: 148 },
        actionEdgeSize: { w: 144, h: 156 },
        actionLinkSize: { w: 104, h: 20 },
        actionLinkOffset: 78,
        infoDockPos: { x: w * 0.5, y: 82 },
        infoDockSize: { w: Math.min(384, w * 0.36), h: 78 },
        infoEdgeSize: { w: Math.min(392, w * 0.37), h: 86 },
        infoLinkSize: { w: 110, h: 18 },
        utilityDockPos: { x: w - 86, y: 58 },
        utilityDockSize: { w: 96, h: 46 },
        utilityEdgeSize: { w: 102, h: 52 },
        playerPanelScale: 0.92,
        enemyPanelScale: 0.92,
        playerPanelLayout: "desktop",
        enemyPanelLayout: "desktop",
        drawScale: 0.96,
        endTurnScale: 1.01,
        fullscreenScale: 0.78,
        buttonLayout: "default",
        fullscreenLabel: "FULL",
        drawLabel: "DRAW",
        endTurnLabel: "END TURN",
        showActionDock: true,
        showInfoDock: true,
        showUtilityDock: true,
        turnInfo: { x: w * 0.5 - 166, y: 62, size: "16px" },
        themeInfo: { x: w * 0.5 - 166, y: 84, size: "14px" },
        themeReminder: { x: w * 0.5 - 166, y: 104, size: "12px", width: 300 },
      };
    }

    if (w < 1600) {
      return {
        mode: "desktop",
        enemyPanelPos: { x: 214, y: 78 },
        playerPanelPos: { x: 236, y: h - 132 },
        actionPos: { x: w - 154, y: h - 122 },
        fullscreenPos: { x: w - 92, y: 60 },
        drawPos: { x: w - 154, y: h - 156 },
        endTurnPos: { x: w - 154, y: h - 88 },
        playerDockSize: { w: 336, h: 94 },
        enemyDockSize: { w: 336, h: 94 },
        actionDockSize: { w: 148, h: 158 },
        actionEdgeSize: { w: 156, h: 166 },
        actionLinkSize: { w: 118, h: 20 },
        actionLinkOffset: 88,
        infoDockPos: { x: w * 0.5, y: 86 },
        infoDockSize: { w: 452, h: 84 },
        infoEdgeSize: { w: 460, h: 92 },
        infoLinkSize: { w: 126, h: 20 },
        utilityDockPos: { x: w - 92, y: 60 },
        utilityDockSize: { w: 100, h: 48 },
        utilityEdgeSize: { w: 106, h: 54 },
        playerPanelScale: 0.93,
        enemyPanelScale: 0.93,
        playerPanelLayout: "desktop",
        enemyPanelLayout: "desktop",
        drawScale: 0.98,
        endTurnScale: 1.03,
        fullscreenScale: 0.8,
        buttonLayout: "default",
        fullscreenLabel: "FULL",
        drawLabel: "DRAW",
        endTurnLabel: "END TURN",
        showActionDock: true,
        showInfoDock: true,
        showUtilityDock: true,
        turnInfo: { x: w * 0.5 - 198, y: 62, size: "17px" },
        themeInfo: { x: w * 0.5 - 198, y: 86, size: "15px" },
        themeReminder: { x: w * 0.5 - 198, y: 108, size: "12px", width: 372 },
      };
    }

    return {
      mode: "wide",
      enemyPanelPos: { x: 236, y: 82 },
      playerPanelPos: { x: 256, y: h - 136 },
      actionPos: { x: w - 176, y: h - 126 },
      fullscreenPos: { x: w - 96, y: 62 },
      drawPos: { x: w - 176, y: h - 162 },
      endTurnPos: { x: w - 176, y: h - 90 },
      playerDockSize: { w: 356, h: 98 },
      enemyDockSize: { w: 356, h: 98 },
      actionDockSize: { w: 154, h: 166 },
      actionEdgeSize: { w: 162, h: 176 },
      actionLinkSize: { w: 132, h: 20 },
      actionLinkOffset: 94,
      infoDockPos: { x: w * 0.5, y: 90 },
      infoDockSize: { w: 524, h: 90 },
      infoEdgeSize: { w: 532, h: 98 },
      infoLinkSize: { w: 136, h: 20 },
      utilityDockPos: { x: w - 96, y: 62 },
      utilityDockSize: { w: 102, h: 50 },
      utilityEdgeSize: { w: 110, h: 56 },
      playerPanelScale: 0.95,
      enemyPanelScale: 0.95,
      playerPanelLayout: "wide",
      enemyPanelLayout: "wide",
      drawScale: 1,
      endTurnScale: 1.04,
      fullscreenScale: 0.82,
      buttonLayout: "default",
      fullscreenLabel: "FULL",
      drawLabel: "DRAW",
      endTurnLabel: "END TURN",
      showActionDock: true,
      showInfoDock: true,
      showUtilityDock: true,
      turnInfo: { x: w * 0.5 - 234, y: 64, size: "18px" },
      themeInfo: { x: w * 0.5 - 234, y: 90, size: "16px" },
      themeReminder: { x: w * 0.5 - 234, y: 114, size: "13px", width: 430 },
    };
  }

  layout(w, h) {
    const profile = this.getLayoutProfile(w, h);

    this.playerPanel.setLayout(profile.playerPanelLayout);
    this.enemyPanel.setLayout(profile.enemyPanelLayout);
    this.drawBtn.setLayout(profile.buttonLayout);
    this.endTurnBtn.setLayout(profile.buttonLayout);
    this.fullscreenBtn.setLayout(profile.buttonLayout);
    this.drawBtn.setLabel(profile.drawLabel);
    this.endTurnBtn.setLabel(profile.endTurnLabel);
    this.fullscreenBtn.setLabel(profile.fullscreenLabel);

    this.playerPanelDock.setPosition(profile.playerPanelPos.x, profile.playerPanelPos.y);
    this.playerPanelDock.setDisplaySize(profile.playerDockSize.w, profile.playerDockSize.h);
    this.enemyPanelDock.setPosition(profile.enemyPanelPos.x, profile.enemyPanelPos.y);
    this.enemyPanelDock.setDisplaySize(profile.enemyDockSize.w, profile.enemyDockSize.h);
    this.playerPanelDock.setAlpha(profile.mode === "phone" ? 0.14 : 0.28);
    this.enemyPanelDock.setAlpha(profile.mode === "phone" ? 0.14 : 0.24);

    this.actionDock.setPosition(profile.actionPos.x, profile.actionPos.y);
    this.actionDock.setDisplaySize(profile.actionDockSize.w, profile.actionDockSize.h);
    this.actionDockEdge.setPosition(this.actionDock.x, this.actionDock.y);
    this.actionDockEdge.setDisplaySize(profile.actionEdgeSize.w, profile.actionEdgeSize.h);
    this.actionLink.setPosition(this.actionDock.x - profile.actionLinkOffset, this.actionDock.y);
    this.actionLink.setDisplaySize(profile.actionLinkSize.w, profile.actionLinkSize.h);
    this.actionDock.setAlpha(profile.showActionDock ? 0.72 : 0);
    this.actionDockEdge.setAlpha(profile.showActionDock ? 0.5 : 0);
    this.actionLink.setAlpha(profile.showActionDock ? 0.45 : 0);

    this.infoDock.setPosition(profile.infoDockPos.x, profile.infoDockPos.y);
    this.infoDock.setDisplaySize(profile.infoDockSize.w, profile.infoDockSize.h);
    this.infoDockEdge.setPosition(profile.infoDockPos.x, profile.infoDockPos.y);
    this.infoDockEdge.setDisplaySize(profile.infoEdgeSize.w, profile.infoEdgeSize.h);
    this.infoLink.setPosition(profile.infoDockPos.x, profile.infoDockPos.y + profile.infoDockSize.h * 0.42);
    this.infoLink.setDisplaySize(profile.infoLinkSize.w, profile.infoLinkSize.h);
    this.infoDock.setAlpha(profile.showInfoDock ? 0.78 : 0);
    this.infoDockEdge.setAlpha(profile.showInfoDock ? 0.56 : 0);
    this.infoLink.setAlpha(profile.showInfoDock ? 0.42 : 0);

    this.utilityDock.setPosition(profile.utilityDockPos.x, profile.utilityDockPos.y);
    this.utilityDock.setDisplaySize(profile.utilityDockSize.w, profile.utilityDockSize.h);
    this.utilityDockEdge.setPosition(profile.utilityDockPos.x, profile.utilityDockPos.y);
    this.utilityDockEdge.setDisplaySize(profile.utilityEdgeSize.w, profile.utilityEdgeSize.h);
    this.utilityDock.setAlpha(profile.showUtilityDock ? 0.62 : 0);
    this.utilityDockEdge.setAlpha(profile.showUtilityDock ? 0.46 : 0);

    this.playerPanel.setPosition(profile.playerPanelPos.x, profile.playerPanelPos.y);
    this.enemyPanel.setPosition(profile.enemyPanelPos.x, profile.enemyPanelPos.y);
    this.playerPanel.setScale(profile.playerPanelScale);
    this.enemyPanel.setScale(profile.enemyPanelScale);

    this.drawBtn.setPosition(profile.drawPos.x, profile.drawPos.y);
    this.endTurnBtn.setPosition(profile.endTurnPos.x, profile.endTurnPos.y);
    this.fullscreenBtn.setPosition(profile.fullscreenPos.x, profile.fullscreenPos.y);
    this.drawBtn.setScale(profile.drawScale);
    this.endTurnBtn.setScale(profile.endTurnScale);
    this.fullscreenBtn.setScale(profile.fullscreenScale);

    this.turnInfo.setPosition(profile.turnInfo.x, profile.turnInfo.y);
    this.turnInfo.setFontSize(profile.turnInfo.size);
    this.themeInfo.setPosition(profile.themeInfo.x, profile.themeInfo.y);
    this.themeInfo.setFontSize(profile.themeInfo.size);
    this.themeReminder.setPosition(profile.themeReminder.x, profile.themeReminder.y);
    this.themeReminder.setFontSize(profile.themeReminder.size);
    this.themeReminder.setWordWrapWidth(profile.themeReminder.width);
    this.themeReminder.setVisible(profile.themeReminder.visible !== false);
    this.modeInfo.setPosition(w * 0.5, h - (profile.mode === "phone" ? 124 : 200));
    this.modeInfo.setFontSize(profile.mode === "phone" ? "15px" : "20px");
    this.buildMarker.setPosition(profile.mode === "phone" ? 10 : 18, h - (profile.mode === "phone" ? 8 : 18));
    this.buildMarker.setFontSize(profile.mode === "phone" ? "10px" : "12px");
    this.turnBanner.setPosition(w * 0.5, h * 0.5);
    this.quizOverlay.layout(w, h);
    this.winnerOverlay.layout(w, h);
    this.handRevealShade.setPosition(w * 0.5, h * 0.5).setSize(w, h);
    this.handRevealPanel.setPosition(w * 0.5, h * 0.46).setDisplaySize(Math.min(860, w * 0.72), Math.min(420, h * 0.5));
    this.handRevealEdge.setPosition(w * 0.5, h * 0.46).setDisplaySize(Math.min(872, w * 0.73), Math.min(432, h * 0.52));
    this.handRevealTitle.setPosition(w * 0.5, h * 0.22);
    this.handRevealHint.setPosition(w * 0.5, h * 0.7);
    this.updateFullscreenButton();
  }

  updateFullscreenButton() {
    const supported = Boolean(
      window.ACGCore?.constants?.isFullscreenSupported?.() ||
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled
    );
    const active = Boolean(
      window.ACGCore?.constants?.getFullscreenElement?.() ||
      document.fullscreenElement ||
      document.webkitFullscreenElement
    );
    this.fullscreenBtn.setLabel(active ? "EXIT" : "FULL");
    this.fullscreenBtn.setEnabled(supported);
  }

  clearHandRevealCards() {
    this.handRevealViews.forEach((view) => view.destroy());
    this.handRevealViews = [];
  }

  showHandReveal(detail = {}) {
    this.hideHandReveal(true);
    const cards = detail.cards || [];
    const w = this.scale.width;
    const h = this.scale.height;
    const panelW = Math.min(860, w * 0.72);
    const title = detail.title || "Revealed hand";

    this.handRevealShade.setVisible(true).setAlpha(0.48);
    this.handRevealPanel.setVisible(true).setAlpha(0.88);
    this.handRevealEdge.setVisible(true).setAlpha(0.92);
    this.handRevealTitle.setText(title).setVisible(true).setAlpha(1);
    this.handRevealHint.setText(cards.length ? "Tap anywhere to close" : "Tap anywhere to continue").setVisible(true).setAlpha(0.92);

    if (!cards.length) {
      this.handRevealTitle.setText(`${title}\nNo hand`);
      this.handRevealTimer = this.time.delayedCall(2200, () => this.hideHandReveal());
      return;
    }

    const spread = Math.min(154, panelW / Math.max(cards.length, 4));
    const startX = w * 0.5 - ((cards.length - 1) * spread) / 2;
    cards.forEach((card, index) => {
      const view = new CardView(this, card, {
        interactive: false,
        disableHover: true,
        disableInspect: true,
      });
      view.setLayout("default");
      view.updateData(card);
      view.setPosition(startX + index * spread, h * 0.49);
      view.setScale(Math.min(1.24, cards.length > 4 ? 1.08 : 1.2));
      view.setAngle((index - (cards.length - 1) / 2) * 3.4);
      view.setDepth(1184 + index);
      this.handRevealViews.push(view);
    });

    this.handRevealTimer = this.time.delayedCall(3200, () => this.hideHandReveal());
  }

  hideHandReveal(immediate = false) {
    if (this.handRevealTimer) {
      this.handRevealTimer.remove(false);
      this.handRevealTimer = null;
    }
    this.handRevealShade.setVisible(false).setAlpha(0);
    this.handRevealPanel.setVisible(false).setAlpha(0);
    this.handRevealEdge.setVisible(false).setAlpha(0);
    this.handRevealTitle.setVisible(false).setAlpha(0);
    this.handRevealHint.setVisible(false).setAlpha(0);
    this.clearHandRevealCards();
  }

  renderState() {
    if (!this.current) return;
    const previous = this.previous;

    this.playerPanel.update(this.current.player, this.current.knowledgeToWin, this.current.currentPlayer === "player");
    this.enemyPanel.update(this.current.ai, this.current.knowledgeToWin, this.current.currentPlayer === "ai");

    const selected = this.current.player.board.find((card) => card.uid === this.current.selectedAttackerUid);
    const canSelectedAttackWriterDirectly = selected
      ? Boolean(window.ACGCore?.constants?.canAttackWriterDirectly?.("player", selected.uid))
      : false;
    this.canDirectAttack = Boolean(
      !this.current.winner &&
        !this.current.pendingQuiz &&
        !this.current.pendingHandDiscard &&
        !this.current.pendingTarget &&
        this.current.currentPlayer === "player" &&
        selected &&
        !selected.exhausted &&
        canSelectedAttackWriterDirectly
    );
    this.enemyPanel.setTargetable(this.canDirectAttack);
    this.enemyPanelDock.input.enabled = this.canDirectAttack;

    const phoneLayout = this.scale.width < 900 || this.scale.height < 540;
    if (phoneLayout) {
      this.turnInfo.setText(`T${this.current.turn}  ${this.current.currentPlayer === "player" ? "YOU" : "AI"}`);
      this.themeInfo.setText(this.current.themeLabel || "Theme");
      this.themeReminder.setText("");
    } else {
      this.turnInfo.setText(`${this.current.currentPlayer === "player" ? "YOUR TURN" : "ENEMY TURN"}  -  TURN ${this.current.turn}`);
      this.themeInfo.setText(this.current.themeLabel || "Theme");
      this.themeReminder.setText(
        `${this.current.themeDescription || ""}  ${this.current.themeRewardText || ""}`.trim()
      );
    }

    const disableActions = Boolean(
      this.current.winner ||
      this.current.pendingQuiz ||
      this.current.pendingTarget ||
      this.current.pendingHandDiscard ||
      this.current.currentPlayer !== "player"
    );
    this.drawBtn.setEnabled(!disableActions && !this.current.player.hasDrawnThisTurn);
    this.endTurnBtn.setEnabled(!disableActions);
    this.updateFullscreenButton();

    if (this.current.pendingHandDiscard) {
      this.modeInfo.setText(
        `Discard down to ${this.current.pendingHandDiscard.handLimit} cards\n${this.current.pendingHandDiscard.prompt}`
      );
      this.modeInfo.setAlpha(1);
    } else {
      this.modeInfo.setText("");
      this.modeInfo.setAlpha(0);
    }

    if (previous) {
      if (previous.player.inspiration !== this.current.player.inspiration || previous.player.reputation !== this.current.player.reputation) {
        this.playerPanel.flashPrimary(this.current.player.inspiration >= previous.player.inspiration ? "#f5e4b4" : "#f0b3b3");
      }
      if (previous.ai.inspiration !== this.current.ai.inspiration || previous.ai.reputation !== this.current.ai.reputation) {
        this.enemyPanel.flashPrimary(this.current.ai.inspiration >= previous.ai.inspiration ? "#f5e4b4" : "#f0b3b3");
      }
      if (previous.player.knowledge !== this.current.player.knowledge) {
        this.playerPanel.flashSecondary(this.current.player.knowledge >= previous.player.knowledge ? "#aee3bc" : "#f0b3b3");
      }
      if (previous.ai.knowledge !== this.current.ai.knowledge) {
        this.enemyPanel.flashSecondary(this.current.ai.knowledge >= previous.ai.knowledge ? "#aee3bc" : "#f0b3b3");
      }
    }

    if (this.current.winner && this.current.winner !== this.lastWinner) {
      const label = this.current.winner === "player" ? "VICTORY" : "DEFEAT";
      this.turnBanner.show(label);
    }
    this.lastWinner = this.current.winner;
  }
}
