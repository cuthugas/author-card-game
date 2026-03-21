import { PanelView } from "../views/PanelView.js";
import { ButtonView } from "../views/ButtonView.js";
import { TurnBanner } from "../views/TurnBanner.js";
import { StateAdapter } from "../core/stateAdapter.js";
import { QuizOverlay } from "../views/QuizOverlay.js";
import { WinnerOverlay } from "../views/WinnerOverlay.js";

export class UIScene extends Phaser.Scene {
  constructor() {
    super("ui");
    this.adapter = new StateAdapter();
    this.current = null;
    this.previous = null;
    this.lastWinner = null;
    this.canDirectAttack = false;
    this.fullscreenChangeHandler = null;
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
    this.buildMarker = this.add
      .text(18, h - 18, "BUILD d924f2c", {
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

    this.scale.on("resize", (size) => this.layout(size.width, size.height));
    this.layout(w, h);
  }

  shutdown() {
    if (this.fullscreenChangeHandler) {
      document.removeEventListener("fullscreenchange", this.fullscreenChangeHandler);
      document.removeEventListener("webkitfullscreenchange", this.fullscreenChangeHandler);
      this.fullscreenChangeHandler = null;
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
        playerPanelScale: 0.98,
        enemyPanelScale: 0.98,
        playerPanelLayout: "phone-player",
        enemyPanelLayout: "phone",
        drawScale: 1,
        endTurnScale: 1,
        fullscreenScale: 1,
        buttonLayout: "phone",
        fullscreenLabel: "FULL",
        drawLabel: "DRAW",
        endTurnLabel: "END",
        showActionDock: false,
        showInfoDock: false,
        showUtilityDock: false,
        turnInfo: { x: 14, y: 18, size: "12px" },
        themeInfo: { x: 14, y: 34, size: "11px" },
        themeReminder: { x: 14, y: 48, size: "10px", width: Math.max(150, w * 0.26), visible: false },
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
        playerDockSize: { w: 338, h: 108 },
        enemyDockSize: { w: 338, h: 108 },
        actionDockSize: { w: 150, h: 164 },
        actionEdgeSize: { w: 158, h: 172 },
        actionLinkSize: { w: 116, h: 24 },
        actionLinkOffset: 78,
        infoDockPos: { x: w * 0.5, y: 82 },
        infoDockSize: { w: Math.min(420, w * 0.4), h: 88 },
        infoEdgeSize: { w: Math.min(428, w * 0.41), h: 96 },
        infoLinkSize: { w: 124, h: 22 },
        utilityDockPos: { x: w - 86, y: 58 },
        utilityDockSize: { w: 106, h: 52 },
        utilityEdgeSize: { w: 112, h: 58 },
        playerPanelScale: 1,
        enemyPanelScale: 1,
        playerPanelLayout: "desktop",
        enemyPanelLayout: "desktop",
        drawScale: 1.12,
        endTurnScale: 1.18,
        fullscreenScale: 0.86,
        buttonLayout: "default",
        fullscreenLabel: "FULL",
        drawLabel: "DRAW",
        endTurnLabel: "END TURN",
        showActionDock: true,
        showInfoDock: true,
        showUtilityDock: true,
        turnInfo: { x: w * 0.5 - 178, y: 64, size: "18px" },
        themeInfo: { x: w * 0.5 - 178, y: 88, size: "16px" },
        themeReminder: { x: w * 0.5 - 178, y: 110, size: "13px", width: 330 },
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
        playerDockSize: { w: 368, h: 104 },
        enemyDockSize: { w: 368, h: 104 },
        actionDockSize: { w: 164, h: 176 },
        actionEdgeSize: { w: 172, h: 184 },
        actionLinkSize: { w: 132, h: 24 },
        actionLinkOffset: 88,
        infoDockPos: { x: w * 0.5, y: 86 },
        infoDockSize: { w: 500, h: 96 },
        infoEdgeSize: { w: 508, h: 104 },
        infoLinkSize: { w: 142, h: 24 },
        utilityDockPos: { x: w - 92, y: 60 },
        utilityDockSize: { w: 112, h: 54 },
        utilityEdgeSize: { w: 118, h: 60 },
        playerPanelScale: 1,
        enemyPanelScale: 1,
        playerPanelLayout: "desktop",
        enemyPanelLayout: "desktop",
        drawScale: 1.12,
        endTurnScale: 1.18,
        fullscreenScale: 0.9,
        buttonLayout: "default",
        fullscreenLabel: "FULL",
        drawLabel: "DRAW",
        endTurnLabel: "END TURN",
        showActionDock: true,
        showInfoDock: true,
        showUtilityDock: true,
        turnInfo: { x: w * 0.5 - 214, y: 64, size: "19px" },
        themeInfo: { x: w * 0.5 - 214, y: 91, size: "17px" },
        themeReminder: { x: w * 0.5 - 214, y: 116, size: "13px", width: 408 },
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
      playerDockSize: { w: 390, h: 108 },
      enemyDockSize: { w: 390, h: 108 },
      actionDockSize: { w: 172, h: 184 },
      actionEdgeSize: { w: 180, h: 194 },
      actionLinkSize: { w: 148, h: 24 },
      actionLinkOffset: 94,
      infoDockPos: { x: w * 0.5, y: 90 },
      infoDockSize: { w: 580, h: 104 },
      infoEdgeSize: { w: 588, h: 112 },
      infoLinkSize: { w: 154, h: 24 },
      utilityDockPos: { x: w - 96, y: 62 },
      utilityDockSize: { w: 116, h: 56 },
      utilityEdgeSize: { w: 124, h: 62 },
      playerPanelScale: 1.02,
      enemyPanelScale: 1.02,
      playerPanelLayout: "wide",
      enemyPanelLayout: "wide",
      drawScale: 1.14,
      endTurnScale: 1.2,
      fullscreenScale: 0.92,
      buttonLayout: "default",
      fullscreenLabel: "FULL",
      drawLabel: "DRAW",
      endTurnLabel: "END TURN",
      showActionDock: true,
      showInfoDock: true,
      showUtilityDock: true,
      turnInfo: { x: w * 0.5 - 252, y: 66, size: "20px" },
      themeInfo: { x: w * 0.5 - 252, y: 94, size: "18px" },
      themeReminder: { x: w * 0.5 - 252, y: 120, size: "14px", width: 468 },
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
    this.buildMarker.setPosition(profile.mode === "phone" ? 10 : 18, h - (profile.mode === "phone" ? 8 : 18));
    this.buildMarker.setFontSize(profile.mode === "phone" ? "10px" : "12px");
    this.turnBanner.setPosition(w * 0.5, h * 0.5);
    this.quizOverlay.layout(w, h);
    this.winnerOverlay.layout(w, h);
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

  renderState() {
    if (!this.current) return;
    const previous = this.previous;

    this.playerPanel.update(this.current.player, this.current.knowledgeToWin, this.current.currentPlayer === "player");
    this.enemyPanel.update(this.current.ai, this.current.knowledgeToWin, this.current.currentPlayer === "ai");

    const selected = this.current.player.board.find((card) => card.uid === this.current.selectedAttackerUid);
    this.canDirectAttack = Boolean(
      !this.current.winner &&
        !this.current.pendingQuiz &&
        this.current.currentPlayer === "player" &&
        selected &&
        !selected.exhausted &&
        this.current.ai.board.length === 0
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

    const disableActions = Boolean(this.current.winner || this.current.pendingQuiz || this.current.currentPlayer !== "player");
    this.drawBtn.setEnabled(!disableActions && !this.current.player.hasDrawnThisTurn);
    this.endTurnBtn.setEnabled(!disableActions);
    this.updateFullscreenButton();

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
