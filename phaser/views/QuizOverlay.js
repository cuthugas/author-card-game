export class QuizOverlay extends Phaser.GameObjects.Container {
  constructor(scene, onResolved) {
    super(scene, scene.scale.width * 0.5, scene.scale.height * 0.5);
    this.scene = scene;
    this.onResolved = onResolved;
    this.resolve = null;
    this.layoutMetrics = null;

    this.scrim = scene.add.rectangle(0, 0, scene.scale.width, scene.scale.height, 0x04070d, 0.78);
    this.panel = scene.add.image(0, 0, "panel-base").setDisplaySize(Math.min(880, scene.scale.width * 0.72), Math.min(500, scene.scale.height * 0.72));
    this.edge = scene.add.image(0, 0, "panel-edge").setDisplaySize(this.panel.displayWidth + 6, this.panel.displayHeight + 6).setAlpha(0.9);

    this.title = scene.add
      .text(-this.panel.displayWidth * 0.45, -this.panel.displayHeight * 0.4, "Quick Check", {
        fontFamily: "Cinzel",
        fontSize: "38px",
        color: "#f3e0b6",
        stroke: "#120e0b",
        strokeThickness: 5,
      })
      .setOrigin(0, 0.5);

    this.question = scene.add
      .text(-this.panel.displayWidth * 0.45, -this.panel.displayHeight * 0.24, "", {
        fontFamily: "Spectral",
        fontSize: "28px",
        color: "#eadcbf",
        wordWrap: { width: this.panel.displayWidth * 0.9 },
      })
      .setOrigin(0, 0);

    this.optionButtons = [];
    this.feedback = scene.add
      .text(0, this.panel.displayHeight * 0.36, "", {
        fontFamily: "Spectral",
        fontSize: "24px",
        color: "#cfdcf5",
      })
      .setOrigin(0.5);

    this.add([this.scrim, this.panel, this.edge, this.title, this.question, this.feedback]);
    this.setDepth(1400);
    this.setVisible(false);
    this.setAlpha(0);

    scene.add.existing(this);
    scene.scale.on("resize", (size) => this.layout(size.width, size.height));
  }

  layout(width, height) {
    this.setPosition(width * 0.5, height * 0.5);
    this.scrim.setSize(width, height);
    const compact = width < 900 || height < 600;
    const panelW = Math.min(compact ? 760 : 900, width * (compact ? 0.9 : 0.76));
    const panelH = compact ? Math.max(300, Math.min(height * 0.88, 420)) : Math.min(520, height * 0.78);
    this.layoutMetrics = {
      compact,
      optionHeight: compact ? 44 : 56,
      optionFontSize: compact ? "18px" : "23px",
      titleFontSize: compact ? "26px" : "38px",
      questionFontSize: compact ? "18px" : "28px",
      feedbackFontSize: compact ? "18px" : "24px",
      optionGap: compact ? 12 : 14,
    };
    this.panel.setDisplaySize(panelW, panelH);
    this.edge.setDisplaySize(panelW + 6, panelH + 6);
    this.title.setPosition(-panelW * 0.45, -panelH * 0.4);
    this.title.setFontSize(this.layoutMetrics.titleFontSize);
    this.question.setPosition(-panelW * 0.45, -panelH * 0.24);
    this.question.setFontSize(this.layoutMetrics.questionFontSize);
    this.question.setWordWrapWidth(panelW * 0.9);
    this.feedback.setFontSize(this.layoutMetrics.feedbackFontSize);
    this.positionOptions();
  }

  positionOptions() {
    const metrics = this.layoutMetrics || {
      compact: false,
      optionHeight: 56,
      optionGap: 14,
    };
    const count = this.optionButtons.length;
    const availableHeight = this.panel.displayHeight * (metrics.compact ? 0.34 : 0.38);
    const step = count > 1 ? Math.min(metrics.optionHeight + metrics.optionGap, availableHeight / (count - 1)) : 0;
    const baseY = this.panel.displayHeight * (metrics.compact ? -0.02 : 0.01);
    this.optionButtons.forEach((btn, index) => {
      btn.setPosition(0, baseY + index * step);
    });
    const lastY = count > 0 ? baseY + (count - 1) * step : this.panel.displayHeight * 0.12;
    this.feedback.setPosition(0, Math.min(this.panel.displayHeight * 0.39, lastY + metrics.optionHeight * 0.9));
  }

  buildOption(text, index) {
    const metrics = this.layoutMetrics || {
      optionHeight: 56,
      optionFontSize: "23px",
    };
    const btn = this.scene.add.container(0, 0);
    const bg = this.scene.add.image(0, 0, "button-base").setDisplaySize(this.panel.displayWidth * 0.82, metrics.optionHeight).setTint(0x2f2318);
    const glow = this.scene.add.image(0, 0, "button-glow").setDisplaySize(this.panel.displayWidth * 0.88, metrics.optionHeight + 12).setAlpha(0.22);
    const label = this.scene.add
      .text(0, 0, text, {
        fontFamily: "Spectral",
        fontSize: metrics.optionFontSize,
        color: "#f0e7d0",
        align: "center",
        wordWrap: { width: this.panel.displayWidth * 0.72 },
      })
      .setOrigin(0.5);

    btn.add([glow, bg, label]);
    btn.setSize(bg.displayWidth, bg.displayHeight);
    bg.setInteractive({ useHandCursor: true });
    bg.on("pointerover", () => {
      if (!bg.input?.enabled) return;
      this.scene.tweens.add({ targets: btn, scaleX: 1.02, scaleY: 1.02, duration: 110 });
      this.scene.tweens.add({ targets: glow, alpha: 0.45, duration: 110 });
    });
    bg.on("pointerout", () => {
      this.scene.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 110 });
      this.scene.tweens.add({ targets: glow, alpha: 0.22, duration: 110 });
    });
    bg.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      this.submit(index);
    });

    btn.__bg = bg;
    btn.__glow = glow;
    btn.__label = label;
    return btn;
  }

  shufflePayload(payload) {
    const options = (payload?.options || []).map((option, index) => ({
      text: option,
      isCorrect: index === payload.correctIndex,
    }));

    for (let i = options.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      ...payload,
      options: options.map((option) => option.text),
      correctIndex: options.findIndex((option) => option.isCorrect),
    };
  }

  open(payload) {
    this.clearOptions();
    this.payload = this.shufflePayload(payload);
    this.title.setText(this.payload.title || "Quick Check");
    this.question.setText(this.payload.question || "");
    this.feedback.setText("");

    this.payload.options.forEach((opt, index) => {
      const btn = this.buildOption(opt, index);
      this.optionButtons.push(btn);
      this.add(btn);
    });
    this.positionOptions();

    this.setVisible(true);
    this.setAlpha(0);
    this.scene.tweens.add({ targets: this, alpha: 1, duration: 180 });

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  submit(index) {
    if (!this.resolve || !this.payload) return;
    const isCorrect = index === this.payload.correctIndex;
    this.optionButtons.forEach((btn, i) => {
      btn.__bg.disableInteractive();
      if (i === this.payload.correctIndex) {
        btn.__bg.setTint(0x2b6b45);
        btn.__glow.setAlpha(0.55);
      } else if (i === index && !isCorrect) {
        btn.__bg.setTint(0x6c2929);
      } else {
        btn.__bg.setTint(0x2a2018);
      }
    });

    this.feedback.setText(isCorrect ? "Correct" : "Not quite");
    this.feedback.setColor(isCorrect ? "#9be5b8" : "#f0b3b3");

    const done = this.resolve;
    this.resolve = null;
    this.scene.time.delayedCall(560, () => {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 150,
        onComplete: () => {
          this.setVisible(false);
          this.clearOptions();
          done(isCorrect);
          this.onResolved?.(isCorrect);
        },
      });
    });
  }

  clearOptions() {
    this.optionButtons.forEach((btn) => btn.destroy());
    this.optionButtons = [];
  }
}
