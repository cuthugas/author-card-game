const MAX_INSPIRATION = 5;
const STARTING_REPUTATION = 15;
const STARTING_HAND = 5;
const DEFAULT_KNOWLEDGE_TO_WIN = 10;
const DEFAULT_QUICK_CHECK_EVERY_TURNS = 3;

const AUTHOR_PROFILES = {
  Shakespeare: { passive: "Tragedy-aligned characters gain +1 ATK when summoned.", bonusTag: "tragedy" },
  "Lewis Carroll": { passive: "Wonderland-aligned characters gain +1 MEM when summoned.", bonusTag: "wonderland" },
};

const MATCH_THEMES = [
  { key: "ambition", label: "Theme: Ambition", description: "Reward cards tied to ambition and power struggles." },
  { key: "identity", label: "Theme: Identity", description: "Reward cards about selfhood and transformation." },
  { key: "power", label: "Theme: Power", description: "Reward authority, leadership, and control effects." },
  { key: "curiosity", label: "Theme: Curiosity", description: "Reward exploration, wonder, and questioning." },
];

const QUICK_CHECK_BANK = [
  {
    question: "Who wrote Macbeth?",
    options: ["William Shakespeare", "Lewis Carroll", "Mary Shelley"],
    correctIndex: 0,
    explanation: "Macbeth is a tragedy by Shakespeare.",
  },
  {
    question: "Which character belongs to Lewis Carroll's Wonderland world?",
    options: ["Prospero", "Hamlet", "Cheshire Cat"],
    correctIndex: 2,
    explanation: "The Cheshire Cat is from Alice's Adventures in Wonderland.",
  },
  {
    question: "What is a soliloquy?",
    options: ["A private speech revealing thoughts", "A poem with 14 lines", "A speech by two people"],
    correctIndex: 0,
    explanation: "A soliloquy lets the audience hear a character's inner thoughts.",
  },
  {
    question: "Who wrote Alice's Adventures in Wonderland?",
    options: ["Jane Austen", "Lewis Carroll", "Charles Dickens"],
    correctIndex: 1,
    explanation: "Lewis Carroll wrote Alice's Adventures in Wonderland.",
  },
];

const refs = {
  aiRep: document.getElementById("ai-rep"),
  aiInsp: document.getElementById("ai-insp"),
  aiKnowledge: document.getElementById("ai-knowledge"),
  aiAuthor: document.getElementById("ai-author"),
  aiDeck: document.getElementById("ai-deck"),
  aiHand: document.getElementById("ai-hand"),
  playerRep: document.getElementById("player-rep"),
  playerInsp: document.getElementById("player-insp"),
  playerKnowledge: document.getElementById("player-knowledge"),
  playerAuthor: document.getElementById("player-author"),
  playerDeck: document.getElementById("player-deck"),
  playerHand: document.getElementById("player-hand"),
  aiBoard: document.getElementById("ai-board"),
  playerBoard: document.getElementById("player-board"),
  playerHandCards: document.getElementById("player-hand-cards"),
  turnLabel: document.getElementById("turn-label"),
  phaseLabel: document.getElementById("phase-label"),
  themeLabel: document.getElementById("theme-label"),
  drawBtn: document.getElementById("draw-btn"),
  endTurnBtn: document.getElementById("end-turn-btn"),
  teacherKnowledgeTarget: document.getElementById("teacher-knowledge-target"),
  teacherQuizFrequency: document.getElementById("teacher-quiz-frequency"),
  teacherApplyBtn: document.getElementById("teacher-apply-btn"),
  log: document.getElementById("log"),
  newGameBtn: document.getElementById("new-game-btn"),
  playAgainBtn: document.getElementById("play-again-btn"),
  winnerBanner: document.getElementById("winner-banner"),
  winnerText: document.getElementById("winner-text"),
  fxLayer: document.getElementById("fx-layer"),
  aiPanel: document.getElementById("ai-panel"),
  playerPanel: document.getElementById("player-panel"),
  quizModal: document.getElementById("quiz-modal"),
  quizTitle: document.getElementById("quiz-title"),
  quizQuestion: document.getElementById("quiz-question"),
  quizOptions: document.getElementById("quiz-options"),
  cardTemplate: document.getElementById("card-template"),
};

const cardPool = [
  { key: "hamlet", name: "Hamlet", type: "character", author: "Shakespeare", cost: 2, attack: 3, defense: 2, memorability: 3, themes: ["identity", "ambition", "tragedy"], who: "Prince of Denmark from Shakespeare's tragedy Hamlet.", why: "Represents indecision, revenge, and moral conflict.", effectText: "Balanced duelist." },
  { key: "macbeth", name: "Macbeth", type: "character", author: "Shakespeare", cost: 3, attack: 5, defense: 1, memorability: 3, themes: ["ambition", "power", "tragedy"], who: "Scottish nobleman from Macbeth.", why: "Shows corrupting ambition and consequences of power.", effectText: "High-risk attacker." },
  { key: "lady_macbeth", name: "Lady Macbeth", type: "character", author: "Shakespeare", cost: 3, attack: 3, defense: 3, memorability: 3, themes: ["ambition", "power", "tragedy"], who: "Macbeth's wife and key instigator.", why: "Embodies persuasion, guilt, and ambition.", effectText: "Solid control body." },
  { key: "prospero", name: "Prospero", type: "character", author: "Shakespeare", cost: 4, attack: 4, defense: 4, memorability: 3, themes: ["power", "identity", "tragedy"], who: "Exiled duke-magician from The Tempest.", why: "Explores control, forgiveness, and authority.", effectText: "Durable late-game character." },
  { key: "alice", name: "Alice", type: "character", author: "Lewis Carroll", cost: 2, attack: 2, defense: 2, memorability: 4, themes: ["curiosity", "identity", "wonderland"], who: "Young protagonist of Alice's Adventures in Wonderland.", why: "Represents growth through curiosity and questioning.", effectText: "High memorability (4) makes her harder to defeat early." },
  { key: "cheshire_cat", name: "Cheshire Cat", type: "character", author: "Lewis Carroll", cost: 2, attack: 2, defense: 2, memorability: 3, themes: ["curiosity", "identity", "wonderland"], who: "Mysterious speaking cat in Wonderland.", why: "Challenges logic and guides Alice indirectly.", effectText: "Hard to remove efficiently." },
  { key: "queen_of_hearts", name: "Queen of Hearts", type: "character", author: "Lewis Carroll", cost: 3, attack: 4, defense: 2, memorability: 2, themes: ["power", "wonderland"], who: "Impulsive monarch from Wonderland.", why: "Parodies arbitrary authority.", effectText: "Pressure card." },
  { key: "jabberwock", name: "Jabberwock", type: "character", author: "Lewis Carroll", cost: 4, attack: 4, defense: 3, memorability: 4, themes: ["curiosity", "wonderland"], who: "Nonsense-poem creature from Through the Looking-Glass.", why: "Shows imagination, language play, and mythic tone.", effectText: "Big finisher." },
  { key: "iambic_pentameter", name: "Iambic Pentameter", type: "plot", subtype: "literary_device", author: "Literary Device", cost: 2, effect: "buff_friendly_top_attack", value: { attack: 2, memorability: 1 }, themes: ["power", "identity"], who: "A poetic meter of five unstressed/stressed pairs per line.", why: "Key rhythm used in Shakespeare's dramatic verse.", effectText: "Best ally gains +2 ATK and +1 MEM.", quiz: { question: "What is iambic pentameter?", options: ["A 10-syllable line with unstressed/stressed pattern", "A 14-line sonnet form only", "A prose speech without rhythm"], correctIndex: 0, explanation: "Iambic pentameter is a 10-syllable line with five iambs." } },
  { key: "soliloquy", name: "Soliloquy", type: "plot", subtype: "literary_device", author: "Literary Device", cost: 2, effect: "damage_enemy_top_attack", value: 3, themes: ["identity", "ambition"], who: "A speech where a character reveals inner thoughts aloud.", why: "Used in drama to expose motivation and conflict.", effectText: "Deal 3 damage to strongest enemy.", quiz: { question: "What does a soliloquy reveal?", options: ["A character's inner thoughts", "A chorus response", "A stage direction"], correctIndex: 0, explanation: "A soliloquy reveals what a character is thinking privately." } },
  { key: "vorpal_strike", name: "Vorpal Strike", type: "plot", author: "Wonderland", cost: 3, effect: "destroy_enemy_lowest_mem", themes: ["curiosity", "power"], who: "Reference to the Vorpal Sword in Jabberwocky.", why: "Connects nonsense verse and heroic quest language.", effectText: "Destroy weakest enemy character." },
  { key: "o_happy_dagger", name: "O Happy Dagger", type: "artifact", author: "Shakespeare", cost: 1, effect: "damage_enemy_writer", value: 2, themes: ["tragedy", "ambition"], who: "Allusion to Juliet's final line in Romeo and Juliet.", why: "Highlights tragic climax and symbolism.", effectText: "Deal 2 to enemy Reputation." },
  { key: "yoricks_skull", name: "Yorick's Skull", type: "artifact", author: "Shakespeare", cost: 2, effect: "resurrect_character", themes: ["identity", "tragedy"], who: "Skull held by Hamlet in Act V.", why: "Symbolizes mortality and memory.", effectText: "Return a character from discard to hand." },
  { key: "rabbits_watch", name: "Rabbit's Pocket Watch", type: "artifact", author: "Wonderland", cost: 2, effect: "draw_cards", value: 2, themes: ["curiosity", "wonderland"], who: "White Rabbit's iconic watch.", why: "Introduces urgency and surreal pacing.", effectText: "Draw 2 cards." },
  { key: "revision", name: "Revision", type: "plot", author: "Writing", cost: 2, effect: "heal_self", value: 3, themes: ["identity"], who: "Reworking ideas after feedback.", why: "Shows growth and deeper understanding in writing.", effectText: "Restore 3 Reputation." },
  { key: "deadline_surge", name: "Deadline Surge", type: "plot", author: "Writing", cost: 1, effect: "gain_inspiration", value: 2, themes: ["power", "ambition"], who: "Focused push to finish written work.", why: "Represents urgency and productivity pressure.", effectText: "Gain +2 Inspiration this turn." },
  { key: "tea_party_chaos", name: "Tea Party Chaos", type: "plot", author: "Wonderland", cost: 3, effect: "weaken_enemy_all", value: 1, themes: ["curiosity", "wonderland"], who: "Mad Tea Party scene.", why: "Highlights absurd logic and social satire.", effectText: "All enemies lose 1 ATK (min 1)." },
  { key: "critical_essay", name: "Critical Essay", type: "plot", author: "Classroom", cost: 1, effect: "draw_cards", value: 1, themes: ["identity", "power"], who: "Analytical writing about literature.", why: "Builds evidence-based interpretation.", effectText: "Draw 1 card." },
];

let uid = 1;
let state;
let prevBoardUids = { player: new Set(), ai: new Set() };
let teacherSettings = {
  knowledgeToWin: DEFAULT_KNOWLEDGE_TO_WIN,
  quickCheckEveryTurns: DEFAULT_QUICK_CHECK_EVERY_TURNS,
};

function newPlayer(name, activeAuthor) {
  return { name, reputation: STARTING_REPUTATION, maxInspiration: 0, inspiration: 0, knowledge: 0, activeAuthor, deck: createDeck(), hand: [], board: [], discard: [], hasDrawnThisTurn: false };
}

function createDeck() {
  return shuffle(cardPool.map(cloneCardTemplate));
}

function cloneCardTemplate(card) {
  const cloned = { ...card, themes: card.themes ? [...card.themes] : [], quiz: card.quiz ? { ...card.quiz, options: [...card.quiz.options] } : null, value: card.value && typeof card.value === "object" ? { ...card.value } : card.value };
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

function randomTheme() {
  return MATCH_THEMES[Math.floor(Math.random() * MATCH_THEMES.length)];
}

function panelForOwner(ownerKey) {
  return ownerKey === "player" ? refs.playerPanel : refs.aiPanel;
}

function getCardCost(owner, card) {
  if (card.type === "character" && card.author === owner.activeAuthor) return Math.max(0, card.cost - 1);
  return card.cost;
}

function addKnowledge(ownerKey, amount, reason) {
  const owner = state[ownerKey];
  owner.knowledge += amount;
  spawnFloatingFx(`+${amount} Knowledge`, panelForOwner(ownerKey), "heal");
  logEvent(`${owner.name} gains ${amount} Knowledge (${reason}).`);
}

function showWinnerBanner() {
  if (!state.winner) return;
  refs.winnerText.textContent = state.winner === "player" ? "Victory" : "Defeat";
  refs.winnerBanner.classList.remove("hidden");
}

function hideWinnerBanner() {
  refs.winnerBanner.classList.add("hidden");
}

function hideQuizModal() {
  refs.quizModal.classList.add("hidden");
  refs.quizQuestion.textContent = "";
  refs.quizOptions.innerHTML = "";
}

function syncTeacherControlsFromState() {
  if (!state) return;
  refs.teacherKnowledgeTarget.value = state.settings.knowledgeToWin;
  refs.teacherQuizFrequency.value = state.settings.quickCheckEveryTurns;
}

function applyTeacherSettings() {
  const knowledgeToWin = Math.max(3, Math.min(20, Number.parseInt(refs.teacherKnowledgeTarget.value, 10) || DEFAULT_KNOWLEDGE_TO_WIN));
  const quickCheckEveryTurns = Math.max(2, Math.min(6, Number.parseInt(refs.teacherQuizFrequency.value, 10) || DEFAULT_QUICK_CHECK_EVERY_TURNS));
  teacherSettings = { knowledgeToWin, quickCheckEveryTurns };
  if (state) {
    state.settings = { ...teacherSettings };
    syncTeacherControlsFromState();
    logEvent(`Teacher Mode updated: Knowledge win ${knowledgeToWin}, quick check every ${quickCheckEveryTurns} turns.`);
    render();
  }
}

function initGame() {
  state = {
    turn: 1,
    currentPlayer: "player",
    winner: null,
    selectedAttackerUid: null,
    pendingQuiz: false,
    settings: { ...teacherSettings },
    matchTheme: randomTheme(),
    player: newPlayer("You", "Shakespeare"),
    ai: newPlayer("AI", "Lewis Carroll"),
  };
  prevBoardUids = { player: new Set(), ai: new Set() };
  refs.log.innerHTML = "";
  hideWinnerBanner();
  hideQuizModal();
  drawCards(state.player, STARTING_HAND);
  drawCards(state.ai, STARTING_HAND);
  beginTurn("player");
  logEvent("New match started. Classroom Mode active.");
  logEvent(`Theme objective: ${state.matchTheme.label}. ${state.matchTheme.description}`);
  logEvent(`Your Active Author: ${state.player.activeAuthor} (${AUTHOR_PROFILES[state.player.activeAuthor].passive})`);
  logEvent(`AI Active Author: ${state.ai.activeAuthor} (${AUTHOR_PROFILES[state.ai.activeAuthor].passive})`);
  syncTeacherControlsFromState();
  render();
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

async function askQuizPlayer(quiz, title = "Quick Check") {
  state.pendingQuiz = true;
  render();
  refs.quizTitle.textContent = title;
  refs.quizQuestion.textContent = quiz.question;
  refs.quizOptions.innerHTML = "";
  refs.quizModal.classList.remove("hidden");

  return new Promise((resolve) => {
    quiz.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.type = "button";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        const buttons = [...refs.quizOptions.querySelectorAll("button")];
        buttons.forEach((b, i) => {
          b.disabled = true;
          if (i === quiz.correctIndex) b.classList.add("correct");
        });
        const isCorrect = idx === quiz.correctIndex;
        if (!isCorrect) btn.classList.add("incorrect");
        setTimeout(() => {
          hideQuizModal();
          state.pendingQuiz = false;
          resolve(isCorrect);
        }, 550);
      });
      refs.quizOptions.appendChild(btn);
    });
  });
}

async function resolveKnowledgeCheck(ownerKey, quiz, title) {
  if (ownerKey === "ai") {
    const correct = Math.random() < 0.65;
    if (correct) addKnowledge("ai", 1, "correct literary response");
    logEvent(`AI ${correct ? "answers" : "misses"} a literary check.`);
    return;
  }
  const correct = await askQuizPlayer(quiz, title);
  if (correct) {
    addKnowledge("player", 1, "correct literary response");
    state.player.inspiration = Math.min(MAX_INSPIRATION, state.player.inspiration + 1);
    spawnFloatingFx("+1 Insp", refs.playerPanel, "info");
    logEvent(`Correct. ${quiz.explanation}`);
  } else {
    logEvent(`Not quite. ${quiz.explanation}`);
  }
}

function applyThemeObjective(ownerKey, card) {
  if (!card.themes || !card.themes.includes(state.matchTheme.key)) return;
  const owner = state[ownerKey];
  owner.inspiration = Math.min(MAX_INSPIRATION, owner.inspiration + 1);
  addKnowledge(ownerKey, 1, `matched theme ${state.matchTheme.label}`);
  spawnFloatingFx("Theme +1 Insp", panelForOwner(ownerKey), "info");
}

function applyAuthorCharacterRules(ownerKey, card) {
  const owner = state[ownerKey];
  const profile = AUTHOR_PROFILES[owner.activeAuthor];
  if (card.author === owner.activeAuthor) {
    addKnowledge(ownerKey, 1, `matched active author ${owner.activeAuthor}`);
    spawnFloatingFx("Author Match", cardElementByUid(card.uid) || panelForOwner(ownerKey), "heal");
    if (card.themes.includes(profile.bonusTag)) {
      if (owner.activeAuthor === "Shakespeare") {
        card.attack += 1;
        spawnFloatingFx("+1 ATK", panelForOwner(ownerKey), "heal");
      } else if (owner.activeAuthor === "Lewis Carroll") {
        card.currentMemorability += 1;
        spawnFloatingFx("+1 MEM", panelForOwner(ownerKey), "heal");
      }
      logEvent(`${card.name} gains ${owner.activeAuthor} passive bonus.`);
    }
  } else if (card.author === "Shakespeare" || card.author === "Lewis Carroll") {
    card.currentMemorability = Math.max(1, card.currentMemorability - 1);
    logEvent(`${card.name} is off-author and enters with -1 MEM.`);
  }
}

async function playCard(ownerKey, handIndex) {
  if (state.winner || state.pendingQuiz) return;
  const owner = state[ownerKey];
  const card = owner.hand[handIndex];
  if (!card) return;
  const cardCost = getCardCost(owner, card);
  if (cardCost > owner.inspiration) return;

  owner.inspiration -= cardCost;
  owner.hand.splice(handIndex, 1);

  if (card.type === "character") {
    owner.board.push(card);
    logEvent(`${owner.name} summons ${card.name}.`);
    applyAuthorCharacterRules(ownerKey, card);
  } else {
    resolveEffect(ownerKey, card);
    owner.discard.push(card);
    logEvent(`${owner.name} plays ${card.name}.`);
    if (card.subtype === "literary_device" && card.quiz) {
      await resolveKnowledgeCheck(ownerKey, card.quiz, `Literary Device: ${card.name}`);
    }
  }

  applyThemeObjective(ownerKey, card);
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
        const panel = panelForOwner(ownerKey === "player" ? "ai" : "player");
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
      const panel = panelForOwner(ownerKey === "player" ? "ai" : "player");
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
        spawnFloatingFx("Revive", panelForOwner(ownerKey), "heal");
        logEvent(`${owner.name} returns ${revived.name} to hand.`);
      }
      break;
    }
    case "draw_cards":
      drawCards(owner, card.value);
      spawnFloatingFx(`+${card.value} card`, panelForOwner(ownerKey), "info");
      logEvent(`${owner.name} draws ${card.value} card(s).`);
      break;
    case "heal_self":
      owner.reputation += card.value;
      flashTarget(panelForOwner(ownerKey));
      spawnFloatingFx(`+${card.value}`, panelForOwner(ownerKey), "heal");
      logEvent(`${owner.name} restores ${card.value} Reputation.`);
      break;
    case "gain_inspiration":
      owner.inspiration = Math.min(MAX_INSPIRATION, owner.inspiration + card.value);
      spawnFloatingFx(`+${card.value} Insp`, panelForOwner(ownerKey), "info");
      logEvent(`${owner.name} gains +${card.value} Inspiration.`);
      break;
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
  if (state.winner || state.pendingQuiz) return;
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
  if (state.winner || state.pendingQuiz) return;
  const attackerOwner = state[attackerOwnerKey];
  const defenderOwner = attackerOwnerKey === "player" ? state.ai : state.player;
  const attacker = attackerOwner.board.find((c) => c.uid === attackerUid);
  if (!attacker || attacker.exhausted || defenderOwner.board.length > 0) return;

  defenderOwner.reputation -= attacker.attack;
  attacker.exhausted = true;
  state.selectedAttackerUid = null;
  const targetPanel = panelForOwner(attackerOwnerKey === "player" ? "ai" : "player");
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
    spawnFloatingFx("Defeated", panelForOwner(ownerKey), "info");
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
  const knowledgeToWin = state.settings.knowledgeToWin;
  if (
    state.player.reputation <= 0 ||
    state.ai.reputation <= 0 ||
    state.player.knowledge >= knowledgeToWin ||
    state.ai.knowledge >= knowledgeToWin
  ) {
    if (state.player.reputation <= 0 || state.ai.knowledge >= knowledgeToWin) state.winner = "ai";
    else state.winner = "player";
    const reason =
      state.player.knowledge >= knowledgeToWin || state.ai.knowledge >= knowledgeToWin
        ? "knowledge track"
        : "reputation";
    logEvent(`Match over by ${reason}: ${state.winner === "player" ? "You win!" : "AI wins."}`);
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
  const knowledgeToWin = state.settings.knowledgeToWin;
  refs.playerRep.textContent = player.reputation;
  refs.playerInsp.textContent = `${player.inspiration}/${player.maxInspiration}`;
  refs.playerKnowledge.textContent = `${player.knowledge}/${knowledgeToWin}`;
  refs.playerAuthor.textContent = player.activeAuthor;
  refs.playerDeck.textContent = player.deck.length;
  refs.playerHand.textContent = player.hand.length;

  refs.aiRep.textContent = ai.reputation;
  refs.aiInsp.textContent = `${ai.inspiration}/${ai.maxInspiration}`;
  refs.aiKnowledge.textContent = `${ai.knowledge}/${knowledgeToWin}`;
  refs.aiAuthor.textContent = ai.activeAuthor;
  refs.aiDeck.textContent = ai.deck.length;
  refs.aiHand.textContent = ai.hand.length;

  refs.turnLabel.textContent = `Turn ${state.turn}`;
  refs.phaseLabel.textContent = state.winner
    ? `Winner: ${state.winner === "player" ? "You" : "AI"}`
    : state.currentPlayer === "player"
      ? "Your Main Phase"
      : "AI Thinking...";
  refs.themeLabel.textContent = state.matchTheme.label;

  refs.drawBtn.disabled =
    state.winner !== null || state.currentPlayer !== "player" || state.player.hasDrawnThisTurn || state.pendingQuiz;
  refs.endTurnBtn.disabled = state.winner !== null || state.currentPlayer !== "player" || state.pendingQuiz;

  if (!state.winner) hideWinnerBanner();

  renderPlayerHand();
  renderBoard("ai");
  renderBoard("player");
}

function buildCardEl(card, options = {}) {
  const node = refs.cardTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.cardUid = card.uid;
  const costPreview =
    state.currentPlayer === "player" && !state.winner
      ? `Cost ${getCardCost(state.player, card)}`
      : `Cost ${card.cost}`;

  node.querySelector(".title").textContent = card.name;
  node.querySelector(".author").textContent = `${card.author} - ${costPreview}`;
  node.querySelector(".body").textContent = `Source: ${card.who}\nFunction: ${card.why}\nEffect: ${card.effectText}`;

  if (card.type === "character") {
    node.querySelector(".meta").textContent = `ATK ${card.attack} | DEF ${card.defense} | MEM ${card.currentMemorability}`;
  } else {
    node.querySelector(".meta").textContent = `${card.type.toUpperCase()}${card.subtype === "literary_device" ? " - DEVICE" : ""}`;
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
    const cost = getCardCost(state.player, card);
    const disabled =
      state.winner !== null || state.currentPlayer !== "player" || state.pendingQuiz || cost > state.player.inspiration;

    const cardEl = buildCardEl(card, { disabled });
    cardEl.addEventListener("click", () => {
      if (disabled) return;
      cardEl.classList.add("leaving");
      setTimeout(() => {
        playCard("player", index);
      }, 120);
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
    const canPickAsAttacker =
      side === "player" && state.currentPlayer === "player" && !state.winner && !state.pendingQuiz && !card.exhausted;
    const canPickAsDefender =
      side === "ai" && state.currentPlayer === "player" && !state.winner && !state.pendingQuiz && Boolean(state.selectedAttackerUid);

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

    if (
      side === "player" &&
      state.currentPlayer === "player" &&
      !state.pendingQuiz &&
      state.selectedAttackerUid === card.uid &&
      state.ai.board.length === 0
    ) {
      const directBtn = document.createElement("button");
      directBtn.className = "button primary";
      directBtn.textContent = "Attack AI Writer";
      directBtn.addEventListener("click", () => attackWriter("player", card.uid));
      boardRef.appendChild(directBtn);
    }

    boardRef.appendChild(cardEl);
  });

  prevBoardUids[side] = new Set(board.map((c) => c.uid));
}

function drawForPlayer() {
  if (state.currentPlayer !== "player" || state.player.hasDrawnThisTurn || state.winner || state.pendingQuiz) return;
  drawCards(state.player, 1);
  state.player.hasDrawnThisTurn = true;
  spawnFloatingFx("+1 card", refs.playerPanel, "info");
  logEvent("You draw a card.");
  render();
}

async function runTurnEndQuickCheck(ownerKey) {
  const quiz = QUICK_CHECK_BANK[Math.floor(Math.random() * QUICK_CHECK_BANK.length)];
  await resolveKnowledgeCheck(ownerKey, quiz, "Turn-End Quick Check");
  checkWinner();
  render();
}

async function endPlayerTurn() {
  if (state.currentPlayer !== "player" || state.winner || state.pendingQuiz) return;
  if (state.turn % state.settings.quickCheckEveryTurns === 0) {
    await runTurnEndQuickCheck("player");
    if (state.winner) return;
  }
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
      .map((card, idx) => ({ card, idx, cost: getCardCost(state.ai, card) }))
      .filter(({ cost }) => cost <= state.ai.inspiration)
      .sort((a, b) => b.cost - a.cost);

    if (affordable.length > 0) {
      await playCard("ai", affordable[0].idx);
      played = true;
      await sleep(420);
    }
  }

  for (const attacker of state.ai.board) {
    if (state.winner) break;
    if (attacker.exhausted) continue;

    if (state.player.board.length > 0) {
      attackUnit("ai", attacker.uid, pickLowestMem(state.player.board).uid);
    } else {
      attackWriter("ai", attacker.uid);
    }
    await sleep(420);
  }

  if (state.winner) return;

  if (state.turn % state.settings.quickCheckEveryTurns === 0) {
    await runTurnEndQuickCheck("ai");
    if (state.winner) return;
  }

  state.turn += 1;
  beginTurn("player");
  render();
}

refs.drawBtn.addEventListener("click", drawForPlayer);
refs.endTurnBtn.addEventListener("click", endPlayerTurn);
refs.teacherApplyBtn.addEventListener("click", applyTeacherSettings);
refs.newGameBtn.addEventListener("click", initGame);
refs.playAgainBtn.addEventListener("click", initGame);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

initGame();
