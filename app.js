const MAX_INSPIRATION = 5;
const STARTING_REPUTATION = 15;
const STARTING_HAND = 5;

const refs = {
  aiRep: document.getElementById("ai-rep"),
  aiInsp: document.getElementById("ai-insp"),
  aiDeck: document.getElementById("ai-deck"),
  aiHand: document.getElementById("ai-hand"),
  playerRep: document.getElementById("player-rep"),
  playerInsp: document.getElementById("player-insp"),
  playerDeck: document.getElementById("player-deck"),
  playerHand: document.getElementById("player-hand"),
  aiBoard: document.getElementById("ai-board"),
  playerBoard: document.getElementById("player-board"),
  playerHandCards: document.getElementById("player-hand-cards"),
  turnLabel: document.getElementById("turn-label"),
  phaseLabel: document.getElementById("phase-label"),
  drawBtn: document.getElementById("draw-btn"),
  endTurnBtn: document.getElementById("end-turn-btn"),
  log: document.getElementById("log"),
  newGameBtn: document.getElementById("new-game-btn"),
  playAgainBtn: document.getElementById("play-again-btn"),
  winnerBanner: document.getElementById("winner-banner"),
  winnerText: document.getElementById("winner-text"),
  fxLayer: document.getElementById("fx-layer"),
  aiPanel: document.getElementById("ai-panel"),
  playerPanel: document.getElementById("player-panel"),
  cardTemplate: document.getElementById("card-template"),
};

const cardPool = [
  { key: "hamlet", name: "Hamlet", type: "character", author: "Shakespeare", cost: 2, attack: 3, defense: 2, memorability: 3, text: "Balanced duelist." },
  { key: "macbeth", name: "Macbeth", type: "character", author: "Shakespeare", cost: 3, attack: 5, defense: 1, memorability: 3, text: "High risk attacker." },
  { key: "lady_macbeth", name: "Lady Macbeth", type: "character", author: "Shakespeare", cost: 3, attack: 3, defense: 3, memorability: 3, text: "Solid control body." },
  { key: "prospero", name: "Prospero", type: "character", author: "Shakespeare", cost: 4, attack: 4, defense: 4, memorability: 3, text: "Durable late-game card." },
  { key: "alice", name: "Alice", type: "character", author: "Lewis Carroll", cost: 2, attack: 2, defense: 2, memorability: 4, text: "Sticky battlefield presence." },
  { key: "cheshire_cat", name: "Cheshire Cat", type: "character", author: "Lewis Carroll", cost: 2, attack: 2, defense: 2, memorability: 3, text: "Hard to remove efficiently." },
  { key: "queen_of_hearts", name: "Queen of Hearts", type: "character", author: "Lewis Carroll", cost: 3, attack: 4, defense: 2, memorability: 2, text: "Pressure card." },
  { key: "jabberwock", name: "Jabberwock", type: "character", author: "Lewis Carroll", cost: 4, attack: 4, defense: 3, memorability: 4, text: "Big finisher." },
  { key: "iambic_pentameter", name: "Iambic Pentameter", type: "plot", author: "Literary Device", cost: 2, effect: "buff_friendly_top_attack", value: { attack: 2, memorability: 1 }, text: "Best ally gains +2 ATK and +1 MEM." },
  { key: "soliloquy", name: "Soliloquy", type: "plot", author: "Literary Device", cost: 2, effect: "damage_enemy_top_attack", value: 3, text: "Deal 3 damage to strongest enemy." },
  { key: "vorpal_strike", name: "Vorpal Strike", type: "plot", author: "Wonderland", cost: 3, effect: "destroy_enemy_lowest_mem", text: "Destroy weakest enemy character." },
  { key: "o_happy_dagger", name: "O Happy Dagger", type: "artifact", author: "Shakespeare", cost: 1, effect: "damage_enemy_writer", value: 2, text: "Deal 2 to enemy Reputation." },
  { key: "yoricks_skull", name: "Yorick's Skull", type: "artifact", author: "Shakespeare", cost: 2, effect: "resurrect_character", text: "Return a character from discard to hand." },
  { key: "rabbits_watch", name: "Rabbit's Pocket Watch", type: "artifact", author: "Wonderland", cost: 2, effect: "draw_cards", value: 2, text: "Draw 2 cards." },
  { key: "revision", name: "Revision", type: "plot", author: "Writing", cost: 2, effect: "heal_self", value: 3, text: "Restore 3 Reputation." },
  { key: "deadline_surge", name: "Deadline Surge", type: "plot", author: "Writing", cost: 1, effect: "gain_inspiration", value: 2, text: "Gain +2 Inspiration this turn." },
  { key: "tea_party_chaos", name: "Tea Party Chaos", type: "plot", author: "Wonderland", cost: 3, effect: "weaken_enemy_all", value: 1, text: "All enemies lose 1 ATK (min 1)." },
  { key: "critical_essay", name: "Critical Essay", type: "plot", author: "Classroom", cost: 1, effect: "draw_cards", value: 1, text: "Draw 1 card." },
];

let uid = 1;
let state;
let prevBoardUids = { player: new Set(), ai: new Set() };

function newPlayer(name) {
  return {
    name,
    reputation: STARTING_REPUTATION,
    maxInspiration: 0,
    inspiration: 0,
    deck: createDeck(),
    hand: [],
    board: [],
    discard: [],
    hasDrawnThisTurn: false,
  };
}

function createDeck() {
  return shuffle(cardPool.map(cloneCardTemplate));
}

function cloneCardTemplate(card) {
  const cloned = { ...card, value: card.value && typeof card.value === "object" ? { ...card.value } : card.value };
  cloned.uid = `${card.key}_${uid++}`;
  if (cloned.type === "character") {
    cloned.currentMemorability = cloned.memorability;
    cloned.exhausted = false;
  }
  return cloned;
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initGame() {
  state = {
    turn: 1,
    currentPlayer: "player",
    winner: null,
    selectedAttackerUid: null,
    player: newPlayer("You"),
    ai: newPlayer("AI"),
  };

  prevBoardUids = { player: new Set(), ai: new Set() };
  refs.log.innerHTML = "";
  hideWinnerBanner();

  drawCards(state.player, STARTING_HAND);
  drawCards(state.ai, STARTING_HAND);
  beginTurn("player");
  logEvent("New match started. Classroom Mode active.");
  render();
}

function showWinnerBanner() {
  if (!state.winner) return;
  refs.winnerText.textContent = state.winner === "player" ? "Victory" : "Defeat";
  refs.winnerBanner.classList.remove("hidden");
}

function hideWinnerBanner() {
  refs.winnerBanner.classList.add("hidden");
}

function drawCards(owner, count = 1) {
  for (let i = 0; i < count; i += 1) {
    if (owner.deck.length === 0) {
      if (owner.discard.length === 0) {
        logEvent(`${owner.name} cannot draw: no cards left.`);
        return;
      }
      owner.deck = shuffle(owner.discard);
      owner.discard = [];
      logEvent(`${owner.name} reshuffles discard into deck.`);
    }
    owner.hand.push(owner.deck.pop());
  }
}

function beginTurn(side) {
  state.currentPlayer = side;
  const owner = state[side];
  owner.maxInspiration = Math.min(MAX_INSPIRATION, owner.maxInspiration + 1);
  owner.inspiration = owner.maxInspiration;
  owner.hasDrawnThisTurn = false;
  owner.board.forEach((card) => {
    card.exhausted = false;
  });
  state.selectedAttackerUid = null;

  logEvent(`${side === "player" ? "Your turn" : "AI turn"}: Inspiration refilled to ${owner.inspiration}.`);
}

function flashTarget(element) {
  if (!element) return;
  element.classList.remove("hit");
  void element.offsetWidth;
  element.classList.add("hit");
}

function spawnFloatingFx(text, targetEl, kind = "damage") {
  if (!targetEl) return;
  const rect = targetEl.getBoundingClientRect();
  const bubble = document.createElement("span");
  bubble.className = `floating-hit ${kind}`;
  bubble.textContent = text;
  bubble.style.left = `${rect.left + rect.width / 2}px`;
  bubble.style.top = `${rect.top + rect.height / 2}px`;
  refs.fxLayer.appendChild(bubble);
  setTimeout(() => bubble.remove(), 740);
}

function cardElementByUid(uidValue) {
  return document.querySelector(`[data-card-uid="${uidValue}"]`);
}

function playCard(ownerKey, handIndex) {
  if (state.winner) return;
  const owner = state[ownerKey];
  const card = owner.hand[handIndex];
  if (!card || card.cost > owner.inspiration) return;

  owner.inspiration -= card.cost;
  owner.hand.splice(handIndex, 1);

  if (card.type === "character") {
    owner.board.push(card);
    logEvent(`${owner.name} summons ${card.name}.`);
  } else {
    resolveEffect(ownerKey, card);
    owner.discard.push(card);
    logEvent(`${owner.name} plays ${card.name}.`);
  }

  cleanupDefeated();
  checkWinner();
  render();
}

function resolveEffect(ownerKey, card) {
  const owner = state[ownerKey];
  const enemy = ownerKey === "player" ? state.ai : state.player;

  switch (card.effect) {
    case "buff_friendly_top_attack": {
      const target = pickHighestAttack(owner.board);
      if (target) {
        target.attack += card.value.attack;
        target.currentMemorability += card.value.memorability;
        flashTarget(cardElementByUid(target.uid));
        spawnFloatingFx(`+${card.value.attack}`, cardElementByUid(target.uid), "heal");
        logEvent(`${target.name} is empowered by ${card.name}.`);
      }
      break;
    }
    case "damage_enemy_top_attack": {
      const target = pickHighestAttack(enemy.board);
      if (target) {
        target.currentMemorability -= card.value;
        flashTarget(cardElementByUid(target.uid));
        spawnFloatingFx(`-${card.value}`, cardElementByUid(target.uid));
        logEvent(`${card.name} hits ${target.name} for ${card.value}.`);
      } else {
        enemy.reputation -= 2;
        const panel = ownerKey === "player" ? refs.aiPanel : refs.playerPanel;
        flashTarget(panel);
        spawnFloatingFx("-2", panel);
        logEvent(`${card.name} hits enemy Writer for 2.`);
      }
      break;
    }
    case "destroy_enemy_lowest_mem": {
      const target = pickLowestMem(enemy.board);
      if (target) {
        target.currentMemorability = 0;
        flashTarget(cardElementByUid(target.uid));
        spawnFloatingFx("KO", cardElementByUid(target.uid));
        logEvent(`${target.name} is removed by ${card.name}.`);
      }
      break;
    }
    case "damage_enemy_writer": {
      enemy.reputation -= card.value;
      const panel = ownerKey === "player" ? refs.aiPanel : refs.playerPanel;
      flashTarget(panel);
      spawnFloatingFx(`-${card.value}`, panel);
      logEvent(`${enemy.name} loses ${card.value} Reputation.`);
      break;
    }
    case "resurrect_character": {
      const i = owner.discard.findIndex((c) => c.type === "character");
      if (i >= 0) {
        const revived = owner.discard.splice(i, 1)[0];
        revived.currentMemorability = revived.memorability;
        revived.exhausted = false;
        owner.hand.push(revived);
        const panel = ownerKey === "player" ? refs.playerPanel : refs.aiPanel;
        spawnFloatingFx("Revive", panel, "heal");
        logEvent(`${owner.name} returns ${revived.name} to hand.`);
      }
      break;
    }
    case "draw_cards":
      drawCards(owner, card.value);
      spawnFloatingFx(`+${card.value} card`, ownerKey === "player" ? refs.playerPanel : refs.aiPanel, "info");
      logEvent(`${owner.name} draws ${card.value} card(s).`);
      break;
    case "heal_self": {
      owner.reputation += card.value;
      const panel = ownerKey === "player" ? refs.playerPanel : refs.aiPanel;
      flashTarget(panel);
      spawnFloatingFx(`+${card.value}`, panel, "heal");
      logEvent(`${owner.name} restores ${card.value} Reputation.`);
      break;
    }
    case "gain_inspiration": {
      owner.inspiration = Math.min(MAX_INSPIRATION, owner.inspiration + card.value);
      spawnFloatingFx(`+${card.value} Insp`, ownerKey === "player" ? refs.playerPanel : refs.aiPanel, "info");
      logEvent(`${owner.name} gains +${card.value} Inspiration.`);
      break;
    }
    case "weaken_enemy_all":
      enemy.board.forEach((c) => {
        c.attack = Math.max(1, c.attack - card.value);
      });
      logEvent(`${enemy.name}'s team loses ${card.value} ATK.`);
      break;
    default:
      break;
  }
}

function pickHighestAttack(cards) {
  return cards.length ? [...cards].sort((a, b) => b.attack - a.attack)[0] : null;
}

function pickLowestMem(cards) {
  return cards.length ? [...cards].sort((a, b) => a.currentMemorability - b.currentMemorability)[0] : null;
}

function attackUnit(attackerOwnerKey, attackerUid, defenderUid) {
  if (state.winner) return;
  const attackerOwner = state[attackerOwnerKey];
  const defenderOwner = attackerOwnerKey === "player" ? state.ai : state.player;

  const attacker = attackerOwner.board.find((c) => c.uid === attackerUid);
  const defender = defenderOwner.board.find((c) => c.uid === defenderUid);
  if (!attacker || !defender || attacker.exhausted) return;

  const attackerDamage = Math.max(1, attacker.attack - defender.defense);
  const defenderDamage = Math.max(1, defender.attack - attacker.defense);

  const attackerEl = cardElementByUid(attacker.uid);
  const defenderEl = cardElementByUid(defender.uid);
  flashTarget(attackerEl);
  flashTarget(defenderEl);
  spawnFloatingFx(`-${attackerDamage}`, defenderEl);
  spawnFloatingFx(`-${defenderDamage}`, attackerEl);

  defender.currentMemorability -= attackerDamage;
  attacker.currentMemorability -= defenderDamage;
  attacker.exhausted = true;
  state.selectedAttackerUid = null;

  logEvent(`${attacker.name} attacks ${defender.name} (${attackerDamage}/${defenderDamage} exchanged).`);

  cleanupDefeated();
  checkWinner();
  render();
}

function attackWriter(attackerOwnerKey, attackerUid) {
  if (state.winner) return;
  const attackerOwner = state[attackerOwnerKey];
  const defenderOwner = attackerOwnerKey === "player" ? state.ai : state.player;
  const attacker = attackerOwner.board.find((c) => c.uid === attackerUid);

  if (!attacker || attacker.exhausted) return;
  if (defenderOwner.board.length > 0) return;

  defenderOwner.reputation -= attacker.attack;
  attacker.exhausted = true;
  state.selectedAttackerUid = null;

  const targetPanel = attackerOwnerKey === "player" ? refs.aiPanel : refs.playerPanel;
  flashTarget(targetPanel);
  spawnFloatingFx(`-${attacker.attack}`, targetPanel);

  logEvent(`${attacker.name} attacks Writer directly for ${attacker.attack}.`);

  checkWinner();
  render();
}

function playLeaveFx(cardUid, ownerKey) {
  const cardEl = cardElementByUid(cardUid);
  if (cardEl) {
    cardEl.classList.add("leaving");
    flashTarget(cardEl);
    spawnFloatingFx("Defeated", cardEl, "info");
  } else {
    spawnFloatingFx("Defeated", ownerKey === "player" ? refs.playerPanel : refs.aiPanel, "info");
  }
}

function cleanupDefeated() {
  ["player", "ai"].forEach((key) => {
    const owner = state[key];
    const survivors = [];
    owner.board.forEach((card) => {
      if (card.currentMemorability <= 0) {
        playLeaveFx(card.uid, key);
        owner.discard.push(card);
        logEvent(`${card.name} is defeated.`);
      } else {
        survivors.push(card);
      }
    });
    owner.board = survivors;
  });
}

function checkWinner() {
  if (state.player.reputation <= 0 || state.ai.reputation <= 0) {
    state.winner = state.player.reputation <= 0 ? "ai" : "player";
    logEvent(`Match over: ${state.winner === "player" ? "You win!" : "AI wins."}`);
    showWinnerBanner();
    return true;
  }
  return false;
}

function logEvent(text) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.textContent = text;
  refs.log.prepend(entry);
}

function render() {
  const { player, ai } = state;
  refs.playerRep.textContent = player.reputation;
  refs.playerInsp.textContent = `${player.inspiration}/${player.maxInspiration}`;
  refs.playerDeck.textContent = player.deck.length;
  refs.playerHand.textContent = player.hand.length;

  refs.aiRep.textContent = ai.reputation;
  refs.aiInsp.textContent = `${ai.inspiration}/${ai.maxInspiration}`;
  refs.aiDeck.textContent = ai.deck.length;
  refs.aiHand.textContent = ai.hand.length;

  refs.turnLabel.textContent = `Turn ${state.turn}`;
  refs.phaseLabel.textContent = state.winner
    ? `Winner: ${state.winner === "player" ? "You" : "AI"}`
    : state.currentPlayer === "player"
      ? "Your Main Phase"
      : "AI Thinking...";

  refs.drawBtn.disabled = state.winner !== null || state.currentPlayer !== "player" || state.player.hasDrawnThisTurn;
  refs.endTurnBtn.disabled = state.winner !== null || state.currentPlayer !== "player";

  if (!state.winner) hideWinnerBanner();

  renderPlayerHand();
  renderBoard("ai");
  renderBoard("player");
}

function buildCardEl(card, options = {}) {
  const node = refs.cardTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.cardUid = card.uid;
  node.querySelector(".title").textContent = card.name;
  node.querySelector(".author").textContent = `${card.author} - Cost ${card.cost}`;

  if (card.type === "character") {
    node.querySelector(".body").textContent = card.text;
    node.querySelector(".meta").textContent = `ATK ${card.attack} | DEF ${card.defense} | MEM ${card.currentMemorability}`;
  } else {
    node.querySelector(".body").textContent = card.text;
    node.querySelector(".meta").textContent = card.type.toUpperCase();
  }

  if (options.disabled) node.disabled = true;
  if (options.attackable) node.classList.add("attackable");
  if (options.selectedAttacker) node.classList.add("selected-attacker");
  if (options.entering) node.classList.add("entering");
  if (card.type === "character" && card.exhausted) node.classList.add("exhausted");

  return node;
}

function renderPlayerHand() {
  refs.playerHandCards.innerHTML = "";
  state.player.hand.forEach((card, index) => {
    const disabled = state.winner !== null || state.currentPlayer !== "player" || card.cost > state.player.inspiration;
    const cardEl = buildCardEl(card, { disabled });
    cardEl.addEventListener("click", () => {
      cardEl.classList.add("leaving");
      setTimeout(() => playCard("player", index), 120);
    });
    refs.playerHandCards.appendChild(cardEl);
  });
}

function renderBoard(side) {
  const boardRef = side === "player" ? refs.playerBoard : refs.aiBoard;
  boardRef.innerHTML = "";
  const board = state[side].board;

  board.forEach((card) => {
    const entering = !prevBoardUids[side].has(card.uid);
    const isSelected = state.selectedAttackerUid === card.uid;

    const canPickAsAttacker = side === "player" && state.currentPlayer === "player" && !state.winner && !card.exhausted;
    const canPickAsDefender = side === "ai" && state.currentPlayer === "player" && !state.winner && Boolean(state.selectedAttackerUid);

    const cardEl = buildCardEl(card, {
      disabled: false,
      attackable: canPickAsDefender,
      selectedAttacker: isSelected,
      entering,
    });

    if (canPickAsAttacker) {
      cardEl.addEventListener("click", () => {
        state.selectedAttackerUid = state.selectedAttackerUid === card.uid ? null : card.uid;
        render();
      });
    }

    if (canPickAsDefender) {
      cardEl.addEventListener("click", () => {
        attackUnit("player", state.selectedAttackerUid, card.uid);
      });
    }

    if (side === "player" && state.currentPlayer === "player" && state.selectedAttackerUid === card.uid && state.ai.board.length === 0) {
      const directBtn = document.createElement("button");
      directBtn.className = "button primary";
      directBtn.textContent = "Attack AI Writer";
      directBtn.addEventListener("click", () => {
        attackWriter("player", card.uid);
      });
      boardRef.appendChild(directBtn);
    }

    boardRef.appendChild(cardEl);
  });

  prevBoardUids[side] = new Set(board.map((c) => c.uid));
}

function drawForPlayer() {
  if (state.currentPlayer !== "player" || state.player.hasDrawnThisTurn || state.winner) return;
  drawCards(state.player, 1);
  state.player.hasDrawnThisTurn = true;
  spawnFloatingFx("+1 card", refs.playerPanel, "info");
  logEvent("You draw a card.");
  render();
}

function endPlayerTurn() {
  if (state.currentPlayer !== "player" || state.winner) return;
  state.currentPlayer = "ai";
  render();
  runAiTurn();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAiTurn() {
  beginTurn("ai");
  render();
  await sleep(350);

  drawCards(state.ai, 1);
  state.ai.hasDrawnThisTurn = true;
  spawnFloatingFx("+1 card", refs.aiPanel, "info");
  logEvent("AI draws a card.");
  render();
  await sleep(350);

  let played = true;
  while (played && !state.winner) {
    played = false;
    const affordable = state.ai.hand
      .map((card, idx) => ({ card, idx }))
      .filter(({ card }) => card.cost <= state.ai.inspiration)
      .sort((a, b) => b.card.cost - a.card.cost);

    if (affordable.length > 0) {
      playCard("ai", affordable[0].idx);
      played = true;
      await sleep(420);
    }
  }

  for (const attacker of state.ai.board) {
    if (state.winner) break;
    if (attacker.exhausted) continue;

    if (state.player.board.length > 0) {
      const target = pickLowestMem(state.player.board);
      attackUnit("ai", attacker.uid, target.uid);
    } else {
      attackWriter("ai", attacker.uid);
    }
    await sleep(420);
  }

  if (state.winner) return;

  state.turn += 1;
  beginTurn("player");
  render();
}

refs.drawBtn.addEventListener("click", drawForPlayer);
refs.endTurnBtn.addEventListener("click", endPlayerTurn);
refs.newGameBtn.addEventListener("click", initGame);
refs.playAgainBtn.addEventListener("click", initGame);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

initGame();
