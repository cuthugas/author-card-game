const MAX_INSPIRATION = 5;
const STARTING_REPUTATION = 15;
const STARTING_HAND = 5;
const DEFAULT_KNOWLEDGE_TO_WIN = 10;
const DEFAULT_QUICK_CHECK_EVERY_TURNS = 3;
const DEFAULT_ENABLE_THEME_BONUS = false;
const DEFAULT_ENABLE_AUTHOR_KNOWLEDGE_BONUS = false;
const SFX_EVENT_NAME = "acg:sfx";
const DEBUG_DOM_UI = Boolean(window.__ACG_DEBUG_DOM_UI);
const STATE_EVENT_NAME = "acg:state";
const FX_EVENT_NAME = "acg:fx";
const PHONE_LAYOUT_MAX_HEIGHT = 1100;
const PHONE_ROTATE_SHORT_SIDE = 600;
const APP_BUILD_ID = "d924f2c";

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

const QUICK_CHECK_BANKS = {
  shakespeare: [
  {
    question: "Who wrote Macbeth?",
    options: ["William Shakespeare", "Lewis Carroll", "Mary Shelley"],
    correctIndex: 0,
    explanation: "Macbeth is a tragedy by Shakespeare.",
  },
  {
    question: "Which play features the characters Rosencrantz and Guildenstern?",
    options: ["Hamlet", "Macbeth", "The Tempest"],
    correctIndex: 0,
    explanation: "Rosencrantz and Guildenstern appear in Hamlet.",
  },
  {
    question: "Who says 'To be, or not to be'?",
    options: ["Hamlet", "Macbeth", "Prospero"],
    correctIndex: 0,
    explanation: "Hamlet speaks the famous soliloquy in Hamlet.",
  },
  {
    question: "Which Shakespeare play takes place partly in the Forest of Arden?",
    options: ["As You Like It", "Julius Caesar", "Othello"],
    correctIndex: 0,
    explanation: "As You Like It is set partly in the Forest of Arden.",
  },
  {
    question: "Which character is Macbeth's wife?",
    options: ["Lady Macbeth", "Gertrude", "Beatrice"],
    correctIndex: 0,
    explanation: "Lady Macbeth urges Macbeth toward the crown.",
  },
  {
    question: "What title best describes Prospero in The Tempest?",
    options: ["Exiled duke and magician", "King of Denmark", "Roman senator"],
    correctIndex: 0,
    explanation: "Prospero is the exiled Duke of Milan and a magician.",
  },
  {
    question: "Which Shakespeare tragedy centers on jealousy and manipulation?",
    options: ["Othello", "A Midsummer Night's Dream", "Twelfth Night"],
    correctIndex: 0,
    explanation: "Othello focuses on jealousy, especially through Iago's manipulation.",
  },
  {
    question: "Which Shakespeare play includes the Weird Sisters?",
    options: ["Macbeth", "Hamlet", "King Lear"],
    correctIndex: 0,
    explanation: "The Weird Sisters are the witches in Macbeth.",
  },
  {
    question: "In Shakespeare, what is Yorick's Skull most closely associated with?",
    options: ["Mortality", "Comedy", "Royal marriage"],
    correctIndex: 0,
    explanation: "Yorick's Skull in Hamlet symbolizes mortality and memory.",
  },
  {
    question: "Which Shakespeare play is about a shipwreck and reconciliation?",
    options: ["The Tempest", "Richard III", "Romeo and Juliet"],
    correctIndex: 0,
    explanation: "The Tempest begins with a storm and ends in reconciliation.",
  },
  {
    question: "Macbeth's tragic flaw is most closely tied to what?",
    options: ["Ambition", "Laziness", "Humor"],
    correctIndex: 0,
    explanation: "Macbeth's destructive ambition drives the tragedy.",
  },
  {
    question: "Which Shakespearean form has 14 lines?",
    options: ["Sonnet", "Epic", "Novel"],
    correctIndex: 0,
    explanation: "A Shakespearean sonnet contains 14 lines.",
  },
  {
    question: "Which character in Hamlet is Hamlet's mother?",
    options: ["Gertrude", "Ophelia", "Cordelia"],
    correctIndex: 0,
    explanation: "Gertrude is the queen and Hamlet's mother.",
  },
  {
    question: "Which play features a magician giving up his art at the end?",
    options: ["The Tempest", "Macbeth", "Hamlet"],
    correctIndex: 0,
    explanation: "Prospero renounces magic near the end of The Tempest.",
  },
  ],
  carroll: [
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
  {
    question: "Which character is famous for always being in a hurry?",
    options: ["White Rabbit", "Hamlet", "Banquo"],
    correctIndex: 0,
    explanation: "The White Rabbit rushes about with his pocket watch.",
  },
  {
    question: "What phrase appears on the cake Alice finds?",
    options: ["Eat Me", "Open Me", "Read Me"],
    correctIndex: 0,
    explanation: "Alice finds a cake labeled 'Eat Me.'",
  },
  {
    question: "Which Wonderland ruler is known for shouting orders?",
    options: ["Queen of Hearts", "Lady Macbeth", "Titania"],
    correctIndex: 0,
    explanation: "The Queen of Hearts is known for dramatic commands.",
  },
  {
    question: "Which Lewis Carroll poem features the Jabberwock?",
    options: ["Jabberwocky", "The Raven", "Ozymandias"],
    correctIndex: 0,
    explanation: "The creature appears in Carroll's poem Jabberwocky.",
  },
  {
    question: "What object makes the White Rabbit instantly recognizable?",
    options: ["A pocket watch", "A crown", "A sword"],
    correctIndex: 0,
    explanation: "The White Rabbit is associated with his pocket watch.",
  },
  {
    question: "Which Wonderland character can appear and disappear?",
    options: ["Cheshire Cat", "Macduff", "Horatio"],
    correctIndex: 0,
    explanation: "The Cheshire Cat famously fades in and out.",
  },
  {
    question: "Lewis Carroll's Alice stories are best known for what quality?",
    options: ["Playful nonsense and logic games", "Strict historical realism", "Scientific reporting"],
    correctIndex: 0,
    explanation: "The Alice books are known for wordplay, nonsense, and logic puzzles.",
  },
  {
    question: "Which sequel follows Alice's Adventures in Wonderland?",
    options: ["Through the Looking-Glass", "Treasure Island", "Peter Pan"],
    correctIndex: 0,
    explanation: "Through the Looking-Glass is Carroll's sequel to Alice's Adventures in Wonderland.",
  },
  {
    question: "What animal joins the Mad Tea Party scene?",
    options: ["March Hare", "Falcon", "Wolf"],
    correctIndex: 0,
    explanation: "The March Hare is one of the tea party characters.",
  },
  {
    question: "The Mad Hatter scene is mainly known for what?",
    options: ["Absurd conversation", "A battlefield", "A courtroom speech"],
    correctIndex: 0,
    explanation: "The Mad Tea Party scene is famous for absurd conversation and riddles.",
  },
  {
    question: "Which setting is central to Through the Looking-Glass?",
    options: ["A mirror world", "A haunted castle", "An island storm"],
    correctIndex: 0,
    explanation: "Alice enters a mirror world in Through the Looking-Glass.",
  },
  {
    question: "What does Wonderland often challenge?",
    options: ["Normal logic and expectations", "Only battle tactics", "Only geography"],
    correctIndex: 0,
    explanation: "Wonderland scenes often twist logic, language, and expectation.",
  },
  ],
  literaryTerms: [
  {
    question: "What is a soliloquy?",
    options: ["A private speech revealing thoughts", "A poem with 14 lines", "A speech by two people"],
    correctIndex: 0,
    explanation: "A soliloquy lets the audience hear a character's inner thoughts.",
  },
  {
    question: "What does a soliloquy reveal?",
    options: ["A character's inner thoughts", "A chorus response", "A stage direction"],
    correctIndex: 0,
    explanation: "A soliloquy reveals what a character is thinking privately.",
  },
  {
    question: "What is iambic pentameter?",
    options: ["A 10-syllable line with unstressed/stressed pattern", "A 14-line sonnet form only", "A prose speech without rhythm"],
    correctIndex: 0,
    explanation: "Iambic pentameter is a 10-syllable line with five iambs.",
  },
  {
    question: "What is a metaphor?",
    options: ["A comparison without using 'like' or 'as'", "A list of characters", "A stage direction"],
    correctIndex: 0,
    explanation: "A metaphor compares unlike things directly.",
  },
  {
    question: "What is a simile?",
    options: ["A comparison using 'like' or 'as'", "A repeated consonant sound", "A sudden plot twist"],
    correctIndex: 0,
    explanation: "A simile compares two things using 'like' or 'as.'",
  },
  {
    question: "What is alliteration?",
    options: ["Repeated beginning consonant sounds", "A final speech in a play", "A type of novel"],
    correctIndex: 0,
    explanation: "Alliteration repeats initial consonant sounds in nearby words.",
  },
  {
    question: "What is a theme in literature?",
    options: ["A central idea or message", "A table of contents", "Only the setting"],
    correctIndex: 0,
    explanation: "A theme is a central idea explored in a work.",
  },
  {
    question: "What is a protagonist?",
    options: ["The main character", "The author of the story", "The final chapter"],
    correctIndex: 0,
    explanation: "The protagonist is the central character in a narrative.",
  },
  {
    question: "What is an antagonist?",
    options: ["A force opposing the main character", "A comic relief character", "The narrator"],
    correctIndex: 0,
    explanation: "An antagonist opposes the protagonist.",
  },
  {
    question: "What is foreshadowing?",
    options: ["Hints about later events", "A full summary of the ending", "A poem's rhyme pattern"],
    correctIndex: 0,
    explanation: "Foreshadowing gives clues about what may happen later.",
  },
  {
    question: "What is dramatic irony?",
    options: ["When the audience knows more than a character", "When every line rhymes", "When a play has no conflict"],
    correctIndex: 0,
    explanation: "Dramatic irony happens when the audience knows something a character does not.",
  },
  {
    question: "What is a setting?",
    options: ["The time and place of a story", "Only the title", "Only the conflict"],
    correctIndex: 0,
    explanation: "Setting describes where and when a story takes place.",
  },
  {
    question: "What is conflict in literature?",
    options: ["A struggle that drives the story", "A list of chapter titles", "A type of poem only"],
    correctIndex: 0,
    explanation: "Conflict is a struggle or problem that moves the story forward.",
  },
  {
    question: "What is a narrator?",
    options: ["The voice telling the story", "The strongest character", "The audience"],
    correctIndex: 0,
    explanation: "A narrator is the voice that tells the story.",
  },
  {
    question: "What is personification?",
    options: ["Giving human qualities to nonhuman things", "Using only first person", "Explaining a text in footnotes"],
    correctIndex: 0,
    explanation: "Personification gives human traits to animals, objects, or ideas.",
  },
  ],
  generalLiterature: [
  {
    question: "Who wrote Alice's Adventures in Wonderland?",
    options: ["Jane Austen", "Lewis Carroll", "Charles Dickens"],
    correctIndex: 1,
    explanation: "Lewis Carroll wrote Alice's Adventures in Wonderland.",
  },
  {
    question: "A tragedy usually ends with what kind of outcome?",
    options: ["A serious or disastrous outcome", "A joke competition", "A travel guide"],
    correctIndex: 0,
    explanation: "A tragedy usually ends with serious loss or suffering.",
  },
  {
    question: "A comedy in literature usually tends toward what?",
    options: ["A lighter or happier resolution", "Only battles", "No conflict at all"],
    correctIndex: 0,
    explanation: "Comedies usually move toward a lighter resolution.",
  },
  {
    question: "Which of these is a genre?",
    options: ["Tragedy", "Paragraph", "Footnote"],
    correctIndex: 0,
    explanation: "Tragedy is a literary genre.",
  },
  {
    question: "What is the purpose of an explanation in a classroom quiz?",
    options: ["To teach why an answer is correct", "To hide the topic", "To replace the question"],
    correctIndex: 0,
    explanation: "The explanation helps students understand the reasoning behind the answer.",
  },
  {
    question: "Which skill is most important in close reading?",
    options: ["Paying attention to word choice and detail", "Skipping directly to the ending", "Ignoring context"],
    correctIndex: 0,
    explanation: "Close reading focuses on language, structure, and detail.",
  },
  {
    question: "An author's word choice is often called what?",
    options: ["Diction", "Setting", "Staging"],
    correctIndex: 0,
    explanation: "Diction refers to an author's choice of words.",
  },
  {
    question: "What is a symbol in literature?",
    options: ["Something that stands for a larger idea", "Only a punctuation mark", "A list of page numbers"],
    correctIndex: 0,
    explanation: "A symbol represents a larger idea beyond its literal meaning.",
  },
  {
    question: "What is the best definition of plot?",
    options: ["The sequence of events in a story", "The color of a book cover", "The author's signature"],
    correctIndex: 0,
    explanation: "Plot is the sequence of events in a narrative.",
  },
  {
    question: "What does it mean to infer while reading?",
    options: ["Use clues to figure something out", "Memorize every line exactly", "Ignore the text"],
    correctIndex: 0,
    explanation: "Inference means using textual clues and reasoning to reach a conclusion.",
  },
  {
    question: "What kind of text is a play primarily written to be?",
    options: ["Performed", "Cooked", "Painted"],
    correctIndex: 0,
    explanation: "A play is written to be performed.",
  },
  {
    question: "Why do writers use imagery?",
    options: ["To create vivid sensory detail", "To remove all description", "To avoid any meaning"],
    correctIndex: 0,
    explanation: "Imagery appeals to the senses to make writing vivid.",
  },
  {
    question: "What is the main goal of literary analysis?",
    options: ["To explain how a text creates meaning", "To count every word only", "To rewrite the ending"],
    correctIndex: 0,
    explanation: "Literary analysis explains how a text's details and choices create meaning.",
  },
  {
    question: "Which is usually the best evidence in a literature discussion?",
    options: ["Specific details from the text", "A random guess", "An unrelated opinion"],
    correctIndex: 0,
    explanation: "Strong literary discussion relies on specific textual evidence.",
  },
  {
    question: "What is the tone of a text?",
    options: ["The writer's attitude toward the subject", "The page number", "The font size"],
    correctIndex: 0,
    explanation: "Tone is the author's or speaker's attitude toward the subject.",
  },
  ],
};

const QUICK_CHECK_BANK = Object.values(QUICK_CHECK_BANKS).flat();

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
  toggleLogBtn: document.getElementById("toggle-log-btn"),
  toggleTeacherBtn: document.getElementById("toggle-teacher-btn"),
  toggleRulesBtn: document.getElementById("toggle-rules-btn"),
  audioToggleBtn: document.getElementById("audio-toggle-btn"),
  teacherKnowledgeTarget: document.getElementById("teacher-knowledge-target"),
  teacherQuizFrequency: document.getElementById("teacher-quiz-frequency"),
  teacherApplyBtn: document.getElementById("teacher-apply-btn"),
  logPanel: document.getElementById("log-panel"),
  teacherPanel: document.getElementById("teacher-panel"),
  rulesPanel: document.getElementById("rules-panel"),
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
  app: document.querySelector(".app"),
  rotateWarning: document.getElementById("rotate-warning"),
};

const cardPool = [
  { key: "hamlet", name: "Hamlet", type: "character", author: "Shakespeare", cost: 2, attack: 3, defense: 2, memorability: 3, themes: ["identity", "ambition", "tragedy"], who: "Prince of Denmark from Shakespeare's tragedy Hamlet.", why: "Represents indecision, revenge, and moral conflict.", effectText: "None." },
  { key: "macbeth", name: "Macbeth", type: "character", author: "Shakespeare", cost: 3, attack: 5, defense: 1, memorability: 3, themes: ["ambition", "power", "tragedy"], who: "Scottish nobleman from Macbeth.", why: "Shows corrupting ambition and consequences of power.", effectText: "None." },
  { key: "lady_macbeth", name: "Lady Macbeth", type: "character", author: "Shakespeare", cost: 3, attack: 3, defense: 3, memorability: 3, themes: ["ambition", "power", "tragedy"], who: "Macbeth's wife and key instigator.", why: "Embodies persuasion, guilt, and ambition.", effectText: "None." },
  { key: "prospero", name: "Prospero", type: "character", author: "Shakespeare", cost: 4, attack: 4, defense: 4, memorability: 3, themes: ["power", "identity", "tragedy"], who: "Exiled duke-magician from The Tempest.", why: "Explores control, forgiveness, and authority.", effectText: "None." },
  { key: "alice", name: "Alice", type: "character", author: "Lewis Carroll", cost: 2, attack: 2, defense: 2, memorability: 4, themes: ["curiosity", "identity", "wonderland"], who: "Young protagonist of Alice's Adventures in Wonderland.", why: "Represents growth through curiosity and questioning.", effectText: "None." },
  { key: "cheshire_cat", name: "Cheshire Cat", type: "character", author: "Lewis Carroll", cost: 2, attack: 2, defense: 2, memorability: 3, themes: ["curiosity", "identity", "wonderland"], who: "Mysterious speaking cat in Wonderland.", why: "Challenges logic and guides Alice indirectly.", effectText: "On Summon: Gain +1 Inspiration.", triggers: [{ event: "onSummon", effects: [{ type: "gainInspiration", amount: 1 }] }] },
  { key: "queen_of_hearts", name: "Queen of Hearts", type: "character", author: "Lewis Carroll", cost: 3, attack: 4, defense: 2, memorability: 2, themes: ["power", "wonderland"], who: "Impulsive monarch from Wonderland.", why: "Parodies arbitrary authority.", effectText: "None." },
  { key: "jabberwock", name: "Jabberwock", type: "character", author: "Lewis Carroll", cost: 4, attack: 4, defense: 3, memorability: 4, themes: ["curiosity", "wonderland"], who: "Nonsense-poem creature from Through the Looking-Glass.", why: "Shows imagination, language play, and mythic tone.", effectText: "None." },
  { key: "iambic_pentameter", name: "Iambic Pentameter", type: "plot", subtype: "literary_device", author: "Literary Device", cost: 2, effect: "buff_friendly_top_attack", value: { attack: 2, memorability: 1 }, themes: ["power", "identity"], who: "A poetic meter of five unstressed/stressed pairs per line.", why: "Key rhythm used in Shakespeare's dramatic verse.", effectText: "Best ally gains +2 ATK and +1 MEM.", quiz: { question: "What is iambic pentameter?", options: ["A 10-syllable line with unstressed/stressed pattern", "A 14-line sonnet form only", "A prose speech without rhythm"], correctIndex: 0, explanation: "Iambic pentameter is a 10-syllable line with five iambs." } },
  { key: "soliloquy", name: "Soliloquy", type: "plot", subtype: "literary_device", author: "Literary Device", cost: 2, effect: "damage_enemy_top_attack", value: 3, themes: ["identity", "ambition"], who: "A speech where a character reveals inner thoughts aloud.", why: "Used in drama to expose motivation and conflict.", effectText: "Deal 3 damage to strongest enemy.", quiz: { question: "What does a soliloquy reveal?", options: ["A character's inner thoughts", "A chorus response", "A stage direction"], correctIndex: 0, explanation: "A soliloquy reveals what a character is thinking privately." } },
  { key: "vorpal_strike", name: "Vorpal Strike", type: "plot", author: "Wonderland", cost: 3, effect: "destroy_enemy_lowest_mem", themes: ["curiosity", "power"], who: "Reference to the Vorpal Sword in Jabberwocky.", why: "Connects nonsense verse and heroic quest language.", effectText: "Destroy weakest enemy character." },
  { key: "o_happy_dagger", name: "O Happy Dagger", type: "artifact", author: "Shakespeare", cost: 1, effect: "damage_enemy_writer", value: 2, themes: ["tragedy", "ambition"], who: "Allusion to Juliet's final line in Romeo and Juliet.", why: "Highlights tragic climax and symbolism.", effectText: "Deal 2 to enemy Reputation." },
  { key: "yoricks_skull", name: "Yorick's Skull", type: "artifact", author: "Shakespeare", cost: 2, effect: "resurrect_character", themes: ["identity", "tragedy"], who: "Skull held by Hamlet in Act V.", why: "Symbolizes mortality and memory.", effectText: "Return a character from discard to hand." },
  { key: "rabbits_watch", name: "Rabbit's Pocket Watch", type: "artifact", author: "Wonderland", cost: 2, effect: "draw_cards", value: 2, themes: ["curiosity", "wonderland"], who: "White Rabbit's iconic watch.", why: "Introduces urgency and surreal pacing.", effectText: "On Play: Draw 2 cards.", triggers: [{ event: "onPlay", effects: [{ type: "drawCard", amount: 2 }] }] },
  { key: "revision", name: "Revision", type: "plot", author: "Writing", cost: 2, effect: "heal_self", value: 3, themes: ["identity"], who: "Reworking ideas after feedback.", why: "Shows growth and deeper understanding in writing.", effectText: "Restore 3 Reputation." },
  { key: "deadline_surge", name: "Deadline Surge", type: "plot", author: "Writing", cost: 1, effect: "gain_inspiration", value: 2, themes: ["power", "ambition"], who: "Focused push to finish written work.", why: "Represents urgency and productivity pressure.", effectText: "Gain +2 Inspiration this turn." },
  { key: "tea_party_chaos", name: "Tea Party Chaos", type: "plot", author: "Wonderland", cost: 3, effect: "weaken_enemy_all", value: 1, themes: ["curiosity", "wonderland"], who: "Mad Tea Party scene.", why: "Highlights absurd logic and social satire.", effectText: "All enemies lose 1 ATK (min 1)." },
  { key: "critical_essay", name: "Critical Essay", type: "plot", author: "Classroom", cost: 1, effect: "draw_cards", value: 1, themes: ["identity", "power"], who: "Analytical writing about literature.", why: "Builds evidence-based interpretation.", effectText: "Draw 1 card." },
];

let uid = 1;
let state;
let prevBoardUids = { player: new Set(), ai: new Set() };
const stateSubscribers = new Set();

function createDefaultSettings() {
  return {
    knowledgeToWin: DEFAULT_KNOWLEDGE_TO_WIN,
    quickCheckEveryTurns: DEFAULT_QUICK_CHECK_EVERY_TURNS,
    enableThemeBonus: DEFAULT_ENABLE_THEME_BONUS,
    enableAuthorKnowledgeBonus: DEFAULT_ENABLE_AUTHOR_KNOWLEDGE_BONUS,
  };
}

let teacherSettings = {
  ...createDefaultSettings(),
};
const sfxState = {
  muted: localStorage.getItem("acg_sfx_muted") === "1",
  unlocked: false,
  context: null,
  masterGain: null,
  compressor: null,
  reverb: null,
  reverbGain: null,
};
const phaserUiBridge = {
  quizHandler: null,
  winnerHandler: null,
};
const viewportState = {
  syncFrame: 0,
};

console.log(`APP JS BUILD ${APP_BUILD_ID} LOADED`);

function ensureBuildBadge() {
  const existing = document.getElementById("acg-build-badge");
  if (existing) return existing;
  const badge = document.createElement("div");
  badge.id = "acg-build-badge";
  badge.textContent = `BUILD ${APP_BUILD_ID}`;
  badge.setAttribute("aria-label", `Build ${APP_BUILD_ID}`);
  Object.assign(badge.style, {
    position: "fixed",
    left: "10px",
    bottom: "10px",
    zIndex: "1200",
    padding: "4px 8px",
    borderRadius: "999px",
    border: "1px solid rgba(245, 223, 177, 0.35)",
    background: "rgba(15, 22, 40, 0.78)",
    color: "#f4dfb1",
    fontFamily: "\"Spectral\", Georgia, serif",
    fontSize: "12px",
    lineHeight: "1",
    letterSpacing: "0.04em",
    pointerEvents: "none",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.28)",
  });
  document.body.appendChild(badge);
  return badge;
}

function stateSnapshot() {
  if (!state) return null;
  return JSON.parse(JSON.stringify(state));
}

function notifyStateChanged() {
  const snapshot = stateSnapshot();
  stateSubscribers.forEach((cb) => {
    try {
      cb(snapshot);
    } catch {}
  });
  window.dispatchEvent(new CustomEvent(STATE_EVENT_NAME, { detail: snapshot }));
}

function newPlayer(name, activeAuthor) {
  return { name, reputation: STARTING_REPUTATION, maxInspiration: 0, inspiration: 0, knowledge: 0, activeAuthor, deck: createDeck(), hand: [], board: [], discard: [], hasDrawnThisTurn: false };
}

function createDeck() {
  return shuffle(cardPool.map(cloneCardTemplate));
}

function inferRarity(card) {
  if (["prospero", "jabberwock", "vorpal_strike"].includes(card.key)) return "legendary";
  if (card.subtype === "literary_device" || card.cost >= 3) return "rare";
  return "common";
}

function cloneCardTemplate(card) {
  const cloned = {
    ...card,
    themes: card.themes ? [...card.themes] : [],
    quiz: card.quiz ? { ...card.quiz, options: [...card.quiz.options] } : null,
    value: card.value && typeof card.value === "object" ? { ...card.value } : card.value,
    triggers: card.triggers ? card.triggers.map((trigger) => ({
      ...trigger,
      effects: (trigger.effects || []).map((effect) => ({
        ...effect,
        value: effect.value && typeof effect.value === "object" ? { ...effect.value } : effect.value,
      })),
    })) : [],
  };
  cloned.rarity = card.rarity || inferRarity(card);
  cloned.uid = `${card.key}_${uid++}`;
  if (cloned.type === "character") {
    cloned.currentMemorability = cloned.memorability;
    cloned.exhausted = false;
  }
  return cloned;
}

function getCardTriggers(card, eventName) {
  if (!card?.triggers?.length) return [];
  return card.triggers.filter((trigger) => trigger?.event === eventName);
}

function hasCardTriggers(card, eventName = null) {
  return eventName ? getCardTriggers(card, eventName).length > 0 : Boolean(card?.triggers?.length);
}

function getOwnerAndEnemy(ownerKey) {
  return {
    owner: state[ownerKey],
    enemy: ownerKey === "player" ? state.ai : state.player,
  };
}

function resolveTriggerTarget(ownerKey, effect, context = {}) {
  const { owner, enemy } = getOwnerAndEnemy(ownerKey);
  switch (effect.target) {
    case "self":
      return context.sourceCard || null;
    case "friendlyHighestAttack":
      return pickHighestAttack(owner.board);
    case "enemyHighestAttack":
      return pickHighestAttack(enemy.board);
    case "enemyLowestMem":
      return pickLowestMem(enemy.board);
    default:
      return null;
  }
}

// Trigger effects stay intentionally small and readable for the prototype.
// Cards can declare event-driven behavior in data and this dispatcher maps it
// onto a modest set of effect payloads without introducing a large rules engine.
function resolveTriggerEffect(ownerKey, sourceCard, effect, context = {}) {
  if (!effect?.type) return;
  const { owner, enemy } = getOwnerAndEnemy(ownerKey);
  const amount = effect.amount ?? effect.value ?? 1;

  switch (effect.type) {
    case "drawCard":
      drawCards(owner, amount);
      spawnFloatingFx(`+${amount} card`, panelForOwner(ownerKey), "info");
      logEvent(`${owner.name} draws ${amount} card(s) from ${sourceCard.name}.`);
      break;
    case "gainKnowledge":
      addKnowledge(ownerKey, amount, `${sourceCard.name} trigger`);
      break;
    case "gainInspiration":
      owner.inspiration = Math.min(MAX_INSPIRATION, owner.inspiration + amount);
      spawnFloatingFx(`+${amount} Insp`, panelForOwner(ownerKey), "info");
      logEvent(`${owner.name} gains +${amount} Inspiration from ${sourceCard.name}.`);
      break;
    case "dealDamage": {
      const targetCard = resolveTriggerTarget(ownerKey, effect, { ...context, sourceCard });
      if (effect.target === "enemyWriter" || (!targetCard && effect.fallbackTarget === "enemyWriter")) {
        enemy.reputation -= amount;
        const panel = panelForOwner(ownerKey === "player" ? "ai" : "player");
        flashTarget(panel);
        spawnFloatingFx(`-${amount}`, panel);
        logEvent(`${sourceCard.name} deals ${amount} damage to ${enemy.name}.`);
        break;
      }
      if (targetCard) {
        targetCard.currentMemorability -= amount;
        const targetEl = cardElementByUid(targetCard.uid);
        flashTarget(targetEl);
        spawnFloatingFx(`-${amount}`, targetEl);
        logEvent(`${sourceCard.name} deals ${amount} damage to ${targetCard.name}.`);
      }
      break;
    }
    case "heal":
      owner.reputation += amount;
      flashTarget(panelForOwner(ownerKey));
      spawnFloatingFx(`+${amount}`, panelForOwner(ownerKey), "heal");
      logEvent(`${owner.name} restores ${amount} Reputation from ${sourceCard.name}.`);
      break;
    case "buffSelf":
      if (!sourceCard || sourceCard.type !== "character") break;
      if (effect.attack) sourceCard.attack += effect.attack;
      if (effect.memorability) sourceCard.currentMemorability += effect.memorability;
      if (effect.defense) sourceCard.defense += effect.defense;
      spawnFloatingFx("Empowered", cardElementByUid(sourceCard.uid) || panelForOwner(ownerKey), "heal");
      logEvent(`${sourceCard.name} is empowered by its trigger.`);
      break;
    case "returnCardToHand":
      if (effect.target === "self" && sourceCard) {
        sourceCard.currentMemorability = sourceCard.memorability || sourceCard.currentMemorability;
        sourceCard.exhausted = false;
        owner.hand.push(sourceCard);
        context.preventDiscard = true;
        spawnFloatingFx("Return", panelForOwner(ownerKey), "heal");
        logEvent(`${sourceCard.name} returns to ${owner.name}'s hand.`);
      } else {
        const index = owner.discard.findIndex((card) => card.type === "character");
        if (index >= 0) {
          const revived = owner.discard.splice(index, 1)[0];
          revived.currentMemorability = revived.memorability;
          revived.exhausted = false;
          owner.hand.push(revived);
          spawnFloatingFx("Revive", panelForOwner(ownerKey), "heal");
          logEvent(`${owner.name} returns ${revived.name} to hand via ${sourceCard.name}.`);
        }
      }
      break;
    case "destroyTarget": {
      const targetCard = resolveTriggerTarget(ownerKey, effect, { ...context, sourceCard });
      if (!targetCard) break;
      targetCard.currentMemorability = 0;
      const targetEl = cardElementByUid(targetCard.uid);
      flashTarget(targetEl);
      spawnFloatingFx("KO", targetEl);
      logEvent(`${sourceCard.name} destroys ${targetCard.name}.`);
      break;
    }
    default:
      break;
  }
}

// Trigger flow:
// 1. A gameplay moment fires a named event such as onPlay/onSummon/onDefeat.
// 2. We inspect the source card's trigger data for matching entries.
// 3. Matching effects resolve in card-data order, keeping behavior predictable.
function dispatchCardEvent(ownerKey, card, eventName, context = {}) {
  const triggers = getCardTriggers(card, eventName);
  triggers.forEach((trigger) => {
    (trigger.effects || []).forEach((effect) => {
      resolveTriggerEffect(ownerKey, card, effect, { ...context, ownerKey, sourceCard: card });
    });
  });
}

function resolveCardTriggers(ownerKey, card, eventName, context = {}) {
  dispatchCardEvent(ownerKey, card, eventName, context);
}

function resolveBoardTriggers(ownerKey, eventName, context = {}) {
  const boardSnapshot = [...state[ownerKey].board];
  boardSnapshot.forEach((card) => {
    if (!state[ownerKey].board.some((boardCard) => boardCard.uid === card.uid)) return;
    dispatchCardEvent(ownerKey, card, eventName, context);
  });
}

function emitSfx(name, detail = {}) {
  const payload = { name, ...detail };
  window.dispatchEvent(new CustomEvent(SFX_EVENT_NAME, { detail: payload }));
  if (typeof window.__acgSfxHook === "function") {
    window.__acgSfxHook(payload);
  }
}

function ensureAudioContext() {
  if (!sfxState.context) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    sfxState.context = new Ctx();
  }
  return sfxState.context;
}

function createImpulseResponse(ctx, seconds = 1.4, decay = 2.2) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < impulse.numberOfChannels; c += 1) {
    const channel = impulse.getChannelData(c);
    for (let i = 0; i < length; i += 1) {
      const n = Math.random() * 2 - 1;
      const t = i / length;
      channel[i] = n * Math.pow(1 - t, decay);
    }
  }
  return impulse;
}

function ensureAudioGraph() {
  const ctx = ensureAudioContext();
  if (!ctx) return null;
  if (sfxState.masterGain) return ctx;

  sfxState.masterGain = ctx.createGain();
  sfxState.masterGain.gain.value = 0.78;

  sfxState.compressor = ctx.createDynamicsCompressor();
  sfxState.compressor.threshold.value = -20;
  sfxState.compressor.knee.value = 20;
  sfxState.compressor.ratio.value = 3;
  sfxState.compressor.attack.value = 0.003;
  sfxState.compressor.release.value = 0.22;

  sfxState.reverb = ctx.createConvolver();
  sfxState.reverb.buffer = createImpulseResponse(ctx, 1.6, 2.4);

  sfxState.reverbGain = ctx.createGain();
  sfxState.reverbGain.gain.value = 0.22;

  sfxState.masterGain.connect(sfxState.compressor).connect(ctx.destination);
  sfxState.masterGain.connect(sfxState.reverb);
  sfxState.reverb.connect(sfxState.reverbGain).connect(sfxState.compressor);
  return ctx;
}

function updateAudioToggleUi() {
  refs.audioToggleBtn.textContent = sfxState.muted ? "SFX Off" : "SFX On";
  refs.audioToggleBtn.classList.toggle("audio-off", sfxState.muted);
}

async function unlockAudio() {
  if (sfxState.unlocked) return;
  const ctx = ensureAudioGraph();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return;
    }
  }
  sfxState.unlocked = true;
}

function playTone(freq, duration = 0.08, type = "sine", gainValue = 0.035, whenOffset = 0, opts = {}) {
  if (sfxState.muted || !sfxState.unlocked) return;
  const ctx = ensureAudioGraph();
  if (!ctx) return;
  const now = ctx.currentTime + whenOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const panNode = ctx.createStereoPanner();

  const attack = opts.attack ?? 0.008;
  const release = opts.release ?? duration;
  const detune = opts.detune ?? 0;
  const pan = opts.pan ?? 0;
  const cutoff = opts.cutoff ?? 2200;
  const q = opts.q ?? 0.8;
  const filterType = opts.filterType ?? "lowpass";

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.detune.setValueAtTime(detune, now);
  filter.type = filterType;
  filter.frequency.setValueAtTime(cutoff, now);
  filter.Q.setValueAtTime(q, now);
  panNode.pan.setValueAtTime(pan, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + release);
  osc.connect(filter).connect(panNode).connect(gain).connect(sfxState.masterGain);
  osc.start(now);
  osc.stop(now + release + 0.01);
}

function playNoiseBurst(duration = 0.06, gainValue = 0.02, whenOffset = 0, opts = {}) {
  if (sfxState.muted || !sfxState.unlocked) return;
  const ctx = ensureAudioGraph();
  if (!ctx) return;
  const now = ctx.currentTime + whenOffset;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = opts.filterType ?? "bandpass";
  filter.frequency.setValueAtTime(opts.cutoff ?? 1800, now);
  filter.Q.setValueAtTime(opts.q ?? 1.2, now);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  src.connect(filter).connect(gain).connect(sfxState.masterGain);
  src.start(now);
  src.stop(now + duration + 0.01);
}

function playSfxByName(name) {
  switch (name) {
    case "match_start":
      playTone(392, 0.14, "triangle", 0.04, 0, { pan: -0.12, cutoff: 2800 });
      playTone(493.88, 0.16, "triangle", 0.038, 0.12, { pan: 0.12, cutoff: 3000 });
      playTone(587.33, 0.2, "triangle", 0.04, 0.24, { pan: 0, cutoff: 3200 });
      break;
    case "turn_start":
      playTone(523.25, 0.07, "sine", 0.026, 0, { cutoff: 2400, q: 1.1 });
      playTone(784, 0.05, "sine", 0.016, 0.045, { cutoff: 3000 });
      break;
    case "draw_card":
      playNoiseBurst(0.035, 0.009, 0, { cutoff: 2200, q: 1.7 });
      playTone(659.25, 0.08, "triangle", 0.025, 0, { pan: -0.08, cutoff: 3400 });
      playTone(880, 0.1, "triangle", 0.022, 0.055, { pan: 0.08, cutoff: 3500 });
      break;
    case "card_play_character":
      playNoiseBurst(0.03, 0.006, 0, { cutoff: 1400, q: 0.9 });
      playTone(196, 0.1, "sawtooth", 0.026, 0, { cutoff: 1700, q: 1.3 });
      playTone(246.94, 0.12, "triangle", 0.022, 0.08, { cutoff: 2100 });
      break;
    case "card_play_spell":
      playNoiseBurst(0.05, 0.01, 0, { cutoff: 3000, q: 2.2 });
      playTone(740, 0.1, "sawtooth", 0.022, 0, { pan: -0.15, cutoff: 2600, q: 1.6 });
      playTone(987.77, 0.12, "sine", 0.02, 0.09, { pan: 0.15, cutoff: 3200 });
      break;
    case "attack_unit":
      playNoiseBurst(0.04, 0.012, 0, { cutoff: 900, q: 0.8 });
      playTone(130.81, 0.08, "square", 0.036, 0, { cutoff: 1200, q: 0.9 });
      break;
    case "attack_writer":
      playNoiseBurst(0.05, 0.014, 0, { cutoff: 700, q: 0.7 });
      playTone(110, 0.1, "square", 0.042, 0, { cutoff: 1000, q: 0.8 });
      playTone(82.41, 0.09, "triangle", 0.026, 0.05, { cutoff: 900 });
      break;
    case "card_defeated":
      playNoiseBurst(0.04, 0.01, 0, { cutoff: 1100, q: 1 });
      playTone(220, 0.07, "triangle", 0.024, 0, { cutoff: 1600 });
      playTone(155.56, 0.11, "triangle", 0.022, 0.05, { cutoff: 1300 });
      break;
    case "match_end":
      playTone(523.25, 0.16, "triangle", 0.042, 0, { pan: -0.1, cutoff: 3000 });
      playTone(659.25, 0.18, "triangle", 0.042, 0.12, { pan: 0.08, cutoff: 3200 });
      playTone(783.99, 0.22, "triangle", 0.046, 0.24, { pan: 0, cutoff: 3400 });
      playTone(1046.5, 0.2, "sine", 0.02, 0.3, { cutoff: 3600 });
      break;
    default:
      break;
  }
}

function handleSfxEvent(e) {
  if (!e?.detail?.name) return;
  playSfxByName(e.detail.name);
}

function toggleSfx() {
  sfxState.muted = !sfxState.muted;
  localStorage.setItem("acg_sfx_muted", sfxState.muted ? "1" : "0");
  updateAudioToggleUi();
  if (!sfxState.muted) {
    unlockAudio().then(() => {
      playTone(659.25, 0.06, "sine", 0.022, 0, { cutoff: 3000 });
      playTone(880, 0.06, "sine", 0.02, 0.05, { cutoff: 3400 });
    });
  }
}

function runScreenIntro() {
  const fade = document.getElementById("screen-fade");
  if (!fade) return;
  requestAnimationFrame(() => {
    fade.classList.add("ready");
  });
}

function getViewportMetrics() {
  const viewport = window.visualViewport;
  const width = Math.round(viewport?.width || window.innerWidth || document.documentElement.clientWidth || 0);
  const height = Math.round(viewport?.height || window.innerHeight || document.documentElement.clientHeight || 0);
  return {
    width,
    height,
    shortSide: Math.min(width, height),
    longSide: Math.max(width, height),
  };
}

function isLikelyMobileDevice() {
  return (
    window.matchMedia?.("(pointer: coarse)")?.matches ||
    navigator.maxTouchPoints > 0 ||
    "ontouchstart" in window
  );
}

function shouldShowRotateWarning(metrics) {
  if (!isLikelyMobileDevice()) return false;
  const isPortrait = metrics.height > metrics.width;
  const isPhoneViewport =
    metrics.shortSide <= PHONE_ROTATE_SHORT_SIDE && metrics.longSide <= PHONE_LAYOUT_MAX_HEIGHT;
  return isPortrait && isPhoneViewport;
}

function syncViewportState() {
  viewportState.syncFrame = 0;
  const metrics = getViewportMetrics();
  const rotateRequired = shouldShowRotateWarning(metrics);

  document.documentElement.style.setProperty("--app-width", `${metrics.width}px`);
  document.documentElement.style.setProperty("--app-height", `${metrics.height}px`);
  document.body.classList.toggle("rotate-required", rotateRequired);

  if (refs.rotateWarning) {
    refs.rotateWarning.classList.toggle("hidden", !rotateRequired);
    refs.rotateWarning.setAttribute("aria-hidden", rotateRequired ? "false" : "true");
  }

  window.dispatchEvent(
    new CustomEvent("acg:viewport", {
      detail: { ...metrics, rotateRequired },
    })
  );
}

function queueViewportSync() {
  if (viewportState.syncFrame) return;
  viewportState.syncFrame = requestAnimationFrame(() => {
    viewportState.syncFrame = requestAnimationFrame(syncViewportState);
  });
}

function bindViewportState() {
  ["resize", "orientationchange", "load", "pageshow", "fullscreenchange", "webkitfullscreenchange"].forEach((eventName) => {
    window.addEventListener(eventName, queueViewportSync);
  });

  window.visualViewport?.addEventListener("resize", queueViewportSync);
  window.visualViewport?.addEventListener("scroll", queueViewportSync);
  window.screen?.orientation?.addEventListener?.("change", queueViewportSync);
  queueViewportSync();
}

function getFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

function isFullscreenSupported() {
  const root = document.documentElement;
  return Boolean(
    document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      root.requestFullscreen ||
      root.webkitRequestFullscreen
  );
}

async function toggleFullscreenMode() {
  const root = document.documentElement;
  const activeElement = getFullscreenElement();
  const request =
    root.requestFullscreen?.bind(root) ||
    root.webkitRequestFullscreen?.bind(root);
  const exit =
    document.exitFullscreen?.bind(document) ||
    document.webkitExitFullscreen?.bind(document);

  if (!request || !exit) {
    return false;
  }

  try {
    if (activeElement) {
      await exit();
    } else {
      await request();
    }
    queueViewportSync();
    return true;
  } catch {
    queueViewportSync();
    return false;
  }
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

function isThemeBonusEnabled() {
  return state?.settings?.enableThemeBonus !== false;
}

function isAuthorKnowledgeBonusEnabled() {
  return state?.settings?.enableAuthorKnowledgeBonus !== false;
}

function showWinnerBanner() {
  if (!state.winner) return;
  if (!DEBUG_DOM_UI) {
    phaserUiBridge.winnerHandler?.({
      winner: state.winner,
      reason:
        state.player.knowledge >= state.settings.knowledgeToWin || state.ai.knowledge >= state.settings.knowledgeToWin
          ? "knowledge"
          : "reputation",
    });
    return;
  }
  refs.winnerText.textContent = state.winner === "player" ? "Victory" : "Defeat";
  refs.winnerBanner.classList.remove("hidden");
}

function hideWinnerBanner() {
  if (!DEBUG_DOM_UI) {
    phaserUiBridge.winnerHandler?.(null);
    return;
  }
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
  teacherSettings = {
    ...teacherSettings,
    knowledgeToWin,
    quickCheckEveryTurns,
  };
  if (state) {
    state.settings = { ...teacherSettings };
    syncTeacherControlsFromState();
    logEvent(`Teacher Mode updated: Knowledge win ${knowledgeToWin}, quick check every ${quickCheckEveryTurns} turns.`);
    render();
  }
}

function closeAllDrawers() {
  refs.logPanel.classList.add("hidden");
  refs.teacherPanel.classList.add("hidden");
  refs.rulesPanel.classList.add("hidden");
}

function toggleDrawer(drawerEl) {
  const willOpen = drawerEl.classList.contains("hidden");
  closeAllDrawers();
  if (willOpen) drawerEl.classList.remove("hidden");
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
  closeAllDrawers();
  drawCards(state.player, STARTING_HAND);
  drawCards(state.ai, STARTING_HAND);
  beginTurn("player");
  logEvent("New match started. Classroom Mode active.");
  logEvent(`Theme objective: ${state.matchTheme.label}. ${state.matchTheme.description}`);
  logEvent(`Your Active Author: ${state.player.activeAuthor} (${AUTHOR_PROFILES[state.player.activeAuthor].passive})`);
  logEvent(`AI Active Author: ${state.ai.activeAuthor} (${AUTHOR_PROFILES[state.ai.activeAuthor].passive})`);
  emitSfx("match_start");
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
  emitSfx("turn_start", { side });
  resolveBoardTriggers(side, "onTurnStart", { side });
}

function flashTarget(element) {
  if (!element) return;
  const payload = {
    uid: element.dataset?.cardUid || null,
    side: element.id === "player-panel" ? "player" : element.id === "ai-panel" ? "ai" : null,
    kind: "hit",
  };
  window.dispatchEvent(new CustomEvent(FX_EVENT_NAME, { detail: payload }));
  element.classList.remove("hit");
  void element.offsetWidth;
  element.classList.add("hit");
}

function spawnFloatingFx(text, targetEl, kind = "damage") {
  const payload = {
    text,
    kind,
    uid: targetEl?.dataset?.cardUid || null,
    side: targetEl?.id === "player-panel" ? "player" : targetEl?.id === "ai-panel" ? "ai" : null,
  };
  window.dispatchEvent(new CustomEvent(FX_EVENT_NAME, { detail: payload }));
  if (!targetEl || !DEBUG_DOM_UI) return;
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
  if (!DEBUG_DOM_UI && phaserUiBridge.quizHandler) {
    const result = await phaserUiBridge.quizHandler({
      title,
      question: quiz.question,
      options: quiz.options,
      correctIndex: quiz.correctIndex,
      explanation: quiz.explanation,
    });
    state.pendingQuiz = false;
    render();
    return result;
  }
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
  if (isThemeBonusEnabled()) {
    addKnowledge(ownerKey, 1, `matched theme ${state.matchTheme.label}`);
    spawnFloatingFx("Theme Match  +1 Insp  +1 Knw", panelForOwner(ownerKey), "info");
    return;
  }
  spawnFloatingFx("Theme Match  +1 Insp", panelForOwner(ownerKey), "info");
}

function applyAuthorCharacterRules(ownerKey, card) {
  const owner = state[ownerKey];
  const profile = AUTHOR_PROFILES[owner.activeAuthor];
  if (card.author === owner.activeAuthor) {
    if (isAuthorKnowledgeBonusEnabled()) {
      addKnowledge(ownerKey, 1, `matched active author ${owner.activeAuthor}`);
    }
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
  spawnFloatingFx(`-${cardCost} Insp`, panelForOwner(ownerKey), "info");
  owner.hand.splice(handIndex, 1);

  if (card.type === "character") {
    owner.board.push(card);
    logEvent(`${owner.name} summons ${card.name}.`);
    spawnFloatingFx("Summoned", panelForOwner(ownerKey), "heal");
    emitSfx("card_play_character", { side: ownerKey, card: card.name, rarity: card.rarity });
    applyAuthorCharacterRules(ownerKey, card);
    dispatchCardEvent(ownerKey, card, "onPlay", { phase: "playCard" });
    dispatchCardEvent(ownerKey, card, "onSummon", { phase: "playCard" });
  } else {
    if (hasCardTriggers(card, "onPlay")) {
      dispatchCardEvent(ownerKey, card, "onPlay", { phase: "playCard" });
    } else {
      resolveEffect(ownerKey, card);
    }
    owner.discard.push(card);
    logEvent(`${owner.name} plays ${card.name}.`);
    spawnFloatingFx("Effect Resolved", panelForOwner(ownerKey), "info");
    emitSfx("card_play_spell", { side: ownerKey, card: card.name, rarity: card.rarity });
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
  emitSfx("attack_unit", { attacker: attacker.name, defender: defender.name });
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
  emitSfx("attack_writer", { attacker: attacker.name, damage: attacker.attack });
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
        const defeatContext = { ownerKey: key, preventDiscard: false };
        resolveCardTriggers(key, card, "onDefeat", defeatContext);
        if (!defeatContext.preventDiscard) {
          owner.discard.push(card);
        }
        logEvent(`${card.name} is defeated.`);
        emitSfx("card_defeated", { side: key, card: card.name });
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
    emitSfx("match_end", { winner: state.winner, reason });
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

function updateTurnPanelStyles() {
  refs.playerPanel.classList.remove("active-turn");
  refs.aiPanel.classList.remove("active-turn");
  if (state.winner) return;
  if (state.currentPlayer === "player") refs.playerPanel.classList.add("active-turn");
  if (state.currentPlayer === "ai") refs.aiPanel.classList.add("active-turn");
}

function render() {
  if (!state) return;
  if (!DEBUG_DOM_UI) {
    notifyStateChanged();
    return;
  }
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
  updateTurnPanelStyles();

  renderPlayerHand();
  renderBoard("ai");
  renderBoard("player");
  notifyStateChanged();
}

function buildCardEl(card, options = {}) {
  const node = refs.cardTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.cardUid = card.uid;
  node.dataset.rarity = card.rarity;
  node.classList.add(`rarity-${card.rarity}`);
  node.querySelector(".rarity-badge").textContent = card.rarity;
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
  const total = state.player.hand.length;
  const mid = (total - 1) / 2;

  state.player.hand.forEach((card, index) => {
    const cost = getCardCost(state.player, card);
    const disabled =
      state.winner !== null || state.currentPlayer !== "player" || state.pendingQuiz || cost > state.player.inspiration;

    const cardEl = buildCardEl(card, { disabled });
    const offset = index - mid;
    const fanRotate = total > 1 ? Math.max(-16, Math.min(16, offset * 4.2)) : 0;
    const fanLift = total > 1 ? Math.round(Math.abs(offset) * 2.4) : 0;
    cardEl.style.setProperty("--fan-rotate", `${fanRotate}deg`);
    cardEl.style.setProperty("--fan-lift", `${fanLift}px`);
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
  emitSfx("draw_card", { side: "player" });
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
  resolveBoardTriggers("player", "onTurnEnd", { side: "player" });
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
  emitSfx("draw_card", { side: "ai" });
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
    resolveBoardTriggers("ai", "onTurnEnd", { side: "ai" });
    await runTurnEndQuickCheck("ai");
    if (state.winner) return;
  } else {
    resolveBoardTriggers("ai", "onTurnEnd", { side: "ai" });
  }

  state.turn += 1;
  beginTurn("player");
  render();
}

function selectAttacker(uidValue) {
  if (!state || state.winner || state.pendingQuiz || state.currentPlayer !== "player") return;
  const card = state.player.board.find((c) => c.uid === uidValue);
  if (!card || card.exhausted) return;
  state.selectedAttackerUid = state.selectedAttackerUid === uidValue ? null : uidValue;
  render();
}

function playPlayerHandCard(uidValue) {
  const index = state?.player?.hand?.findIndex((c) => c.uid === uidValue) ?? -1;
  if (index >= 0) {
    return playCard("player", index);
  }
  return Promise.resolve();
}

window.ACGCore = {
  getState: () => stateSnapshot(),
  subscribe(callback) {
    if (typeof callback !== "function") return () => {};
    stateSubscribers.add(callback);
    callback(stateSnapshot());
    return () => stateSubscribers.delete(callback);
  },
  actions: {
    newGame: initGame,
    draw: drawForPlayer,
    endTurn: endPlayerTurn,
    toggleFullscreen: toggleFullscreenMode,
    playHandCard: playPlayerHandCard,
    selectAttacker,
    attackUnit: (defenderUid) => {
      if (!state?.selectedAttackerUid) return;
      attackUnit("player", state.selectedAttackerUid, defenderUid);
    },
    attackWriter: () => {
      if (!state?.selectedAttackerUid) return;
      attackWriter("player", state.selectedAttackerUid);
    },
  },
  constants: {
    STATE_EVENT_NAME,
    FX_EVENT_NAME,
    SFX_EVENT_NAME,
    isFullscreenSupported,
    getFullscreenElement,
  },
  ui: {
    setQuizHandler(handler) {
      phaserUiBridge.quizHandler = typeof handler === "function" ? handler : null;
    },
    setWinnerHandler(handler) {
      phaserUiBridge.winnerHandler = typeof handler === "function" ? handler : null;
    },
  },
};

refs.drawBtn.addEventListener("click", drawForPlayer);
refs.endTurnBtn.addEventListener("click", endPlayerTurn);
refs.toggleLogBtn.addEventListener("click", () => toggleDrawer(refs.logPanel));
refs.toggleTeacherBtn.addEventListener("click", () => toggleDrawer(refs.teacherPanel));
refs.toggleRulesBtn.addEventListener("click", () => toggleDrawer(refs.rulesPanel));
refs.audioToggleBtn.addEventListener("click", toggleSfx);
refs.teacherApplyBtn.addEventListener("click", applyTeacherSettings);
refs.newGameBtn.addEventListener("click", initGame);
refs.playAgainBtn.addEventListener("click", initGame);
window.addEventListener(SFX_EVENT_NAME, handleSfxEvent);
window.addEventListener("pointerdown", unlockAudio, { once: true });
window.addEventListener("keydown", unlockAudio, { once: true });
updateAudioToggleUi();
ensureBuildBadge();
bindViewportState();
runScreenIntro();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

initGame();
