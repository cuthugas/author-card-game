export class StateAdapter {
  constructor() {
    this.core = null;
    this.unsubscribe = null;
  }

  connect(onChange) {
    if (!window.ACGCore) {
      return false;
    }
    this.core = window.ACGCore;
    this.unsubscribe = this.core.subscribe((state) => {
      onChange(this.mapState(state));
    });
    return true;
  }

  disconnect() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  mapState(state) {
    if (!state) return null;
    const getPlayBlockReason = (ownerKey, card) => this.core?.constants?.getCardPlayBlockReason?.(ownerKey, card, state) || null;
    const rawPendingHandDiscard = state.pendingHandDiscard || null;
    const pendingHandDiscardRemaining = rawPendingHandDiscard
      ? Math.max(0, state.player.hand.length - rawPendingHandDiscard.handLimit)
      : 0;
    const pendingHandDiscard =
      rawPendingHandDiscard && state.currentPlayer === rawPendingHandDiscard.ownerKey && pendingHandDiscardRemaining > 0
        ? rawPendingHandDiscard
        : null;
    const getMappedCost = (owner, card) => {
      if (!card) return 0;
      if (card.type === "character" && card.author === owner.activeAuthor) {
        return Math.max(0, (card.cost ?? 0) - 1);
      }
      return card.cost ?? 0;
    };

    const mapCard = (ownerKey, owner) => (card) => {
      const playBlockReason = getPlayBlockReason(ownerKey, card);
      return {
        uid: card.uid,
        key: card.key,
        name: card.name,
        type: card.type,
        subtype: card.subtype || null,
        author: card.author,
        cost: card.cost,
        playCost: getMappedCost(owner, card),
        playBlockedReason: playBlockReason,
        playable: !playBlockReason,
        attack: card.attack || 0,
        defense: card.defense || 0,
        memorability: card.currentMemorability || card.memorability || 0,
        effectText: card.effectText || "",
        source: card.who || "",
        functionText: card.why || "",
        exhausted: Boolean(card.exhausted),
        rarity: card.rarity || "common",
        themes: card.themes ? [...card.themes] : [],
        matchesTheme: Boolean(card.themes?.includes(state.matchTheme?.key)),
      };
    };

    return {
      turn: state.turn,
      currentPlayer: state.currentPlayer,
      winner: state.winner,
      selectedAttackerUid: state.selectedAttackerUid,
      pendingHandDiscard: pendingHandDiscard
        ? {
            ownerKey: pendingHandDiscard.ownerKey,
            handLimit: pendingHandDiscard.handLimit,
            remainingToDiscard: pendingHandDiscardRemaining,
            prompt: pendingHandDiscardRemaining > 0
              ? `Choose ${pendingHandDiscardRemaining} more card${pendingHandDiscardRemaining === 1 ? "" : "s"} to discard.`
              : `Hand is back to ${pendingHandDiscard.handLimit} cards.`,
          }
        : null,
      pendingTarget: state.pendingTarget
        ? {
            effect: state.pendingTarget.effect,
            ownerKey: state.pendingTarget.ownerKey,
            sourceName: state.pendingTarget.sourceName,
            prompt: state.pendingTarget.prompt,
          }
        : null,
      pendingQuiz: state.pendingQuiz,
      themeKey: state.matchTheme?.key || null,
      themeLabel: state.matchTheme?.label || "Theme",
      themeDescription: state.matchTheme?.description || "",
      themeRewardText: "Theme match: +1 Inspiration and +1 Knowledge",
      knowledgeToWin: state.settings?.knowledgeToWin || 10,
      player: {
        side: "player",
        name: state.player.name,
        author: state.player.activeAuthor,
        reputation: state.player.reputation,
        inspiration: state.player.inspiration,
        maxInspiration: state.player.maxInspiration,
        knowledge: state.player.knowledge,
        deckCount: state.player.deck.length,
        handCount: state.player.hand.length,
        hasDrawnThisTurn: Boolean(state.player.hasDrawnThisTurn),
        hand: state.player.hand.map(mapCard("player", state.player)),
        board: state.player.board.map(mapCard("player", state.player)),
      },
      ai: {
        side: "ai",
        name: state.ai.name,
        author: state.ai.activeAuthor,
        reputation: state.ai.reputation,
        inspiration: state.ai.inspiration,
        maxInspiration: state.ai.maxInspiration,
        knowledge: state.ai.knowledge,
        deckCount: state.ai.deck.length,
        handCount: state.ai.hand.length,
        hand: state.ai.hand.map(mapCard("ai", state.ai)),
        board: state.ai.board.map(mapCard("ai", state.ai)),
      },
    };
  }

  get actions() {
    return this.core?.actions || {};
  }
}
