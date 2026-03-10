export class HandFan {
  constructor(scene, rootContainer) {
    this.scene = scene;
    this.root = rootContainer;
    this.cards = [];
  }

  clear() {
    this.cards.forEach((c) => c.destroy());
    this.cards = [];
  }

  computeTargets(count, layout = {}) {
    if (!count) return [];
    const width = layout.width ?? this.scene.scale.width;
    const height = layout.height ?? this.scene.scale.height;
    const centerX = width * 0.5;
    const baseY = layout.baseY ?? height - 104;
    const sidePadding = layout.sidePadding ?? Math.max(68, width * 0.14);
    const usableWidth = Math.max(180, width - sidePadding * 2);
    const maxSpread = count > 1 ? usableWidth / (count - 1) : usableWidth;
    const spread = Phaser.Math.Clamp(maxSpread, layout.minSpread ?? 42, layout.maxSpread ?? 126);
    const startX = centerX - ((count - 1) * spread) / 2;
    const maxAngle = layout.maxAngle ?? 18;
    const angleStep = layout.angleStep ?? 5.2;
    const liftStep = layout.liftStep ?? 3.1;
    const edgeScaleBoost = layout.edgeScaleBoost ?? 0.08;
    const centerScaleBase = layout.centerScaleBase ?? 0.88;

    return Array.from({ length: count }).map((_, i) => {
      const offset = i - (count - 1) / 2;
      const centerWeight = 1 - Math.min(1, Math.abs(offset) / Math.max(1, count * 0.45));
      const centerBoost = centerScaleBase + centerWeight * edgeScaleBoost;
      return {
        x: startX + i * spread,
        y: baseY + Math.abs(offset) * liftStep,
        angle: Phaser.Math.Clamp(offset * angleStep, -maxAngle, maxAngle),
        scale: centerBoost,
        depth: 140 + i,
      };
    });
  }

  layout(cardViews) {
    this.clear();
    this.cards = cardViews;
    const count = cardViews.length;
    if (!count) return;

    const targets = this.computeTargets(count);

    cardViews.forEach((card, i) => {
      const target = targets[i];
      card.setPosition(target.x, target.y);
      card.setScale(target.scale);
      card.setAngle(target.angle);
      card.setHomeTransform();
      card.setDepth(target.depth);
      this.root.add(card);
      this.scene.tweens.add({
        targets: card,
        y: card.y - 10,
        alpha: { from: 0, to: 1 },
        duration: 180,
        ease: "Quad.Out",
      });
    });
  }
}
