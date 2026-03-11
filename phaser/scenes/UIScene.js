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

    this.drawBtn = new ButtonView(this, w - 208, h - 118, "DRAW", () => this.adapter.actions.draw?.());
    this.endTurnBtn = new ButtonView(this, w - 208, h - 52, "END TURN", () => this.adapter.actions.endTurn?.());
    this.drawBtn.setDepth(1130);
    this.endTurnBtn.setDepth(1130);
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

    this.turnInfo.setDepth(1150);
    this.themeInfo.setDepth(1150);
    this.themeReminder.setDepth(1150);
    this.playerPanelDock.setDepth(1080);
    this.enemyPanelDock.setDepth(1080);
    this.actionDock.setDepth(1080);
    this.actionDockEdge.setDepth(1081);
    this.actionLink.setDepth(1082);

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

    this.scale.on("resize", (size) => this.layout(size.width, size.height));
    this.layout(w, h);
  }

  getLayoutProfile(w, h) {
    if (w < 900 || h < 540) {
      return {
        mode: "phone",
        enemyPanelPos: { x: w * 0.52, y: 32 },
        playerPanelPos: { x: 98, y: h - 28 },
        actionPos: { x: w - 58, y: h - 52 },
        drawPos: { x: w - 58, y: h - 84 },
        endTurnPos: { x: w - 58, y: h - 34 },
        playerDockSize: { w: 286, h: 84 },
        enemyDockSize: { w: 286, h: 84 },
        actionDockSize: { w: 0, h: 0 },
        actionEdgeSize: { w: 0, h: 0 },
        actionLinkSize: { w: 0, h: 0 },
        actionLinkOffset: 0,
        playerPanelScale: 0.92,
        enemyPanelScale: 0.92,
        drawScale: 1,
        endTurnScale: 1,
        panelLayout: "phone",
        buttonLayout: "phone",
        drawLabel: "DRAW",
        endTurnLabel: "END",
        showActionDock: false,
        turnInfo: { x: 14, y: 18, size: "12px" },
        themeInfo: { x: 14, y: 34, size: "11px" },
        themeReminder: { x: 14, y: 48, size: "10px", width: Math.max(150, w * 0.26), visible: false },
      };
    }

    if (w < 1180) {
      return {
        mode: "compact",
        enemyPanelPos: { x: w * 0.5, y: 66 },
        playerPanelPos: { x: w * 0.2, y: h - 188 },
        actionPos: { x: w - 146, y: h - 122 },
        drawPos: { x: w - 146, y: h - 162 },
        endTurnPos: { x: w - 146, y: h - 88 },
        playerDockSize: { w: 390, h: 134 },
        enemyDockSize: { w: 600, h: 122 },
        actionDockSize: { w: 164, h: 188 },
        actionEdgeSize: { w: 172, h: 196 },
        actionLinkSize: { w: 156, h: 30 },
        actionLinkOffset: 88,
        playerPanelScale: 0.92,
        enemyPanelScale: 0.96,
        drawScale: 1.18,
        endTurnScale: 1.28,
        panelLayout: "default",
        buttonLayout: "default",
        drawLabel: "DRAW",
        endTurnLabel: "END TURN",
        showActionDock: true,
        turnInfo: { x: 46, y: 90, size: "22px" },
        themeInfo: { x: 46, y: 120, size: "18px" },
        themeReminder: { x: 46, y: 148, size: "14px", width: 400 },
      };
    }

    return {
      mode: "desktop",
      enemyPanelPos: { x: w * 0.5, y: 60 },
      playerPanelPos: { x: w * 0.2, y: h - 178 },
      actionPos: { x: w - 162, y: h - 118 },
      drawPos: { x: w - 162, y: h - 156 },
      endTurnPos: { x: w - 162, y: h - 84 },
      playerDockSize: { w: 416, h: 140 },
      enemyDockSize: { w: 660, h: 126 },
      actionDockSize: { w: 178, h: 196 },
      actionEdgeSize: { w: 186, h: 206 },
      actionLinkSize: { w: 168, h: 30 },
      actionLinkOffset: 94,
      playerPanelScale: 0.96,
      enemyPanelScale: 1,
      drawScale: 1.1,
      endTurnScale: 1.18,
      panelLayout: "default",
      buttonLayout: "default",
      drawLabel: "DRAW",
      endTurnLabel: "END TURN",
      showActionDock: true,
      turnInfo: { x: 46, y: 94, size: "24px" },
      themeInfo: { x: 46, y: 124, size: "19px" },
      themeReminder: { x: 46, y: 152, size: "15px", width: 470 },
    };
  }

  layout(w, h) {
    const profile = this.getLayoutProfile(w, h);

    this.playerPanel.setLayout(profile.panelLayout);
    this.enemyPanel.setLayout(profile.panelLayout);
    this.drawBtn.setLayout(profile.buttonLayout);
    this.endTurnBtn.setLayout(profile.buttonLayout);
    this.drawBtn.setLabel(profile.drawLabel);
    this.endTurnBtn.setLabel(profile.endTurnLabel);

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

    this.playerPanel.setPosition(profile.playerPanelPos.x, profile.playerPanelPos.y);
    this.enemyPanel.setPosition(profile.enemyPanelPos.x, profile.enemyPanelPos.y);
    this.playerPanel.setScale(profile.playerPanelScale);
    this.enemyPanel.setScale(profile.enemyPanelScale);

    this.drawBtn.setPosition(profile.drawPos.x, profile.drawPos.y);
    this.endTurnBtn.setPosition(profile.endTurnPos.x, profile.endTurnPos.y);
    this.drawBtn.setScale(profile.drawScale);
    this.endTurnBtn.setScale(profile.endTurnScale);

    this.turnInfo.setPosition(profile.turnInfo.x, profile.turnInfo.y);
    this.turnInfo.setFontSize(profile.turnInfo.size);
    this.themeInfo.setPosition(profile.themeInfo.x, profile.themeInfo.y);
    this.themeInfo.setFontSize(profile.themeInfo.size);
    this.themeReminder.setPosition(profile.themeReminder.x, profile.themeReminder.y);
    this.themeReminder.setFontSize(profile.themeReminder.size);
    this.themeReminder.setWordWrapWidth(profile.themeReminder.width);
    this.themeReminder.setVisible(profile.themeReminder.visible !== false);
    this.turnBanner.setPosition(w * 0.5, h * 0.5);
    this.quizOverlay.layout(w, h);
    this.winnerOverlay.layout(w, h);
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
      this.turnInfo.setText(`Turn ${this.current.turn}  -  ${this.current.currentPlayer === "player" ? "Your Main Phase" : "Enemy Action"}`);
      this.themeInfo.setText(this.current.themeLabel || "Theme");
      this.themeReminder.setText(
        `${this.current.themeDescription || ""} ${this.current.themeRewardText || ""}`.trim()
      );
    }

    const disableActions = Boolean(this.current.winner || this.current.pendingQuiz || this.current.currentPlayer !== "player");
    this.drawBtn.setEnabled(!disableActions && !this.current.player.hasDrawnThisTurn);
    this.endTurnBtn.setEnabled(!disableActions);

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
