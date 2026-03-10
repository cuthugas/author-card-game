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

  layout(w, h) {
    const compact = w < 1180;
    const enemyPanelPos = { x: w * 0.5, y: compact ? 66 : 60 };
    const playerPanelPos = { x: w * 0.2, y: compact ? h - 188 : h - 178 };
    const drawPos = { x: w - (compact ? 146 : 162), y: h - (compact ? 162 : 156) };
    const endTurnPos = { x: w - (compact ? 146 : 162), y: h - (compact ? 88 : 84) };

    this.playerPanelDock.setPosition(playerPanelPos.x, playerPanelPos.y);
    this.playerPanelDock.setDisplaySize(compact ? 390 : 416, compact ? 134 : 140);
    this.enemyPanelDock.setPosition(enemyPanelPos.x, enemyPanelPos.y);
    this.enemyPanelDock.setDisplaySize(compact ? 600 : 660, compact ? 122 : 126);

    this.actionDock.setPosition(w - (compact ? 146 : 162), h - (compact ? 122 : 118));
    this.actionDock.setDisplaySize(compact ? 164 : 178, compact ? 188 : 196);
    this.actionDockEdge.setPosition(this.actionDock.x, this.actionDock.y);
    this.actionDockEdge.setDisplaySize(compact ? 172 : 186, compact ? 196 : 206);
    this.actionLink.setPosition(this.actionDock.x - (compact ? 88 : 94), this.actionDock.y);
    this.actionLink.setDisplaySize(compact ? 156 : 168, 30);

    this.playerPanel.setPosition(playerPanelPos.x, playerPanelPos.y);
    this.enemyPanel.setPosition(enemyPanelPos.x, enemyPanelPos.y);
    this.playerPanel.setScale(compact ? 0.92 : 0.96);
    this.enemyPanel.setScale(compact ? 0.96 : 1);

    this.drawBtn.setPosition(drawPos.x, drawPos.y);
    this.endTurnBtn.setPosition(endTurnPos.x, endTurnPos.y);
    this.drawBtn.setScale(compact ? 1.18 : 1.1);
    this.endTurnBtn.setScale(compact ? 1.28 : 1.18);

    this.turnInfo.setPosition(46, compact ? 90 : 94);
    this.turnInfo.setFontSize(compact ? "22px" : "24px");
    this.themeInfo.setPosition(46, compact ? 120 : 124);
    this.themeInfo.setFontSize(compact ? "18px" : "19px");
    this.themeReminder.setPosition(46, compact ? 148 : 152);
    this.themeReminder.setFontSize(compact ? "14px" : "15px");
    this.themeReminder.setWordWrapWidth(compact ? 400 : 470);
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

    this.turnInfo.setText(`Turn ${this.current.turn}  -  ${this.current.currentPlayer === "player" ? "Your Main Phase" : "Enemy Action"}`);
    this.themeInfo.setText(this.current.themeLabel || "Theme");
    this.themeReminder.setText(
      `${this.current.themeDescription || ""} ${this.current.themeRewardText || ""}`.trim()
    );

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
