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

  computeTargets(count) {
    if (!count) return [];
    const centerX = this.scene.scale.width * 0.5;
    const baseY = this.scene.scale.height - 104;
    const spread = Math.min(126, 700 / Math.max(count, 1));
    const startX = centerX - ((count - 1) * spread) / 2;

    return Array.from({ length: count }).map((_, i) => {
      const offset = i - (count - 1) / 2;
      const centerWeight = 1 - Math.min(1, Math.abs(offset) / Math.max(1, count * 0.45));
      const centerBoost = 0.88 + centerWeight * 0.08;
      return {
        x: startX + i * spread,
        y: baseY + Math.abs(offset) * 3.1,
        angle: Phaser.Math.Clamp(offset * 5.2, -18, 18),
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
