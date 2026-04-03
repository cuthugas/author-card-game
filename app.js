const MAX_INSPIRATION = 5;
const STARTING_REPUTATION = 15;
const STARTING_HAND = 5;
const DEFAULT_KNOWLEDGE_TO_WIN = 10;
const DEFAULT_QUICK_CHECK_EVERY_TURNS = 3;
const DEFAULT_ENABLE_THEME_BONUS = false;
const DEFAULT_ENABLE_AUTHOR_KNOWLEDGE_BONUS = false;
const SFX_EVENT_NAME = "acg:sfx";
const DEBUG_DOM_UI = Boolean(window.__ACG_DEBUG_DOM_UI);
const DEV_MATCH_LOG =
  new URLSearchParams(window.location.search).get("devMatchLog") === "1" ||
  localStorage.getItem("acg_dev_match_log") === "1";
const STATE_EVENT_NAME = "acg:state";
const FX_EVENT_NAME = "acg:fx";
const HAND_REVEAL_EVENT_NAME = "acg:hand-reveal";
const PHONE_LAYOUT_MAX_HEIGHT = 1100;
const PHONE_ROTATE_SHORT_SIDE = 600;
const APP_BUILD_ID = "LOCAL-2026-04-03-B";
window.__ACG_APP_BUILD_ID = APP_BUILD_ID;

const AUTHOR_PROFILES = {
  Shakespeare: { passive: "Tragedy-aligned characters gain +1 ATK when summoned.", bonusTag: "tragedy" },
  "Lewis Carroll": { passive: "Lewis Carroll characters with wonderland themes gain +1 MEM when summoned.", bonusTag: "wonderland" },
};
const SUPPORTED_AUTHORS = Object.keys(AUTHOR_PROFILES);
const DEFAULT_PLAYER_AUTHOR = SUPPORTED_AUTHORS[0] || "Shakespeare";

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
const CORE_SET_KEY = "prototype-core";
const PRIMARY_AUTHOR_KEYS = new Set(["Shakespeare", "Lewis Carroll"]);
const PLAYER_HAND_LIMIT = 6;

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
  handPanel: document.querySelector(".hand-panel"),
  handModeText: document.getElementById("hand-mode-text"),
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
  topbarActions: document.querySelector(".topbar-actions"),
  rotateWarning: document.getElementById("rotate-warning"),
  authorSelectModal: document.getElementById("author-select-modal"),
  playerAuthorSelect: document.getElementById("player-author-select"),
  playerAuthorPassive: document.getElementById("player-author-passive"),
  authorSelectConfirmBtn: document.getElementById("author-select-confirm-btn"),
};

const cardPool = [
  { key: "hamlet", name: "Hamlet", type: "character", author: "Shakespeare", cost: 2, attack: 2, defense: 2, memorability: 3, tags: ["reveal", "knowledge"], themes: ["identity", "ambition", "tragedy"], who: "Prince of Denmark from Shakespeare's tragedy Hamlet.", why: "Turns reflection into insight by reading the situation before acting.", effectText: "On Summon: Reveal a random enemy hand card and gain 1 Knowledge.", triggers: [{ event: "onSummon", effects: [{ type: "revealRandomEnemyHand" }, { type: "gainKnowledge", amount: 1 }] }] },
  { key: "macbeth", name: "Macbeth", type: "character", author: "Shakespeare", cost: 3, attack: 5, defense: 1, memorability: 3, tags: ["pressure"], themes: ["ambition", "power", "tragedy"], who: "Scottish nobleman from Macbeth.", why: "Shows corrupting ambition and consequences of power.", effectText: "None." },
  { key: "juliet", name: "Juliet", type: "character", author: "Shakespeare", cost: 2, attack: 2, defense: 1, memorability: 2, tags: ["defeat_trigger", "pressure"], themes: ["identity", "tragedy"], who: "Juliet Capulet from Romeo and Juliet.", why: "A fragile tragic presence whose defeat still pushes the story toward the opposing writer.", effectText: "On Defeat: Deal 1 damage to the enemy Writer.", triggers: [{ event: "onDefeat", effects: [{ type: "dealDamage", target: "enemyWriter", amount: 1 }] }] },
  { key: "lady_macbeth", name: "Lady Macbeth", type: "character", author: "Shakespeare", cost: 3, attack: 3, defense: 3, memorability: 3, tags: ["pressure", "debuff"], themes: ["ambition", "power", "tragedy"], who: "Macbeth's wife and key instigator.", why: "Applies immediate pressure by unsettling the enemy's best defender.", effectText: "On Summon: Strongest enemy gets -1 ATK and -1 MEM this turn.", triggers: [{ event: "onSummon", effects: [{ type: "weakenHighestEnemyTurn", attack: -1, memorability: -1 }] }] },
  { key: "prospero", name: "Prospero", type: "character", author: "Shakespeare", cost: 4, attack: 4, defense: 4, memorability: 3, tags: ["defeat_trigger", "control"], themes: ["power", "identity", "tragedy"], who: "Exiled duke-magician from The Tempest.", why: "Explores control, forgiveness, and authority.", effectText: "On Defeat: Destroy the weakest enemy character.", triggers: [{ event: "onDefeat", effects: [{ type: "destroyTarget", target: "enemyLowestMem" }] }] },
  { key: "weird_sisters", name: "The Weird Sisters", type: "character", author: "Shakespeare", cost: 3, attack: 2, defense: 1, memorability: 3, tags: ["reveal", "tempo"], themes: ["ambition", "power", "tragedy"], who: "The prophetic witches of Macbeth.", why: "They dig through fate and set up future Shakespeare plays in hand.", effectText: "On Summon: Reveal your top 3 cards. Put the first Shakespeare card into your hand. Discard the rest.", triggers: [{ event: "onSummon", effects: [{ type: "peekTopDeckAuthorToHand", amount: 3, author: "Shakespeare" }] }] },
  { key: "alice", name: "Alice", type: "character", author: "Lewis Carroll", cost: 2, attack: 2, defense: 2, memorability: 4, tags: ["tempo", "reveal"], themes: ["curiosity", "identity", "wonderland"], who: "Young protagonist of Alice's Adventures in Wonderland.", why: "Turns curiosity into momentum once the strange rules of the scene are exposed.", effectText: "On Summon: If you revealed enemy cards this turn, draw 1 card.", triggers: [{ event: "onSummon", effects: [{ type: "drawIfRevealedThisTurn", amount: 1 }] }] },
  { key: "cheshire_cat", name: "Cheshire Cat", type: "character", author: "Lewis Carroll", cost: 2, attack: 2, defense: 2, memorability: 3, tags: ["recursion", "defeat_trigger"], themes: ["curiosity", "identity", "wonderland"], who: "Mysterious speaking cat in Wonderland.", why: "Challenges logic and guides Alice indirectly.", effectText: "On Defeat: Return this card to your hand.", triggers: [{ event: "onDefeat", effects: [{ type: "returnCardToHand", target: "self" }] }] },
  { key: "white_rabbit", name: "White Rabbit", type: "character", author: "Lewis Carroll", cost: 2, attack: 1, defense: 2, memorability: 3, tags: ["tempo"], themes: ["curiosity", "wonderland"], who: "The hurried herald who draws Alice deeper into Wonderland.", why: "Provides momentum and card flow without being a combat-heavy body.", effectText: "On Summon: Draw 1 card.", triggers: [{ event: "onSummon", effects: [{ type: "drawCard", amount: 1 }] }] },
  { key: "bandersnatch", name: "Bandersnatch", type: "character", author: "Lewis Carroll", cost: 3, attack: 3, defense: 2, memorability: 3, tags: ["pressure"], themes: ["curiosity", "wonderland"], who: "The dangerous creature warned about in Jabberwocky.", why: "Acts like a focused skirmisher that can slip past a lone defender without changing the broader combat rules.", effectText: "Can attack the enemy Writer directly if that enemy has exactly 1 character in play." },
  { key: "queen_of_hearts", name: "Queen of Hearts", type: "character", author: "Lewis Carroll", cost: 3, attack: 4, defense: 2, memorability: 2, tags: ["pressure", "reveal"], themes: ["power", "wonderland"], who: "Impulsive monarch from Wonderland.", why: "Turns exposed weakness into sudden writer pressure.", effectText: "On Summon: If you revealed enemy cards this turn, deal 2 damage to the enemy Writer.", triggers: [{ event: "onSummon", effects: [{ type: "dealDamageIfRevealedThisTurn", amount: 2, target: "enemyWriter" }] }] },
  { key: "jabberwock", name: "Jabberwock", type: "character", author: "Lewis Carroll", cost: 4, attack: 4, defense: 3, memorability: 4, tags: ["pressure", "sustain"], themes: ["curiosity", "wonderland"], who: "Nonsense-poem creature from Through the Looking-Glass.", why: "Shows imagination, language play, and mythic tone.", effectText: "None." },
  { key: "iambic_pentameter", name: "Iambic Pentameter", type: "plot", subtype: "literary_device", author: "Neutral", supportFamily: "literary_device", cost: 2, effect: "buff_friendly_top_attack", value: { attack: 2, memorability: 1 }, tags: ["buff", "knowledge"], themes: ["power", "identity"], who: "A poetic meter of five unstressed/stressed pairs per line.", why: "Key rhythm used in Shakespeare's dramatic verse.", effectText: "Best ally gains +2 ATK and +1 MEM.", quiz: { question: "What is iambic pentameter?", options: ["A 10-syllable line with unstressed/stressed pattern", "A 14-line sonnet form only", "A prose speech without rhythm"], correctIndex: 0, explanation: "Iambic pentameter is a 10-syllable line with five iambs." } },
  { key: "soliloquy", name: "Soliloquy", type: "plot", subtype: "literary_device", author: "Neutral", supportFamily: "literary_device", cost: 2, effect: "damage_enemy_top_attack", value: 3, tags: ["control", "knowledge"], themes: ["identity", "ambition"], who: "A speech where a character reveals inner thoughts aloud.", why: "Used in drama to expose motivation and conflict.", effectText: "Deal 3 damage to strongest enemy.", quiz: { question: "What does a soliloquy reveal?", options: ["A character's inner thoughts", "A chorus response", "A stage direction"], correctIndex: 0, explanation: "A soliloquy reveals what a character is thinking privately." } },
  { key: "vorpal_strike", name: "Vorpal Strike", type: "plot", author: "Lewis Carroll", cost: 3, effect: "destroy_enemy_lowest_mem", tags: ["control", "pressure"], themes: ["curiosity", "power"], who: "Reference to the Vorpal Sword in Jabberwocky.", why: "Connects nonsense verse and heroic quest language.", effectText: "Destroy weakest enemy character." },
  { key: "o_happy_dagger", name: "O Happy Dagger", type: "artifact", author: "Shakespeare", cost: 1, effect: "damage_enemy_writer", value: 2, tags: ["pressure"], themes: ["tragedy", "ambition"], who: "Allusion to Juliet's final line in Romeo and Juliet.", why: "Highlights tragic climax and symbolism.", effectText: "Deal 2 to enemy Reputation." },
  { key: "yoricks_skull", name: "Yorick's Skull", type: "artifact", author: "Shakespeare", cost: 2, effect: "resurrect_character", tags: ["recursion"], themes: ["identity", "tragedy"], who: "Skull held by Hamlet in Act V.", why: "Symbolizes mortality and memory.", effectText: "Return a character from discard to hand." },
  { key: "rabbits_watch", name: "Rabbit's Pocket Watch", type: "artifact", author: "Lewis Carroll", cost: 2, effect: "draw_cards", value: 2, tags: ["tempo"], themes: ["curiosity", "wonderland"], who: "White Rabbit's iconic watch.", why: "Introduces urgency and surreal pacing.", effectText: "On Play: Draw 2 cards.", triggers: [{ event: "onPlay", effects: [{ type: "drawCard", amount: 2 }] }] },
  { key: "revision", name: "Revision", type: "plot", author: "Neutral", supportFamily: "writing_support", cost: 2, effect: "heal_self", value: 3, tags: ["sustain"], themes: ["identity"], who: "Reworking ideas after feedback.", why: "Shows growth and deeper understanding in writing.", effectText: "Restore 3 Reputation." },
  { key: "deadline_surge", name: "Deadline Surge", type: "plot", author: "Neutral", supportFamily: "writing_support", cost: 1, effect: "gain_inspiration", value: 2, tags: ["tempo"], themes: ["power", "ambition"], who: "Focused push to finish written work.", why: "Represents urgency and productivity pressure.", effectText: "Gain +2 Inspiration this turn." },
  { key: "hyperbole", name: "Hyperbole", type: "plot", author: "Neutral", cost: 1, effect: "buff_friendly_top_attack", value: { attack: 2, memorability: 0 }, tags: ["buff"], themes: [], who: "Deliberate exaggeration for emphasis.", why: "Boosts a standout idea without adding a new targeting system.", effectText: "Strongest ally gains +2 ATK." },
  { key: "internal_conflict", name: "Internal Conflict", type: "plot", author: "Neutral", cost: 2, effect: "damage_enemy_by_own_attack", tags: ["control"], themes: ["identity", "tragedy"], who: "A clash within a character that turns their own force against them.", why: "Uses current ATK as the damage source with a stable strongest-enemy fallback.", effectText: "Strongest enemy takes damage equal to its current ATK." },
  { key: "exposition", name: "Exposition", type: "plot", author: "Neutral", cost: 1, effect: "draw_and_gain_knowledge", tags: ["tempo", "knowledge"], themes: ["identity"], who: "Context-setting information that helps a reader understand what comes next.", why: "Pairs a small cantrip effect with steady learning progress.", effectText: "On Play: Draw 1 card and gain 1 Knowledge.", triggers: [{ event: "onPlay", effects: [{ type: "drawCard", amount: 1 }, { type: "gainKnowledge", amount: 1 }] }] },
  { key: "suspense", name: "Suspense", type: "plot", author: "Neutral", cost: 1, effect: "reveal_random_enemy_hand", tags: ["reveal"], themes: [], who: "A tactic that heightens uncertainty before the payoff.", why: "Gives quick information without adding risky discard mechanics.", effectText: "On Play: Reveal a random enemy hand card.", triggers: [{ event: "onPlay", effects: [{ type: "revealRandomEnemyHand" }] }] },
  { key: "foreshadowing", name: "Foreshadowing", type: "plot", author: "Neutral", cost: 2, effect: "reveal_enemy_hand_all", tags: ["reveal"], themes: [], who: "Early hints that point toward future events.", why: "Lets you scout the full enemy hand in a simple prototype-safe way.", effectText: "On Play: Reveal all enemy hand cards.", triggers: [{ event: "onPlay", effects: [{ type: "revealEnemyHandAll" }] }] },
  { key: "protagonist", name: "Protagonist", type: "plot", author: "Neutral", cost: 2, effect: "buff_friendly_top_attack", value: { attack: 1, memorability: 1 }, tags: ["buff", "sustain"], themes: [], who: "A central figure receiving narrative focus and support.", why: "Provides a modest spotlight buff using an existing rule path.", effectText: "Strongest ally gains +1 ATK and +1 MEM." },
  { key: "a_pound_of_flesh", name: "A Pound of Flesh", type: "plot", author: "Shakespeare", cost: 2, effect: "weaken_enemy_top_defense_turn", tags: ["debuff", "pressure"], themes: ["power", "tragedy"], who: "A merciless demand from The Merchant of Venice.", why: "Temporarily strips defense from the strongest enemy to open a short attack window.", effectText: "Strongest enemy gets -2 DEF this turn." },
  { key: "eat_me_drink_me", name: "Eat Me / Drink Me", type: "artifact", author: "Lewis Carroll", cost: 2, effect: "swing_target_character_turn", tags: ["buff", "debuff"], themes: ["curiosity", "identity", "wonderland"], who: "Wonderland's size-shifting food and drink.", why: "Uses explicit battlefield targeting so the player can choose who grows or shrinks.", effectText: "Choose a battlefield character. Friendly: +1 ATK/+1 MEM this turn. Enemy: -1 ATK/-1 MEM this turn." },
  { key: "tea_party_chaos", name: "Tea Party Chaos", type: "plot", author: "Lewis Carroll", cost: 3, effect: "weaken_enemy_all", value: 1, tags: ["debuff", "pressure"], themes: ["curiosity", "wonderland"], who: "Mad Tea Party scene.", why: "Highlights absurd logic and social satire.", effectText: "All enemies lose 1 ATK (min 1)." },
  { key: "critical_essay", name: "Critical Essay", type: "plot", author: "Neutral", supportFamily: "classroom_support", cost: 1, effect: "draw_cards", value: 1, tags: ["tempo", "knowledge"], themes: ["identity", "power"], who: "Analytical writing about literature.", why: "Builds evidence-based interpretation.", effectText: "Draw 1 card." },
  { key: "looking_glass_return", name: "Looking-Glass Return", type: "plot", author: "Lewis Carroll", cost: 2, effect: "return_low_cost_character", value: { maxCost: 2 }, tags: ["recursion", "tempo"], themes: ["curiosity", "wonderland"], who: "A mirrored step back into Wonderland's strange loops.", why: "Rebuys a small character to keep Carroll tempo turns and value chains moving.", effectText: "Return a cost 2 or less character from your discard to hand." },
  { key: "ophelia", name: "Ophelia", type: "character", author: "Shakespeare", cost: 2, attack: 1, defense: 1, memorability: 2, tags: ["defeat_trigger", "knowledge"], themes: ["identity", "tragedy"], who: "The tragic noblewoman from Hamlet.", why: "Turns defeat into card flow and literary progress so Shakespeare sacrifice lines have more texture.", effectText: "On Defeat: Draw 1 card and gain 1 Knowledge.", triggers: [{ event: "onDefeat", effects: [{ type: "drawCard", amount: 1 }, { type: "gainKnowledge", amount: 1 }] }] },
  { key: "crowd_murmur", name: "Crowd Murmur", type: "plot", author: "Neutral", cost: 2, effect: "weaken_two_enemies_turn", value: { attack: -1, memorability: -1 }, tags: ["debuff", "control"], themes: ["power"], who: "A spreading wave of doubt that unsettles more than one target.", why: "Gives debuff decks a clean two-target support piece without adding a new subsystem.", effectText: "Two strongest enemies get -1 ATK and -1 MEM this turn." },
  { key: "margin_notes", name: "Margin Notes", type: "plot", author: "Neutral", supportFamily: "classroom_support", cost: 1, effect: "knowledge_burst", value: { gainKnowledge: 1, threshold: 3, damage: 2 }, tags: ["knowledge", "control"], themes: ["identity", "power"], who: "Short observations that become more valuable once enough evidence has been gathered.", why: "Turns knowledge into real board pressure without making the lane too snowbally.", effectText: "Gain 1 Knowledge. If you have 3+ Knowledge, deal 2 damage to the strongest enemy." },
  { key: "read_the_room", name: "Read the Room", type: "plot", author: "Neutral", cost: 1, effect: "reveal_payoff", value: { draw: 1, inspiration: 1 }, tags: ["reveal", "tempo"], themes: ["curiosity", "power"], who: "A quick adjustment once hidden information becomes visible.", why: "Makes reveal cards feel like part of a real engine instead of isolated scouting tools.", effectText: "If you revealed enemy cards this turn, draw 1 card and gain 1 Inspiration. Otherwise, reveal a random enemy hand card." },
  { key: "rough_draft", name: "Rough Draft", type: "plot", author: "Neutral", supportFamily: "writing_support", cost: 2, effect: "peek_top_deck_type_to_hand", value: { count: 3, cardType: "plot" }, tags: ["tempo", "reveal"], themes: ["identity"], who: "A fast first version that helps the next idea surface quickly.", why: "Adds lightweight deck filtering for faster, smoother prototype hands.", effectText: "Reveal your top 3 cards. Put the first plot into your hand. Discard the rest." },
  { key: "stay_of_execution", name: "Stay of Execution", type: "plot", author: "Neutral", cost: 1, effect: "restore_friendly_top_mem", value: 2, tags: ["sustain", "buff"], themes: ["power", "identity"], who: "A brief reprieve that lets a key figure remain in play a little longer.", why: "Helps slower or control-oriented shells preserve board value with a simple effect.", effectText: "Restore 2 MEM to your strongest ally." },
  { key: "dramatic_irony", name: "Dramatic Irony", type: "plot", author: "Neutral", cost: 2, effect: "reveal_and_return_tagged_character", value: { tag: "defeat_trigger" }, tags: ["reveal", "recursion"], themes: ["identity", "tragedy"], who: "The audience sees the pattern before the characters do.", why: "Explicitly bridges Carroll reveal play and Shakespeare defeat-value play without becoming a new faction layer.", effectText: "Reveal all enemy hand cards. Return a defeat-trigger character from your discard to hand." },
  { key: "close_reading", name: "Close Reading", type: "plot", author: "Neutral", supportFamily: "classroom_support", cost: 2, tags: ["knowledge", "tempo"], themes: ["identity", "power"], who: "A careful pass over the text that turns gathered evidence into sharper understanding.", why: "Keeps the knowledge lane's payoff slot while fitting the game's scholarly support tone better than a generic neutral person.", effectText: "On Play: Gain 1 Knowledge. If you have 3+ Knowledge, draw 2 cards.", triggers: [{ event: "onPlay", effects: [{ type: "gainKnowledge", amount: 1 }, { type: "drawCardIfKnowledgeAtLeast", amount: 2, threshold: 3 }] }] },
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
let selectedPlayerAuthor = DEFAULT_PLAYER_AUTHOR;
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
const matchLogState = {
  matchId: null,
  seq: 0,
  events: [],
  finished: false,
  exported: false,
  exportButton: null,
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

function makeMatchId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function currentActorLabel(actor) {
  if (actor === "player") return state?.player?.name || "player";
  if (actor === "ai") return state?.ai?.name || "ai";
  return actor || "";
}

function matchLoggerEnabled() {
  return DEV_MATCH_LOG;
}

function normalizeMatchLogField(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function escapeCsvValue(value) {
  const text = normalizeMatchLogField(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function getMatchLogOwnerKey(owner) {
  if (!state || !owner) return "";
  if (owner === state.player) return "player";
  if (owner === state.ai) return "ai";
  return "";
}

function startMatchLog(context = {}) {
  if (!matchLoggerEnabled()) return;
  matchLogState.matchId = makeMatchId();
  matchLogState.seq = 0;
  matchLogState.events = [];
  matchLogState.finished = false;
  matchLogState.exported = false;
  logMatchEvent({
    actor: "system",
    eventType: "match_start",
    details: context,
  });
}

function logMatchEvent(event = {}) {
  if (!matchLoggerEnabled() || !matchLogState.matchId) return;
  try {
    matchLogState.seq += 1;
    matchLogState.events.push({
      matchId: matchLogState.matchId,
      timestamp: new Date().toISOString(),
      turn: state?.turn ?? "",
      seq: matchLogState.seq,
      actor: currentActorLabel(event.actor),
      eventType: event.eventType || "",
      cardId: event.cardId || "",
      cardName: event.cardName || "",
      sourceZone: event.sourceZone || "",
      targetZone: event.targetZone || "",
      targetCardName: event.targetCardName || "",
      targetPlayer: currentActorLabel(event.targetPlayer),
      value: event.value ?? "",
      details: normalizeMatchLogField(event.details),
      winner: currentActorLabel(event.winner),
      winCondition: event.winCondition || "",
    });
  } catch (error) {
    console.warn("[ACG Match Log] Failed to record event.", error);
  }
}

function buildMatchLogCsv() {
  const columns = [
    "matchId",
    "timestamp",
    "turn",
    "seq",
    "actor",
    "eventType",
    "cardId",
    "cardName",
    "sourceZone",
    "targetZone",
    "targetCardName",
    "targetPlayer",
    "value",
    "details",
    "winner",
    "winCondition",
  ];
  const rows = [columns.join(",")];
  matchLogState.events.forEach((event) => {
    rows.push(columns.map((column) => escapeCsvValue(event[column])).join(","));
  });
  return rows.join("\r\n");
}

function exportMatchLogCsv(trigger = "manual") {
  if (!matchLoggerEnabled() || !matchLogState.matchId || !matchLogState.events.length) return false;
  try {
    const csv = buildMatchLogCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `acg_match_${matchLogState.matchId}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    matchLogState.exported = true;
    console.info(`[ACG Match Log] CSV exported (${trigger}) for match ${matchLogState.matchId}.`);
    return true;
  } catch (error) {
    console.warn("[ACG Match Log] Failed to export CSV.", error);
    return false;
  }
}

function finishMatchLog(context = {}) {
  if (!matchLoggerEnabled() || !matchLogState.matchId || matchLogState.finished) return;
  matchLogState.finished = true;
  logMatchEvent({
    actor: "system",
    eventType: "match_result",
    winner: context.winner || state?.winner || "",
    winCondition: context.winCondition || "",
    details: context.details || "",
  });
  exportMatchLogCsv("match_end");
}

function ensureDevMatchExportButton() {
  if (!matchLoggerEnabled() || !refs.topbarActions || matchLogState.exportButton) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button icon-button secondary";
  button.textContent = "Export CSV";
  button.title = "Export dev match CSV";
  button.addEventListener("click", () => {
    exportMatchLogCsv("manual");
  });
  refs.topbarActions.appendChild(button);
  matchLogState.exportButton = button;
}

function stateSnapshot() {
  if (!state) return null;
  return JSON.parse(JSON.stringify(state));
}

function getRawPendingHandDiscard(gameState = state) {
  return gameState?.pendingHandDiscard || null;
}

function getPendingHandDiscard(ownerKey = "player", gameState = state) {
  const pending = getRawPendingHandDiscard(gameState);
  const owner = gameState?.[ownerKey];
  if (!pending || pending.ownerKey !== ownerKey) return null;
  if (!owner || !Array.isArray(owner.hand)) return null;
  if (!Number.isFinite(pending.handLimit)) return null;
  if (gameState?.currentPlayer !== ownerKey) return null;
  if (owner.hand.length <= pending.handLimit) return null;
  return pending;
}

function getHandDiscardRemaining(ownerKey = "player", gameState = state) {
  const pending = getPendingHandDiscard(ownerKey, gameState);
  if (!pending) return 0;
  const owner = gameState?.[ownerKey];
  return Math.max(0, (owner?.hand?.length || 0) - pending.handLimit);
}

function isHandDiscardActive(ownerKey = "player", gameState = state) {
  return Boolean(getPendingHandDiscard(ownerKey, gameState));
}

function getHandDiscardStatusText(ownerKey = "player", gameState = state) {
  const pending = getPendingHandDiscard(ownerKey, gameState);
  if (!pending) return "";
  const remaining = getHandDiscardRemaining(ownerKey, gameState);
  if (remaining <= 0) return `Hand is back to ${pending.handLimit} cards.`;
  return `Choose ${remaining} more card${remaining === 1 ? "" : "s"} to discard.`;
}

function clearPlayerActionSelections() {
  state.selectedAttackerUid = null;
  clearPendingTargeting();
}

async function maybeResolvePendingHandDiscard(ownerKey = "player") {
  const pending = getRawPendingHandDiscard();
  if (!pending || pending.resolving) return false;
  if (pending.ownerKey !== ownerKey) return false;
  if (getHandDiscardRemaining(ownerKey) > 0) return false;

  pending.resolving = true;
  state.pendingHandDiscard = null;
  logEvent(`Hand limit satisfied. ${ownerKey === "player" ? "Ending turn." : "Continuing."}`);

  if (ownerKey === "player" && pending.reason === "end-turn") {
    render();
    await finishPlayerTurn();
    return true;
  }

  render();
  return true;
}

function enterHandDiscardMode(ownerKey = "player", reason = "end-turn") {
  const owner = state?.[ownerKey];
  if (!owner) return false;
  const overflow = owner.hand.length - PLAYER_HAND_LIMIT;
  if (overflow <= 0) return false;

  clearPlayerActionSelections();
  state.pendingHandDiscard = {
    ownerKey,
    handLimit: PLAYER_HAND_LIMIT,
    reason,
    resolving: false,
  };
  logEvent(`Discard down to ${PLAYER_HAND_LIMIT} cards.`);
  logEvent(getHandDiscardStatusText(ownerKey));
  spawnFloatingFx("Discard down to 6", panelForOwner(ownerKey), "info", { fontSize: "16px", maxWidth: 220 });
  return true;
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
  return { name, reputation: STARTING_REPUTATION, maxInspiration: 0, inspiration: 0, knowledge: 0, activeAuthor, deck: createDeck(activeAuthor), hand: [], board: [], discard: [], hasDrawnThisTurn: false, turnFlags: { revealedEnemyCards: false } };
}

function getDeckIdentity(card) {
  return card?.id || (card?.set && card?.key ? `${card.set}:${card.key}` : card?.key || null);
}

function getDeckCopyLimit(card) {
  if (!card) return Infinity;
  if (Number.isInteger(card.deckLimit) && card.deckLimit > 0) return card.deckLimit;
  if (Number.isInteger(card.maxCopies) && card.maxCopies > 0) return card.maxCopies;
  if (card.cardType === "character" || card.type === "character") return 1;
  return Infinity;
}

function createCardRuntimeMeta(card, overrides = {}) {
  const origin = overrides.origin || (card?.isToken ? "token" : "deck");
  return {
    origin,
    createdBy: overrides.createdBy || null,
    copiedFromId: overrides.copiedFromId || null,
    copiedFromUid: overrides.copiedFromUid || null,
  };
}

function createDeck(activeAuthor = null) {
  const deck = [];
  const copyCounts = new Map();
  const eligibleCards = cardPool.filter((definition) => {
    if (!activeAuthor) return true;
    return definition.author === activeAuthor || definition.author === "Neutral";
  });

  // Deck construction rules only apply while assembling a deck list.
  // Runtime card creation can still produce duplicates later through effects.
  eligibleCards.forEach((definition) => {
    const card = cloneCardTemplate(definition);
    const identity = getDeckIdentity(card);
    const copyLimit = getDeckCopyLimit(card);

    if (!identity || !Number.isFinite(copyLimit)) {
      deck.push(card);
      return;
    }

    const usedCopies = copyCounts.get(identity) || 0;
    if (usedCopies >= copyLimit) return;

    copyCounts.set(identity, usedCopies + 1);
    deck.push(card);
  });

  return shuffle(deck);
}

function inferRarity(card) {
  if (["prospero", "jabberwock", "vorpal_strike"].includes(card.key)) return "legendary";
  if (card.subtype === "literary_device" || card.cost >= 3) return "rare";
  return "common";
}

function slugifyCardMeta(value, fallback = "neutral") {
  return String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || fallback;
}

function normalizeCardType(type = "plot") {
  return String(type || "plot").trim().toLowerCase();
}

function inferCardAffiliation(card) {
  if (card.affiliation) return card.affiliation;
  if (!card.author || card.author === "Neutral") return "neutral";
  if (PRIMARY_AUTHOR_KEYS.has(card.author)) return slugifyCardMeta(card.author);
  return slugifyCardMeta(card.author);
}

const VALID_TRIGGER_EVENTS = new Set(["onPlay", "onSummon", "onDefeat", "onTurnStart", "onTurnEnd"]);
const VALID_TRIGGER_EFFECT_TYPES = new Set([
  "drawCard",
  "gainKnowledge",
  "gainInspiration",
  "dealDamage",
  "heal",
  "buffSelf",
  "returnCardToHand",
  "destroyTarget",
  "revealRandomEnemyHand",
  "revealEnemyHandAll",
  "peekTopDeckAuthorToHand",
  "drawIfRevealedThisTurn",
  "dealDamageIfRevealedThisTurn",
  "drawCardIfKnowledgeAtLeast",
  "weakenHighestEnemyTurn",
]);
const VALID_LEGACY_EFFECTS = new Set([
  "buff_friendly_top_attack",
  "damage_enemy_top_attack",
  "damage_enemy_by_own_attack",
  "destroy_enemy_lowest_mem",
  "damage_enemy_writer",
  "resurrect_character",
  "draw_cards",
  "draw_and_gain_knowledge",
  "heal_self",
  "gain_inspiration",
  "weaken_enemy_all",
  "weaken_enemy_top_defense_turn",
  "reveal_random_enemy_hand",
  "reveal_enemy_hand_all",
  "swing_target_character_turn",
  "return_low_cost_character",
  "weaken_two_enemies_turn",
  "knowledge_burst",
  "reveal_payoff",
  "peek_top_deck_type_to_hand",
  "restore_friendly_top_mem",
  "reveal_and_return_tagged_character",
]);

function isNonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function enrichCardDefinition(card) {
  const normalizedType = normalizeCardType(card.type);
  const normalizedSubtype = card.subtype ? slugifyCardMeta(card.subtype, "") : null;
  const normalizedThemes = card.themes ? [...card.themes] : [];
  const normalizedKeywords = card.keywords ? [...card.keywords] : [];
  const normalizedTags = new Set(card.tags || []);
  if (normalizedSubtype) normalizedTags.add(normalizedSubtype);
  normalizedThemes.forEach((theme) => normalizedTags.add(slugifyCardMeta(theme, theme)));

  return {
    ...card,
    id: card.id || `${CORE_SET_KEY}:${card.key}`,
    type: normalizedType,
    cardType: normalizedType,
    subtype: normalizedSubtype,
    author: card.author || "Neutral",
    affiliation: inferCardAffiliation(card),
    isNeutral: card.isNeutral ?? (!card.author || card.author === "Neutral"),
    maxCopies: Number.isInteger(card.maxCopies) ? card.maxCopies : null,
    deckLimit: Number.isInteger(card.deckLimit) ? card.deckLimit : (Number.isInteger(card.maxCopies) ? card.maxCopies : null),
    rarity: card.rarity || inferRarity(card),
    isToken: Boolean(card.isToken),
    set: card.set || CORE_SET_KEY,
    keywords: normalizedKeywords,
    tags: [...normalizedTags],
    themes: normalizedThemes,
  };
}

function validateCardDefinitions(cards) {
  const warnings = [];
  const keyToIndex = new Map();
  const idToIndex = new Map();
  const nameToIndex = new Map();

  const warn = (card, message) => {
    const label = card?.key ? `${card.key}` : `index ${cards.indexOf(card)}`;
    warnings.push(`[${label}] ${message}`);
  };

  cards.forEach((card, index) => {
    const enriched = enrichCardDefinition(card);

    if (!card?.key) warnings.push(`[index ${index}] missing key`);
    else if (keyToIndex.has(card.key)) warnings.push(`[${card.key}] duplicate key also used at index ${keyToIndex.get(card.key)}`);
    else keyToIndex.set(card.key, index);

    if (!card?.name) warn(card, "missing name");
    else if (nameToIndex.has(card.name)) warnings.push(`[${card.key || index}] duplicate card name '${card.name}' also used at index ${nameToIndex.get(card.name)}`);
    else nameToIndex.set(card.name, index);
    if (!card?.type) warn(card, "missing type");
    if (!enriched.cardType) warn(card, "missing normalized cardType");
    if (card?.type && normalizeCardType(card.type) !== enriched.cardType) {
      warn(card, `type/cardType mismatch after normalization (${card.type} -> ${enriched.cardType})`);
    }
    if (!card?.author) warn(card, "missing author");

    if (!enriched.id) warn(card, "missing id");
    else if (idToIndex.has(enriched.id)) warnings.push(`[${card.key || index}] duplicate id also used at index ${idToIndex.get(enriched.id)}`);
    else idToIndex.set(enriched.id, index);

    if (!Array.isArray(card?.themes ?? [])) warn(card, "themes should be an array");
    if (card?.keywords != null && !Array.isArray(card.keywords)) warn(card, "keywords should be an array when present");
    if (card?.tags != null && !Array.isArray(card.tags)) warn(card, "tags should be an array when present");

    if (!isNonNegativeNumber(Number(card?.cost))) warn(card, "cost should be a non-negative number");
    if (card?.type === "character" || enriched.cardType === "character") {
      if (!isNonNegativeNumber(Number(card?.attack))) warn(card, "character is missing a valid non-negative attack");
      if (!isNonNegativeNumber(Number(card?.defense))) warn(card, "character is missing a valid non-negative defense");
      if (!isNonNegativeNumber(Number(card?.memorability))) warn(card, "character is missing a valid non-negative memorability");
    }

    if (card?.author === "Neutral" && enriched.affiliation !== "neutral") {
      warn(card, `neutral card should normalize to neutral affiliation, got ${enriched.affiliation}`);
    }
    if (enriched.isNeutral && enriched.affiliation !== "neutral") {
      warn(card, `isNeutral card should use neutral affiliation, got ${enriched.affiliation}`);
    }
    if (!enriched.isNeutral && enriched.author === "Neutral") {
      warn(card, "author is Neutral but isNeutral is false");
    }

    if (card?.maxCopies != null && (!Number.isInteger(card.maxCopies) || card.maxCopies < 1)) {
      warn(card, "maxCopies should be a positive integer when present");
    }
    if (card?.deckLimit != null && (!Number.isInteger(card.deckLimit) || card.deckLimit < 1)) {
      warn(card, "deckLimit should be a positive integer when present");
    }
    if ((enriched.cardType === "character") && enriched.maxCopies != null && enriched.maxCopies > 1) {
      warn(card, "character maxCopies is above the default prototype deck rule; this only matters if a deck builder/generator opts into that exception");
    }

    if (card?.effect && !VALID_LEGACY_EFFECTS.has(card.effect)) {
      warn(card, `unknown legacy effect '${card.effect}'`);
    }

    if (card?.triggers != null && !Array.isArray(card.triggers)) {
      warn(card, "triggers should be an array when present");
    }

    (card?.triggers || []).forEach((trigger, triggerIndex) => {
      if (!trigger || typeof trigger !== "object") {
        warn(card, `trigger[${triggerIndex}] is not an object`);
        return;
      }
      if (!trigger.event) warn(card, `trigger[${triggerIndex}] missing event`);
      else if (!VALID_TRIGGER_EVENTS.has(trigger.event)) warn(card, `trigger[${triggerIndex}] uses unknown event '${trigger.event}'`);
      if (!Array.isArray(trigger.effects)) {
        warn(card, `trigger[${triggerIndex}] effects should be an array`);
        return;
      }
      trigger.effects.forEach((effect, effectIndex) => {
        if (!effect || typeof effect !== "object") {
          warn(card, `trigger[${triggerIndex}] effect[${effectIndex}] is not an object`);
          return;
        }
        if (!effect.type) warn(card, `trigger[${triggerIndex}] effect[${effectIndex}] missing type`);
        else if (!VALID_TRIGGER_EFFECT_TYPES.has(effect.type)) {
          warn(card, `trigger[${triggerIndex}] effect[${effectIndex}] uses unknown type '${effect.type}'`);
        }
      });
    });
  });

  const summary = {
    totalCards: cards.length,
    warningCount: warnings.length,
  };

  if (warnings.length) {
    console.groupCollapsed(`[ACG Card Validation] ${warnings.length} warning(s) across ${cards.length} cards`);
    warnings.forEach((warning) => console.warn(warning));
    console.groupEnd();
  } else {
    console.info(`[ACG Card Validation] ${cards.length} cards validated with no warnings.`);
  }

  return summary;
}

const cardValidationReport = validateCardDefinitions(cardPool);
window.__ACGCardValidationReport = cardValidationReport;

function cloneCardTemplate(card, runtimeOverrides = {}) {
  const baseCard = enrichCardDefinition(card);
  const cloned = {
    ...baseCard,
    themes: baseCard.themes ? [...baseCard.themes] : [],
    keywords: baseCard.keywords ? [...baseCard.keywords] : [],
    tags: baseCard.tags ? [...baseCard.tags] : [],
    quiz: card.quiz ? { ...card.quiz, options: [...card.quiz.options] } : null,
    value: card.value && typeof card.value === "object" ? { ...card.value } : card.value,
    triggers: card.triggers ? card.triggers.map((trigger) => ({
      ...trigger,
      effects: (trigger.effects || []).map((effect) => ({
        ...effect,
        value: effect.value && typeof effect.value === "object" ? { ...effect.value } : effect.value,
      })),
    })) : [],
    runtime: createCardRuntimeMeta(baseCard, runtimeOverrides),
  };
  cloned.origin = cloned.runtime.origin;
  cloned.rarity = baseCard.rarity;
  cloned.uid = `${baseCard.key}_${uid++}`;
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
  logMatchEvent({
    actor: ownerKey,
    eventType: "trigger_resolved",
    cardId: sourceCard?.id,
    cardName: sourceCard?.name,
    value: amount,
    details: { triggerType: effect.type, target: effect.target || "" },
  });

  switch (effect.type) {
    case "drawCard":
      {
        const drawn = drawCards(owner, amount);
        if (drawn <= 0) {
          logEvent(`${sourceCard.name} triggers, but ${owner.name} has no cards left to draw.`);
          break;
        }
        spawnFloatingFx(`+${drawn} card`, panelForOwner(ownerKey), "info");
        logEvent(`${owner.name} draws ${drawn} card(s) from ${sourceCard.name}.`);
      }
      break;
    case "gainKnowledge":
      addKnowledge(ownerKey, amount, `${sourceCard.name} trigger`);
      break;
    case "gainInspiration":
      owner.inspiration = Math.min(MAX_INSPIRATION, owner.inspiration + amount);
      spawnFloatingFx(`+${amount} Insp`, panelForOwner(ownerKey), "info");
      logEvent(`${owner.name} gains +${amount} Inspiration from ${sourceCard.name}.`);
      logMatchEvent({ actor: ownerKey, eventType: "inspiration_gained", cardId: sourceCard?.id, cardName: sourceCard?.name, value: amount });
      break;
    case "dealDamage": {
      const targetCard = resolveTriggerTarget(ownerKey, effect, { ...context, sourceCard });
      if (effect.target === "enemyWriter" || (!targetCard && effect.fallbackTarget === "enemyWriter")) {
        enemy.reputation -= amount;
        const panel = panelForOwner(ownerKey === "player" ? "ai" : "player");
        flashTarget(panel);
        spawnFloatingFx(`-${amount}`, panel);
        logEvent(`${sourceCard.name} deals ${amount} damage to ${enemy.name}.`);
        logMatchEvent({ actor: ownerKey, eventType: "damage_dealt", cardId: sourceCard?.id, cardName: sourceCard?.name, targetPlayer: ownerKey === "player" ? "ai" : "player", value: amount, details: { targetType: "writer" } });
        break;
      }
      if (targetCard) {
        targetCard.currentMemorability -= amount;
        const targetEl = cardElementByUid(targetCard.uid);
        flashTarget(targetEl);
        spawnFloatingFx(`-${amount}`, targetEl);
        logEvent(`${sourceCard.name} deals ${amount} damage to ${targetCard.name}.`);
        logMatchEvent({ actor: ownerKey, eventType: "damage_dealt", cardId: sourceCard?.id, cardName: sourceCard?.name, targetCardName: targetCard.name, targetPlayer: ownerKey === "player" ? "ai" : "player", value: amount, details: { targetType: "character" } });
      }
      break;
    }
    case "heal":
      owner.reputation += amount;
      flashTarget(panelForOwner(ownerKey));
      spawnFloatingFx(`+${amount}`, panelForOwner(ownerKey), "heal");
      logEvent(`${owner.name} restores ${amount} Reputation from ${sourceCard.name}.`);
      logMatchEvent({ actor: ownerKey, eventType: "healing", cardId: sourceCard?.id, cardName: sourceCard?.name, value: amount });
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
        void maybeResolvePendingHandDiscard(ownerKey);
        context.preventDiscard = true;
        spawnFloatingFx("Return", panelForOwner(ownerKey), "heal");
        logEvent(`${sourceCard.name} returns to ${owner.name}'s hand.`);
        logMatchEvent({ actor: ownerKey, eventType: "card_returned_to_hand", cardId: sourceCard?.id, cardName: sourceCard?.name, sourceZone: "board", targetZone: "hand" });
      } else {
        const index = owner.discard.findIndex((card) => card.type === "character");
        if (index >= 0) {
          const revived = owner.discard.splice(index, 1)[0];
          revived.currentMemorability = revived.memorability;
          revived.exhausted = false;
          owner.hand.push(revived);
          void maybeResolvePendingHandDiscard(ownerKey);
          spawnFloatingFx("Revive", panelForOwner(ownerKey), "heal");
          logEvent(`${owner.name} returns ${revived.name} to hand via ${sourceCard.name}.`);
          logMatchEvent({ actor: ownerKey, eventType: "card_returned_to_hand", cardId: revived?.id, cardName: revived?.name, sourceZone: "discard", targetZone: "hand", details: { via: sourceCard?.name || "" } });
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
      logMatchEvent({ actor: ownerKey, eventType: "card_destroyed", cardId: sourceCard?.id, cardName: sourceCard?.name, targetCardName: targetCard?.name, targetPlayer: ownerKey === "player" ? "ai" : "player" });
      break;
    }
    case "revealRandomEnemyHand":
      revealEnemyHand(ownerKey, "random", sourceCard?.name);
      break;
    case "revealEnemyHandAll":
      revealEnemyHand(ownerKey, "all", sourceCard?.name);
      break;
    case "peekTopDeckAuthorToHand":
      peekTopDeckAuthorToHand(ownerKey, effect.amount ?? 3, effect.author, sourceCard?.name || "Deck Search");
      break;
    case "drawIfRevealedThisTurn":
      if (!getTurnFlags(ownerKey).revealedEnemyCards) {
        logEvent(`${sourceCard.name} finds no successful reveal to reward this turn.`);
        break;
      }
      {
        const drawn = drawCards(owner, amount);
        if (drawn <= 0) {
          logEvent(`${sourceCard.name} finds revealed information, but ${owner.name} has no cards left to draw.`);
          break;
        }
        spawnFloatingFx(`+${drawn} card`, panelForOwner(ownerKey), "info");
        logEvent(`${sourceCard.name} rewards revealed information with ${drawn} card(s).`);
      }
      break;
    case "dealDamageIfRevealedThisTurn":
      if (!getTurnFlags(ownerKey).revealedEnemyCards) {
        logEvent(`${sourceCard.name} finds no successful reveal to convert into damage this turn.`);
        break;
      }
      if (effect.target === "enemyWriter") {
        enemy.reputation -= amount;
        const panel = panelForOwner(ownerKey === "player" ? "ai" : "player");
        flashTarget(panel);
        spawnFloatingFx(`-${amount}`, panel);
        logEvent(`${sourceCard.name} capitalizes on revealed information and deals ${amount} damage to ${enemy.name}.`);
        logMatchEvent({ actor: ownerKey, eventType: "damage_dealt", cardId: sourceCard?.id, cardName: sourceCard?.name, targetPlayer: ownerKey === "player" ? "ai" : "player", value: amount, details: { targetType: "writer", viaReveal: true } });
      }
      break;
    case "drawCardIfKnowledgeAtLeast": {
      const threshold = Number(effect.threshold ?? 3);
      if (owner.knowledge < threshold) {
        logEvent(`${sourceCard.name} sees ${owner.knowledge} Knowledge; ${threshold}+ is needed for the extra draw.`);
        break;
      }
      const drawn = drawCards(owner, amount);
      if (drawn <= 0) {
        logEvent(`${sourceCard.name} sees ${owner.knowledge} Knowledge, but ${owner.name} has no cards left to draw.`);
        break;
      }
      spawnFloatingFx(`+${drawn} card`, panelForOwner(ownerKey), "info");
      logEvent(`${sourceCard.name} rewards ${owner.name}'s accumulated knowledge with ${drawn} card(s).`);
      break;
    }
    case "weakenHighestEnemyTurn": {
      const targetCard = pickHighestAttack(enemy.board);
      if (!targetCard) {
        logEvent(`${sourceCard.name} finds no enemy character to weaken.`);
        break;
      }
      applyTurnModifier(targetCard, {
        attack: effect.attack ?? 0,
        defense: effect.defense ?? 0,
        memorability: effect.memorability ?? 0,
      }, sourceCard.name);
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

function ownerAndEnemyFor(ownerKey, gameState = state) {
  return {
    owner: gameState?.[ownerKey],
    enemy: ownerKey === "player" ? gameState?.ai : gameState?.player,
  };
}

function getCardPlayBlockReason(ownerKey, card, gameState = state) {
  if (!gameState || !card) return "missing-card";
  const { owner, enemy } = ownerAndEnemyFor(ownerKey, gameState);
  if (!owner || !enemy) return "missing-owner";
  if (gameState.winner) return "game-over";
  if (gameState.pendingQuiz) return "quiz-active";
  if (gameState.pendingTarget) return "targeting-active";
  if (getPendingHandDiscard(ownerKey, gameState)) return "discard-down-active";
  if (gameState.currentPlayer !== ownerKey) return "wrong-turn";

  const cardCost = getCardCost(owner, card);
  if (cardCost > owner.inspiration) return "not-enough-inspiration";

  const friendlyBoard = owner.board || [];
  const enemyBoard = enemy.board || [];
  const enemyHand = enemy.hand || [];
  const friendlyDiscardCharacters = (owner.discard || []).filter((entry) => entry.type === "character");

  switch (card.effect) {
    case "buff_friendly_top_attack":
      if (!friendlyBoard.length) return "needs-friendly-character";
      break;
    case "destroy_enemy_lowest_mem":
    case "damage_enemy_top_attack":
    case "damage_enemy_by_own_attack":
    case "weaken_enemy_top_defense_turn":
      if (!enemyBoard.length) return "needs-enemy-character";
      break;
    case "resurrect_character":
      if (!friendlyDiscardCharacters.length) return "needs-friendly-discard-character";
      break;
    case "reveal_random_enemy_hand":
    case "reveal_enemy_hand_all":
      if (!enemyHand.length) return "needs-enemy-hand-card";
      break;
    case "swing_target_character_turn":
      if (!friendlyBoard.length && !enemyBoard.length) return "needs-battlefield-character";
      break;
    default:
      break;
  }

  return null;
}

function canPlayCard(ownerKey, card, gameState = state) {
  return !getCardPlayBlockReason(ownerKey, card, gameState);
}

function addKnowledge(ownerKey, amount, reason) {
  const owner = state[ownerKey];
  owner.knowledge += amount;
  spawnFloatingFx(`+${amount} Knowledge`, panelForOwner(ownerKey), "heal");
  logEvent(`${owner.name} gains ${amount} Knowledge (${reason}).`);
  logMatchEvent({ actor: ownerKey, eventType: "knowledge_gained", value: amount, details: reason });
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

function getSupportedAuthors() {
  return [...SUPPORTED_AUTHORS];
}

function getRandomAuthor() {
  const authors = getSupportedAuthors();
  return authors[Math.floor(Math.random() * authors.length)] || DEFAULT_PLAYER_AUTHOR;
}

function updateAuthorSelectionPassive() {
  if (!refs.playerAuthorPassive) return;
  const author = refs.playerAuthorSelect?.value || selectedPlayerAuthor;
  const profile = AUTHOR_PROFILES[author];
  refs.playerAuthorPassive.textContent = profile ? `Passive: ${profile.passive}` : "";
}

function populateAuthorSelectionUi() {
  if (!refs.playerAuthorSelect) return;
  refs.playerAuthorSelect.innerHTML = "";
  getSupportedAuthors().forEach((author) => {
    const option = document.createElement("option");
    option.value = author;
    option.textContent = author;
    refs.playerAuthorSelect.appendChild(option);
  });
  refs.playerAuthorSelect.value = selectedPlayerAuthor;
  updateAuthorSelectionPassive();
}

function showAuthorSelection() {
  populateAuthorSelectionUi();
  refs.authorSelectModal?.classList.remove("hidden");
}

function hideAuthorSelection() {
  refs.authorSelectModal?.classList.add("hidden");
}

function startMatchFromSelection() {
  selectedPlayerAuthor = refs.playerAuthorSelect?.value || DEFAULT_PLAYER_AUTHOR;
  initGame(selectedPlayerAuthor, getRandomAuthor());
}

function initGame(playerAuthor = selectedPlayerAuthor, aiAuthor = getRandomAuthor()) {
  selectedPlayerAuthor = playerAuthor;
  state = {
    turn: 1,
    currentPlayer: "player",
    winner: null,
    selectedAttackerUid: null,
    pendingTarget: null,
    pendingHandDiscard: null,
    pendingQuiz: false,
    settings: { ...teacherSettings },
    matchTheme: randomTheme(),
    player: newPlayer("You", playerAuthor),
    ai: newPlayer("AI", aiAuthor),
  };
  prevBoardUids = { player: new Set(), ai: new Set() };
  refs.log.innerHTML = "";
  hideWinnerBanner();
  hideQuizModal();
  hideAuthorSelection();
  closeAllDrawers();
  startMatchLog({
    playerAuthor: state.player.activeAuthor,
    aiAuthor: state.ai.activeAuthor,
    theme: state.matchTheme.label,
    build: APP_BUILD_ID,
  });
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
  const ownerKey = getMatchLogOwnerKey(owner);
  let drawnCount = 0;
  for (let i = 0; i < count; i += 1) {
    if (owner.deck.length === 0) {
      if (owner.discard.length === 0) {
        logEvent(`${owner.name} cannot draw: no cards left.`);
        return drawnCount;
      }
      owner.deck = shuffle(owner.discard);
      owner.discard = [];
      logEvent(`${owner.name} reshuffles discard into deck.`);
    }
    const drawnCard = owner.deck.pop();
    owner.hand.push(drawnCard);
    drawnCount += 1;
    logMatchEvent({
      actor: ownerKey,
      eventType: "card_drawn",
      cardId: drawnCard?.id,
      cardName: drawnCard?.name,
      sourceZone: "deck",
      targetZone: "hand",
      details: { remainingDeck: owner.deck.length },
    });
  }
  void maybeResolvePendingHandDiscard(owner === state?.player ? "player" : owner === state?.ai ? "ai" : "player");
  return drawnCount;
}

function beginTurn(side) {
  clearTurnModifiers();
  clearPendingTargeting();
  state.pendingHandDiscard = null;
  state.currentPlayer = side;
  const owner = state[side];
  resetTurnFlags(side);
  owner.maxInspiration = Math.min(MAX_INSPIRATION, owner.maxInspiration + 1);
  owner.inspiration = owner.maxInspiration;
  owner.hasDrawnThisTurn = false;
  owner.board.forEach((card) => {
    card.exhausted = false;
  });
  state.selectedAttackerUid = null;
  logEvent(`${side === "player" ? "Your turn" : "AI turn"}: Inspiration refilled to ${owner.inspiration}.`);
  logMatchEvent({
    actor: side,
    eventType: "turn_start",
    value: owner.inspiration,
    details: { maxInspiration: owner.maxInspiration },
  });
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

function spawnFloatingFx(text, targetEl, kind = "damage", opts = {}) {
  const payload = {
    text,
    kind,
    uid: targetEl?.dataset?.cardUid || null,
    side: targetEl?.id === "player-panel" ? "player" : targetEl?.id === "ai-panel" ? "ai" : null,
    fontSize: opts.fontSize || null,
    maxWidth: opts.maxWidth || null,
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
  logMatchEvent({
    actor: "player",
    eventType: "question_asked",
    details: { title, question: quiz.question, options: quiz.options },
  });
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
          logMatchEvent({
            actor: "player",
            eventType: "question_answered",
            value: isCorrect ? 1 : 0,
            details: { title, question: quiz.question, selectedIndex: idx, correctIndex: quiz.correctIndex },
          });
          resolve(isCorrect);
        }, 550);
      });
      refs.quizOptions.appendChild(btn);
    });
  });
}

async function resolveKnowledgeCheck(ownerKey, quiz, title) {
  if (ownerKey === "ai") {
    logMatchEvent({
      actor: "ai",
      eventType: "question_asked",
      details: { title, question: quiz.question, options: quiz.options },
    });
    const correct = Math.random() < 0.65;
    if (correct) addKnowledge("ai", 1, "correct literary response");
    logEvent(`AI ${correct ? "answers" : "misses"} a literary check.`);
    logMatchEvent({
      actor: "ai",
      eventType: "question_answered",
      value: correct ? 1 : 0,
      details: { title, question: quiz.question },
    });
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
    logEvent(`${card.name} matches ${state.matchTheme.label} and grants +1 Inspiration and +1 Knowledge.`);
    spawnFloatingFx("Theme Match  +1 Insp  +1 Knw", panelForOwner(ownerKey), "info");
    return;
  }
  logEvent(`${card.name} matches ${state.matchTheme.label} and grants +1 Inspiration.`);
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
  if (state.winner || state.pendingQuiz || state.pendingTarget || isHandDiscardActive(ownerKey)) return;
  const owner = state[ownerKey];
  const card = owner.hand[handIndex];
  if (!card) return;
  if (!canPlayCard(ownerKey, card)) return;
  const cardCost = getCardCost(owner, card);

  owner.inspiration -= cardCost;
  spawnFloatingFx(`-${cardCost} Insp`, panelForOwner(ownerKey), "info");
  logMatchEvent({ actor: ownerKey, eventType: "inspiration_spent", cardId: card?.id, cardName: card?.name, value: cardCost });
  owner.hand.splice(handIndex, 1);
  void maybeResolvePendingHandDiscard(ownerKey);

  if (card.type === "character") {
    owner.board.push(card);
    logEvent(`${owner.name} summons ${card.name}.`);
    logMatchEvent({ actor: ownerKey, eventType: "card_played", cardId: card?.id, cardName: card?.name, sourceZone: "hand", targetZone: "board" });
    spawnFloatingFx("Summoned", panelForOwner(ownerKey), "heal");
    emitSfx("card_play_character", { side: ownerKey, card: card.name, rarity: card.rarity });
    applyAuthorCharacterRules(ownerKey, card);
    dispatchCardEvent(ownerKey, card, "onPlay", { phase: "playCard" });
    dispatchCardEvent(ownerKey, card, "onSummon", { phase: "playCard" });
  } else {
    if (card.effect === "swing_target_character_turn" && ownerKey === "player") {
      startPendingTargeting(ownerKey, card, {
        effect: card.effect,
        prompt: `${card.name}: choose any battlefield character.`,
      });
      return;
    }
    if (hasCardTriggers(card, "onPlay")) {
      dispatchCardEvent(ownerKey, card, "onPlay", { phase: "playCard" });
    } else {
      resolveEffect(ownerKey, card);
    }
    owner.discard.push(card);
    logEvent(`${owner.name} plays ${card.name}.`);
    logMatchEvent({ actor: ownerKey, eventType: "card_played", cardId: card?.id, cardName: card?.name, sourceZone: "hand", targetZone: "discard" });
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
      } else {
        logEvent(`${card.name} finds no friendly character to empower.`);
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
        logEvent(`${card.name} finds no strongest enemy character to hit.`);
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
        logMatchEvent({ actor: ownerKey, eventType: "card_destroyed", cardId: card?.id, cardName: card?.name, targetCardName: target?.name, targetPlayer: ownerKey === "player" ? "ai" : "player" });
      }
      break;
    }
    case "damage_enemy_writer": {
      enemy.reputation -= card.value;
      const panel = panelForOwner(ownerKey === "player" ? "ai" : "player");
      flashTarget(panel);
      spawnFloatingFx(`-${card.value}`, panel);
      logEvent(`${enemy.name} loses ${card.value} Reputation.`);
      logMatchEvent({ actor: ownerKey, eventType: "damage_dealt", cardId: card?.id, cardName: card?.name, targetPlayer: ownerKey === "player" ? "ai" : "player", value: card.value, details: { targetType: "writer" } });
      break;
    }
    case "resurrect_character": {
      const i = owner.discard.findIndex((c) => c.type === "character");
      if (i >= 0) {
        const revived = owner.discard.splice(i, 1)[0];
        revived.currentMemorability = revived.memorability;
        revived.exhausted = false;
        owner.hand.push(revived);
        void maybeResolvePendingHandDiscard(ownerKey);
        spawnFloatingFx("Revive", panelForOwner(ownerKey), "heal");
        logEvent(`${owner.name} returns ${revived.name} to hand.`);
        logMatchEvent({ actor: ownerKey, eventType: "card_returned_to_hand", cardId: revived?.id, cardName: revived?.name, sourceZone: "discard", targetZone: "hand", details: { via: card?.name || "" } });
      }
      break;
    }
    case "draw_cards":
      {
        const drawn = drawCards(owner, card.value);
        if (drawn <= 0) {
          logEvent(`${card.name} resolves, but ${owner.name} has no cards left to draw.`);
          break;
        }
        spawnFloatingFx(`+${drawn} card`, panelForOwner(ownerKey), "info");
        logEvent(`${owner.name} draws ${drawn} card(s).`);
      }
      break;
    case "draw_and_gain_knowledge":
      {
        const drawn = drawCards(owner, 1);
        if (drawn > 0) {
          spawnFloatingFx(`+${drawn} card`, panelForOwner(ownerKey), "info");
        }
        addKnowledge(ownerKey, 1, card.name);
        if (drawn > 0) {
          logEvent(`${owner.name} draws ${drawn} card and gains 1 Knowledge from ${card.name}.`);
        } else {
          logEvent(`${owner.name} gains 1 Knowledge from ${card.name}, but has no cards left to draw.`);
        }
      }
      break;
    case "heal_self":
      owner.reputation += card.value;
      flashTarget(panelForOwner(ownerKey));
      spawnFloatingFx(`+${card.value}`, panelForOwner(ownerKey), "heal");
      logEvent(`${owner.name} restores ${card.value} Reputation.`);
      logMatchEvent({ actor: ownerKey, eventType: "healing", cardId: card?.id, cardName: card?.name, value: card.value });
      break;
    case "gain_inspiration":
      owner.inspiration = Math.min(MAX_INSPIRATION, owner.inspiration + card.value);
      spawnFloatingFx(`+${card.value} Insp`, panelForOwner(ownerKey), "info");
      logEvent(`${owner.name} gains +${card.value} Inspiration.`);
      logMatchEvent({ actor: ownerKey, eventType: "inspiration_gained", cardId: card?.id, cardName: card?.name, value: card.value });
      break;
    case "weaken_enemy_all":
      enemy.board.forEach((c) => {
        c.attack = Math.max(1, c.attack - card.value);
      });
      logEvent(`${enemy.name}'s team loses ${card.value} ATK.`);
      break;
    case "damage_enemy_by_own_attack": {
      const target = pickHighestAttack(enemy.board);
      if (!target) {
        logEvent(`${card.name} finds no enemy character in conflict.`);
        break;
      }
      const damage = Math.max(0, target.attack);
      target.currentMemorability -= damage;
      flashTarget(cardElementByUid(target.uid));
      spawnFloatingFx(`-${damage}`, cardElementByUid(target.uid));
      logEvent(`${card.name} causes ${target.name} to take ${damage} damage from its own ATK.`);
      logMatchEvent({ actor: ownerKey, eventType: "damage_dealt", cardId: card?.id, cardName: card?.name, targetCardName: target?.name, targetPlayer: ownerKey === "player" ? "ai" : "player", value: damage, details: { targetType: "character" } });
      break;
    }
    case "weaken_enemy_top_defense_turn": {
      const target = pickHighestAttack(enemy.board);
      if (!target) {
        logEvent(`${card.name} finds no enemy character to weaken.`);
        break;
      }
      applyTurnModifier(target, { defense: -2 }, card.name);
      break;
    }
    case "swing_target_character_turn": {
      const enemyTarget = pickHighestAttack(enemy.board);
      if (!enemyTarget) {
        const friendlyTarget = pickHighestAttack(owner.board);
        if (!friendlyTarget) {
          logEvent(`${card.name} finds no character to affect.`);
          break;
        }
        applyTurnModifier(friendlyTarget, { attack: 1, memorability: 1 }, card.name);
        break;
      }
      applyTurnModifier(enemyTarget, { attack: -1, memorability: -1 }, card.name);
      break;
    }
    case "reveal_random_enemy_hand":
      revealEnemyHand(ownerKey, "random");
      break;
    case "reveal_enemy_hand_all":
      revealEnemyHand(ownerKey, "all");
      break;
    case "return_low_cost_character": {
      const maxCost = Number(card.value?.maxCost ?? 2);
      const revived = findDiscardCharacter(owner, { maxCost });
      if (!revived) {
        logEvent(`${card.name} finds no cost ${maxCost} or less character in discard.`);
        break;
      }
      const index = owner.discard.findIndex((entry) => entry.uid === revived.uid);
      if (index < 0) break;
      const [picked] = owner.discard.splice(index, 1);
      picked.currentMemorability = picked.memorability;
      picked.exhausted = false;
      owner.hand.push(picked);
      void maybeResolvePendingHandDiscard(ownerKey);
      spawnFloatingFx("Reclaimed", panelForOwner(ownerKey), "heal");
      logEvent(`${owner.name} returns ${picked.name} to hand with ${card.name}.`);
      logMatchEvent({ actor: ownerKey, eventType: "card_returned_to_hand", cardId: picked?.id, cardName: picked?.name, sourceZone: "discard", targetZone: "hand", details: { via: card?.name || "" } });
      break;
    }
    case "weaken_two_enemies_turn": {
      const targets = pickHighestAttackTargets(enemy.board, 2);
      if (!targets.length) {
        logEvent(`${card.name} finds no enemies to unsettle.`);
        break;
      }
      targets.forEach((target) => {
        applyTurnModifier(target, { attack: card.value?.attack ?? -1, memorability: card.value?.memorability ?? -1 }, card.name);
      });
      break;
    }
    case "knowledge_burst": {
      const gainKnowledge = Number(card.value?.gainKnowledge ?? 1);
      const threshold = Number(card.value?.threshold ?? 3);
      const damage = Number(card.value?.damage ?? 2);
      addKnowledge(ownerKey, gainKnowledge, card.name);
      if (owner.knowledge < threshold) {
        logEvent(`${card.name} is building toward a bigger payoff.`);
        break;
      }
      const target = pickHighestAttack(enemy.board);
      if (!target) {
        logEvent(`${card.name} finds no strongest enemy to annotate.`);
        break;
      }
      target.currentMemorability -= damage;
      flashTarget(cardElementByUid(target.uid));
      spawnFloatingFx(`-${damage}`, cardElementByUid(target.uid));
      logEvent(`${card.name} cashes in knowledge and hits ${target.name} for ${damage}.`);
      logMatchEvent({ actor: ownerKey, eventType: "damage_dealt", cardId: card?.id, cardName: card?.name, targetCardName: target?.name, targetPlayer: ownerKey === "player" ? "ai" : "player", value: damage, details: { targetType: "character", viaKnowledge: true } });
      break;
    }
    case "reveal_payoff":
      if (getTurnFlags(ownerKey).revealedEnemyCards) {
        const drawAmount = Number(card.value?.draw ?? 1);
        const inspirationAmount = Number(card.value?.inspiration ?? 1);
        const drawn = drawCards(owner, drawAmount);
        owner.inspiration = Math.min(MAX_INSPIRATION, owner.inspiration + inspirationAmount);
        if (drawn > 0) {
          spawnFloatingFx(`+${drawn} card`, panelForOwner(ownerKey), "info");
        }
        spawnFloatingFx(`+${inspirationAmount} Insp`, panelForOwner(ownerKey), "heal");
        if (drawn > 0) {
          logEvent(`${card.name} rewards revealed information with ${drawn} card(s) and ${inspirationAmount} Inspiration.`);
        } else {
          logEvent(`${card.name} rewards revealed information with ${inspirationAmount} Inspiration, but no card draw was possible.`);
        }
        logMatchEvent({ actor: ownerKey, eventType: "inspiration_gained", cardId: card?.id, cardName: card?.name, value: inspirationAmount, details: { via: "reveal_payoff" } });
        break;
      }
      revealEnemyHand(ownerKey, "random", card.name);
      break;
    case "peek_top_deck_type_to_hand":
      peekTopDeckTypeToHand(ownerKey, Number(card.value?.count ?? 3), card.value?.cardType || "plot", card.name);
      break;
    case "restore_friendly_top_mem": {
      const target = pickHighestAttack(owner.board);
      if (!target) {
        logEvent(`${card.name} finds no ally to protect.`);
        break;
      }
      const amount = Number(card.value ?? 2);
      const before = target.currentMemorability;
      target.currentMemorability = Math.min(target.memorability, target.currentMemorability + amount);
      const restored = Math.max(0, target.currentMemorability - before);
      if (!restored) {
        logEvent(`${card.name} finds ${target.name} already at full memorability.`);
        break;
      }
      flashTarget(cardElementByUid(target.uid));
      spawnFloatingFx(`+${restored} MEM`, cardElementByUid(target.uid), "heal");
      logEvent(`${card.name} restores ${restored} MEM to ${target.name}.`);
      break;
    }
    case "reveal_and_return_tagged_character": {
      revealEnemyHand(ownerKey, "all", card.name);
      const requiredTag = card.value?.tag || "defeat_trigger";
      const revived = findDiscardCharacter(owner, { requiredTag });
      if (!revived) {
        logEvent(`${card.name} finds no ${requiredTag} character in discard.`);
        break;
      }
      const index = owner.discard.findIndex((entry) => entry.uid === revived.uid);
      if (index < 0) break;
      const [picked] = owner.discard.splice(index, 1);
      picked.currentMemorability = picked.memorability;
      picked.exhausted = false;
      owner.hand.push(picked);
      void maybeResolvePendingHandDiscard(ownerKey);
      spawnFloatingFx("Irony", panelForOwner(ownerKey), "heal");
      logEvent(`${card.name} returns ${picked.name} to ${owner.name}'s hand.`);
      logMatchEvent({ actor: ownerKey, eventType: "card_returned_to_hand", cardId: picked?.id, cardName: picked?.name, sourceZone: "discard", targetZone: "hand", details: { via: card?.name || "", requiredTag } });
      break;
    }
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

function pickHighestAttackTargets(cards, count = 1) {
  if (!cards.length || count <= 0) return [];
  return [...cards]
    .sort((a, b) => {
      if (b.attack !== a.attack) return b.attack - a.attack;
      return (b.currentMemorability || b.memorability || 0) - (a.currentMemorability || a.memorability || 0);
    })
    .slice(0, count);
}

function findDiscardCharacter(owner, options = {}) {
  if (!owner?.discard?.length) return null;
  const { maxCost = Infinity, requiredTag = null } = options;
  const candidates = owner.discard.filter((card) => {
    if (card?.type !== "character") return false;
    if (Number.isFinite(maxCost) && Number(card.cost) > maxCost) return false;
    if (requiredTag && !(card.tags || []).includes(requiredTag)) return false;
    return true;
  });
  if (!candidates.length) return null;
  return [...candidates].sort((a, b) => {
    if ((a.cost || 0) !== (b.cost || 0)) return (a.cost || 0) - (b.cost || 0);
    return (a.memorability || 0) - (b.memorability || 0);
  })[0];
}

function getTurnFlags(ownerKey) {
  if (!state?.[ownerKey]) return { revealedEnemyCards: false };
  state[ownerKey].turnFlags = state[ownerKey].turnFlags || { revealedEnemyCards: false };
  return state[ownerKey].turnFlags;
}

function resetTurnFlags(ownerKey) {
  if (!state?.[ownerKey]) return;
  state[ownerKey].turnFlags = { revealedEnemyCards: false };
}

function mapCardForReveal(card) {
  return {
    id: card.id,
    uid: card.uid,
    key: card.key,
    name: card.name,
    type: card.type,
    cardType: card.cardType || card.type,
    subtype: card.subtype || null,
    author: card.author,
    affiliation: card.affiliation || inferCardAffiliation(card),
    isNeutral: Boolean(card.isNeutral),
    cost: card.cost,
    playCost: card.cost,
    attack: card.attack || 0,
    defense: card.defense || 0,
    memorability: card.currentMemorability || card.memorability || 0,
    effectText: card.effectText || "",
    source: card.who || "",
    functionText: card.why || "",
    exhausted: Boolean(card.exhausted),
    rarity: card.rarity || "common",
    set: card.set || CORE_SET_KEY,
    keywords: card.keywords ? [...card.keywords] : [],
    tags: card.tags ? [...card.tags] : [],
    themes: card.themes ? [...card.themes] : [],
    matchesTheme: false,
  };
}

function showTemporaryCardReveal(title, side, cards = []) {
  window.dispatchEvent(new CustomEvent(HAND_REVEAL_EVENT_NAME, {
    detail: {
      title,
      side,
      cards: cards.map(mapCardForReveal),
    },
  }));
}

function ownerKeyForCard(card) {
  if (!state || !card?.uid) return "player";
  if (state.player.board.some((entry) => entry.uid === card.uid) || state.player.hand.some((entry) => entry.uid === card.uid)) return "player";
  if (state.ai.board.some((entry) => entry.uid === card.uid) || state.ai.hand.some((entry) => entry.uid === card.uid)) return "ai";
  return "player";
}

function findBattlefieldCard(uidValue) {
  return state.player.board.find((card) => card.uid === uidValue) || state.ai.board.find((card) => card.uid === uidValue) || null;
}

function clearPendingTargeting() {
  state.pendingTarget = null;
}

function startPendingTargeting(ownerKey, sourceCard, config = {}) {
  state.selectedAttackerUid = null;
  state.pendingTarget = {
    ownerKey,
    sourceUid: sourceCard.uid,
    sourceName: sourceCard.name,
    sourceCard,
    effect: config.effect || sourceCard.effect || null,
    prompt: config.prompt || `Choose a target for ${sourceCard.name}.`,
  };
  spawnFloatingFx("Choose target", panelForOwner(ownerKey), "info");
  logEvent(state.pendingTarget.prompt);
  render();
}

function applyTurnModifier(card, modifier, sourceName) {
  if (!card) return;
  card.turnModifiers = card.turnModifiers || { attack: 0, defense: 0, memorability: 0 };

  if (modifier.attack) {
    card.attack = Math.max(0, card.attack + modifier.attack);
    card.turnModifiers.attack += modifier.attack;
  }
  if (modifier.defense) {
    card.defense = Math.max(0, card.defense + modifier.defense);
    card.turnModifiers.defense += modifier.defense;
  }
  if (modifier.memorability) {
    card.currentMemorability = Math.max(0, card.currentMemorability + modifier.memorability);
    card.turnModifiers.memorability += modifier.memorability;
  }

  const parts = [];
  if (modifier.attack) parts.push(`${modifier.attack > 0 ? "+" : ""}${modifier.attack} ATK`);
  if (modifier.defense) parts.push(`${modifier.defense > 0 ? "+" : ""}${modifier.defense} DEF`);
  if (modifier.memorability) parts.push(`${modifier.memorability > 0 ? "+" : ""}${modifier.memorability} MEM`);
  const summary = parts.join(" ");
  const targetEl = cardElementByUid(card.uid);
  const side = ownerKeyForCard(card);
  flashTarget(targetEl);
  spawnFloatingFx(summary, targetEl || panelForOwner(side), modifier.attack < 0 || modifier.defense < 0 || modifier.memorability < 0 ? "damage" : "heal", {
    fontSize: "17px",
    maxWidth: 220,
  });
  logEvent(`${card.name} is affected by ${sourceName}: ${summary} this turn.`);
  logMatchEvent({
    actor: side,
    eventType: "stat_modified",
    cardId: card?.id,
    cardName: card?.name,
    value: summary,
    details: { sourceName, modifier },
  });
}

function clearTurnModifiers() {
  ["player", "ai"].forEach((side) => {
    state[side].board.forEach((card) => {
      if (!card.turnModifiers) return;
      const { attack = 0, defense = 0, memorability = 0 } = card.turnModifiers;
      if (attack) card.attack = Math.max(0, card.attack - attack);
      if (defense) card.defense = Math.max(0, card.defense - defense);
      if (memorability) card.currentMemorability = Math.max(0, card.currentMemorability - memorability);
      card.turnModifiers = null;
    });
  });
}

function peekTopDeckAuthorToHand(ownerKey, count, authorName, sourceName) {
  const owner = state[ownerKey];
  const side = ownerKey;
  if (!owner.deck.length) {
    logEvent(`${sourceName} finds no cards in ${owner.name}'s deck.`);
    spawnFloatingFx("No deck", panelForOwner(ownerKey), "info");
    showTemporaryCardReveal(`${sourceName}: ${owner.name}'s top deck`, side, []);
    return;
  }

  const revealCount = Math.min(count, owner.deck.length);
  const startIndex = owner.deck.length - revealCount;
  const revealed = owner.deck.splice(startIndex, revealCount).reverse();
  showTemporaryCardReveal(`${sourceName}: top ${revealCount} cards`, side, revealed);

  const matchIndex = revealed.findIndex((card) => card.author === authorName);
  if (matchIndex >= 0) {
    const picked = revealed.splice(matchIndex, 1)[0];
    owner.hand.push(picked);
    void maybeResolvePendingHandDiscard(ownerKey);
    spawnFloatingFx(`+${picked.name}`, panelForOwner(ownerKey), "heal", { fontSize: "15px", maxWidth: 220 });
    logEvent(`${sourceName} adds ${picked.name} to ${owner.name}'s hand.`);
  } else {
    logEvent(`${sourceName} finds no ${authorName} card among the top ${revealCount}.`);
  }

  owner.discard.push(...revealed);
  if (revealed.length) {
    logEvent(`${sourceName} discards ${revealed.map((card) => card.name).join(", ")}.`);
    revealed.forEach((card) => {
      logMatchEvent({
        actor: ownerKey,
        eventType: "card_discarded",
        cardId: card?.id,
        cardName: card?.name,
        sourceZone: "deck",
        targetZone: "discard",
        details: { via: sourceName },
      });
    });
  }
}

function peekTopDeckTypeToHand(ownerKey, count, cardType, sourceName) {
  const owner = state[ownerKey];
  const side = ownerKey;
  if (!owner.deck.length) {
    logEvent(`${sourceName} finds no cards in ${owner.name}'s deck.`);
    spawnFloatingFx("No deck", panelForOwner(ownerKey), "info");
    showTemporaryCardReveal(`${sourceName}: ${owner.name}'s top deck`, side, []);
    return;
  }

  const revealCount = Math.min(count, owner.deck.length);
  const startIndex = owner.deck.length - revealCount;
  const revealed = owner.deck.splice(startIndex, revealCount).reverse();
  showTemporaryCardReveal(`${sourceName}: top ${revealCount} cards`, side, revealed);

  const matchIndex = revealed.findIndex((card) => card.type === cardType || card.cardType === cardType);
  if (matchIndex >= 0) {
    const picked = revealed.splice(matchIndex, 1)[0];
    owner.hand.push(picked);
    void maybeResolvePendingHandDiscard(ownerKey);
    spawnFloatingFx(`+${picked.name}`, panelForOwner(ownerKey), "heal", { fontSize: "15px", maxWidth: 220 });
    logEvent(`${sourceName} adds ${picked.name} to ${owner.name}'s hand.`);
  } else {
    logEvent(`${sourceName} finds no ${cardType} card among the top ${revealCount}.`);
  }

  owner.discard.push(...revealed);
  if (revealed.length) {
    logEvent(`${sourceName} discards ${revealed.map((card) => card.name).join(", ")}.`);
    revealed.forEach((card) => {
      logMatchEvent({
        actor: ownerKey,
        eventType: "card_discarded",
        cardId: card?.id,
        cardName: card?.name,
        sourceZone: "deck",
        targetZone: "discard",
        details: { via: sourceName },
      });
    });
  }
}

function revealEnemyHand(ownerKey, mode = "all", sourceName = "Reveal") {
  const enemy = ownerKey === "player" ? state.ai : state.player;
  const enemySide = ownerKey === "player" ? "ai" : "player";
  const panel = panelForOwner(enemySide);
  if (!enemy.hand.length) {
    logEvent(`${sourceName}: ${enemy.name} has no cards in hand.`);
    spawnFloatingFx("No hand", panel, "info");
    showTemporaryCardReveal(`${sourceName}: ${enemy.name}'s hand`, enemySide, []);
    return;
  }
  getTurnFlags(ownerKey).revealedEnemyCards = true;

  if (mode === "random") {
    const revealed = enemy.hand[Math.floor(Math.random() * enemy.hand.length)];
    spawnFloatingFx(revealed.name, panel, "info");
    logEvent(`${sourceName}: ${enemy.name} reveals ${revealed.name}.`);
    showTemporaryCardReveal(`${sourceName}: ${enemy.name} reveals`, enemySide, [revealed]);
    return;
  }

  const names = enemy.hand.map((card) => card.name).join(", ");
  spawnFloatingFx(`${enemy.hand.length} cards`, panel, "info");
  logEvent(`${sourceName}: ${enemy.name}'s hand is ${names}.`);
  showTemporaryCardReveal(`${sourceName}: ${enemy.name}'s hand`, enemySide, enemy.hand);
}

function isBandersnatch(card) {
  return card?.id === `${CORE_SET_KEY}:bandersnatch` || card?.key === "bandersnatch";
}

function canAttackWriterDirectly(attackerOwnerKey, attackerUid) {
  const attackerOwner = state?.[attackerOwnerKey];
  const defenderOwner = attackerOwnerKey === "player" ? state?.ai : state?.player;
  const attacker = attackerOwner?.board?.find((card) => card.uid === attackerUid);
  if (!attacker || attacker.exhausted || !defenderOwner) return false;
  if (defenderOwner.board.length === 0) return true;
  return isBandersnatch(attacker) && defenderOwner.board.length === 1;
}

function attackUnit(attackerOwnerKey, attackerUid, defenderUid) {
  if (state.winner || state.pendingQuiz) return;
  if (attackerOwnerKey === "player" && isHandDiscardActive("player")) return;
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
  logMatchEvent({
    actor: attackerOwnerKey,
    eventType: "damage_dealt",
    cardId: attacker?.id,
    cardName: attacker?.name,
    targetCardName: defender?.name,
    targetPlayer: attackerOwnerKey === "player" ? "ai" : "player",
    value: attackerDamage,
    details: { counterDamage: defenderDamage },
  });
  emitSfx("attack_unit", { attacker: attacker.name, defender: defender.name });
  cleanupDefeated();
  checkWinner();
  render();
}

function attackWriter(attackerOwnerKey, attackerUid) {
  if (state.winner || state.pendingQuiz) return;
  if (attackerOwnerKey === "player" && isHandDiscardActive("player")) return;
  const attackerOwner = state[attackerOwnerKey];
  const defenderOwner = attackerOwnerKey === "player" ? state.ai : state.player;
  const attacker = attackerOwner.board.find((c) => c.uid === attackerUid);
  if (!attacker || !canAttackWriterDirectly(attackerOwnerKey, attackerUid)) return;

  defenderOwner.reputation -= attacker.attack;
  attacker.exhausted = true;
  state.selectedAttackerUid = null;
  const targetPanel = panelForOwner(attackerOwnerKey === "player" ? "ai" : "player");
  flashTarget(targetPanel);
  spawnFloatingFx(`-${attacker.attack}`, targetPanel);
  if (isBandersnatch(attacker) && defenderOwner.board.length === 1) {
    logEvent(`${attacker.name} slips past the lone defender and attacks Writer directly for ${attacker.attack}.`);
  } else {
    logEvent(`${attacker.name} attacks Writer directly for ${attacker.attack}.`);
  }
  logMatchEvent({
    actor: attackerOwnerKey,
    eventType: "damage_dealt",
    cardId: attacker?.id,
    cardName: attacker?.name,
    targetPlayer: attackerOwnerKey === "player" ? "ai" : "player",
    value: attacker.attack,
    details: { targetType: "writer" },
  });
  emitSfx("attack_writer", { attacker: attacker.name, damage: attacker.attack });
  checkWinner();
  render();
}

function resolvePendingTarget(targetUid) {
  const pending = state.pendingTarget;
  if (!pending || state.winner || state.pendingQuiz || isHandDiscardActive(pending.ownerKey)) return;
  const target = findBattlefieldCard(targetUid);
  if (!target || target.type !== "character") return;

  if (pending.effect === "swing_target_character_turn") {
    const sourceCard = pending.sourceCard || { name: pending.sourceName, themes: [] };
    const targetSide = ownerKeyForCard(target);
    const friendly = targetSide === pending.ownerKey;
    applyTurnModifier(
      target,
      friendly ? { attack: 1, memorability: 1 } : { attack: -1, memorability: -1 },
      pending.sourceName
    );
    state[pending.ownerKey].discard.push(sourceCard);
    logEvent(`${state[pending.ownerKey].name} plays ${pending.sourceName}.`);
    logEvent(`${pending.sourceName} ${friendly ? "empowers" : "shrinks"} ${target.name}.`);
    spawnFloatingFx("Effect Resolved", panelForOwner(pending.ownerKey), "info");
    emitSfx("card_play_spell", { side: pending.ownerKey, card: pending.sourceName, rarity: sourceCard.rarity });
    applyThemeObjective(pending.ownerKey, sourceCard);
    clearPendingTargeting();
    cleanupDefeated();
    checkWinner();
    render();
  }
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
  let foundDefeated = false;

  do {
    foundDefeated = false;

    ["player", "ai"].forEach((key) => {
      const owner = state[key];
      const survivors = [];

      owner.board.forEach((card) => {
        if (card.currentMemorability <= 0) {
          foundDefeated = true;
          playLeaveFx(card.uid, key);
          const defeatContext = { ownerKey: key, preventDiscard: false };
          resolveCardTriggers(key, card, "onDefeat", defeatContext);
          if (!defeatContext.preventDiscard) {
            owner.discard.push(card);
          }
          logEvent(`${card.name} is defeated.`);
          logMatchEvent({
            actor: key,
            eventType: "card_defeated",
            cardId: card?.id,
            cardName: card?.name,
            sourceZone: "board",
            targetZone: defeatContext.preventDiscard ? "" : "discard",
          });
          emitSfx("card_defeated", { side: key, card: card.name });
        } else {
          survivors.push(card);
        }
      });

      owner.board = survivors;
    });
  } while (foundDefeated);
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
    finishMatchLog({
      winner: state.winner,
      winCondition: reason,
      details: {
        playerReputation: state.player.reputation,
        aiReputation: state.ai.reputation,
        playerKnowledge: state.player.knowledge,
        aiKnowledge: state.ai.knowledge,
      },
    });
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
  const playerDiscarding = isHandDiscardActive("player");
  const discardStatusText = getHandDiscardStatusText("player");
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
    : playerDiscarding
      ? `Discard down to ${PLAYER_HAND_LIMIT} cards`
    : state.currentPlayer === "player"
      ? "Your Main Phase"
      : "AI Thinking...";
  refs.themeLabel.textContent = state.matchTheme.label;

  refs.drawBtn.disabled =
    state.winner !== null || state.currentPlayer !== "player" || state.player.hasDrawnThisTurn || state.pendingQuiz || state.pendingTarget || playerDiscarding;
  refs.endTurnBtn.disabled = state.winner !== null || state.currentPlayer !== "player" || state.pendingQuiz || state.pendingTarget || playerDiscarding;
  refs.handModeText.textContent = playerDiscarding ? `Discard down to ${PLAYER_HAND_LIMIT} cards. ${discardStatusText}` : "";
  refs.handPanel.classList.toggle("discard-down-active", playerDiscarding);
  refs.playerHandCards.classList.toggle("discard-down-active", playerDiscarding);

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
  if (options.discardable) node.classList.add("discardable");
  if (options.selectedAttacker) node.classList.add("selected-attacker");
  if (options.entering) node.classList.add("entering");
  if (card.type === "character" && card.exhausted) node.classList.add("exhausted");
  return node;
}

function renderPlayerHand() {
  refs.playerHandCards.innerHTML = "";
  const total = state.player.hand.length;
  const mid = (total - 1) / 2;
  const playerDiscarding = isHandDiscardActive("player");

  state.player.hand.forEach((card, index) => {
    const disabled = playerDiscarding ? false : !canPlayCard("player", card);

    const cardEl = buildCardEl(card, { disabled, discardable: playerDiscarding });
    const offset = index - mid;
    const fanRotate = total > 1 ? Math.max(-16, Math.min(16, offset * 4.2)) : 0;
    const fanLift = total > 1 ? Math.round(Math.abs(offset) * 2.4) : 0;
    cardEl.style.setProperty("--fan-rotate", `${fanRotate}deg`);
    cardEl.style.setProperty("--fan-lift", `${fanLift}px`);
    cardEl.addEventListener("click", () => {
      if (disabled) return;
      cardEl.classList.add("leaving");
      setTimeout(() => {
        if (playerDiscarding) {
          discardPlayerHandCard(card.uid);
          return;
        }
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
    const pendingTargeting = Boolean(state.pendingTarget?.effect === "swing_target_character_turn");
    const canPickAsAttacker =
      side === "player" && state.currentPlayer === "player" && !state.winner && !state.pendingQuiz && !state.pendingTarget && !isHandDiscardActive("player") && !card.exhausted;
    const canPickAsDefender =
      side === "ai" && state.currentPlayer === "player" && !state.winner && !state.pendingQuiz && !state.pendingTarget && !isHandDiscardActive("player") && Boolean(state.selectedAttackerUid);
    const canPickAsCardTarget =
      pendingTargeting && state.currentPlayer === "player" && !state.winner && !state.pendingQuiz && !isHandDiscardActive("player") && card.type === "character";

    const cardEl = buildCardEl(card, {
      disabled: false,
      attackable: canPickAsDefender || canPickAsCardTarget,
      selectedAttacker: isSelected,
      entering,
    });

    if (canPickAsCardTarget) {
      cardEl.addEventListener("click", () => {
        resolvePendingTarget(card.uid);
      });
    }

    if (canPickAsAttacker && !canPickAsCardTarget) {
      cardEl.addEventListener("click", () => {
        state.selectedAttackerUid = state.selectedAttackerUid === card.uid ? null : card.uid;
        render();
      });
    }

    if (canPickAsDefender && !canPickAsCardTarget) {
      cardEl.addEventListener("click", () => {
        attackUnit("player", state.selectedAttackerUid, card.uid);
      });
    }

    if (
      side === "player" &&
      state.currentPlayer === "player" &&
      !state.pendingQuiz &&
      !isHandDiscardActive("player") &&
      state.selectedAttackerUid === card.uid &&
      canAttackWriterDirectly("player", card.uid)
    ) {
      const directBtn = document.createElement("button");
      directBtn.className = "button primary";
      directBtn.textContent = state.ai.board.length === 1 && isBandersnatch(card) ? "Bypass to AI Writer" : "Attack AI Writer";
      directBtn.addEventListener("click", () => attackWriter("player", card.uid));
      boardRef.appendChild(directBtn);
    }

    boardRef.appendChild(cardEl);
  });

  prevBoardUids[side] = new Set(board.map((c) => c.uid));
}

function drawForPlayer() {
  if (
    state.currentPlayer !== "player" ||
    state.player.hasDrawnThisTurn ||
    state.winner ||
    state.pendingQuiz ||
    state.pendingTarget ||
    isHandDiscardActive("player")
  ) return;
  const drawn = drawCards(state.player, 1);
  state.player.hasDrawnThisTurn = true;
  if (drawn > 0) {
    spawnFloatingFx(`+${drawn} card`, refs.playerPanel, "info");
    logEvent("You draw a card.");
  } else {
    logEvent("You attempt to draw, but no cards are left.");
  }
  emitSfx("draw_card", { side: "player" });
  render();
}

async function runTurnEndQuickCheck(ownerKey) {
  const quiz = QUICK_CHECK_BANK[Math.floor(Math.random() * QUICK_CHECK_BANK.length)];
  await resolveKnowledgeCheck(ownerKey, quiz, "Turn-End Quick Check");
  checkWinner();
  render();
}

async function finishPlayerTurn() {
  logMatchEvent({
    actor: "player",
    eventType: "turn_end",
    details: { hand: state.player.hand.length, board: state.player.board.length },
  });
  resolveBoardTriggers("player", "onTurnEnd", { side: "player" });
  if (state.turn % state.settings.quickCheckEveryTurns === 0) {
    await runTurnEndQuickCheck("player");
    if (state.winner) return;
  }
  state.currentPlayer = "ai";
  render();
  runAiTurn();
}

async function endPlayerTurn() {
  if (
    state.currentPlayer !== "player" ||
    state.winner ||
    state.pendingQuiz ||
    state.pendingTarget ||
    isHandDiscardActive("player")
  ) return;
  if (enterHandDiscardMode("player", "end-turn")) {
    render();
    return;
  }
  await finishPlayerTurn();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAiTurn() {
  beginTurn("ai");
  render();
  await sleep(350);

  const drawn = drawCards(state.ai, 1);
  state.ai.hasDrawnThisTurn = true;
  if (drawn > 0) {
    spawnFloatingFx(`+${drawn} card`, refs.aiPanel, "info");
    logEvent("AI draws a card.");
  } else {
    logEvent("AI attempts to draw, but no cards are left.");
  }
  emitSfx("draw_card", { side: "ai" });
  render();
  await sleep(350);

  let played = true;
  while (played && !state.winner) {
    played = false;
    const affordable = state.ai.hand
      .map((card, idx) => ({ card, idx, cost: getCardCost(state.ai, card) }))
      .filter(({ card, cost }) => cost <= state.ai.inspiration && canPlayCard("ai", card))
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

    if (canAttackWriterDirectly("ai", attacker.uid)) {
      attackWriter("ai", attacker.uid);
    } else if (state.player.board.length > 0) {
      attackUnit("ai", attacker.uid, pickLowestMem(state.player.board).uid);
    } else {
      attackWriter("ai", attacker.uid);
    }
    await sleep(420);
  }

  if (state.winner) return;

  logMatchEvent({
    actor: "ai",
    eventType: "turn_end",
    details: { hand: state.ai.hand.length, board: state.ai.board.length },
  });
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
  if (!state || state.winner || state.pendingQuiz || state.pendingTarget || isHandDiscardActive("player") || state.currentPlayer !== "player") return;
  const card = state.player.board.find((c) => c.uid === uidValue);
  if (!card || card.exhausted) return;
  state.selectedAttackerUid = state.selectedAttackerUid === uidValue ? null : uidValue;
  render();
}

function playPlayerHandCard(uidValue) {
  if (state?.pendingTarget || isHandDiscardActive("player")) return Promise.resolve();
  const index = state?.player?.hand?.findIndex((c) => c.uid === uidValue) ?? -1;
  if (index >= 0) {
    return playCard("player", index);
  }
  return Promise.resolve();
}

function discardPlayerHandCard(uidValue) {
  if (!state || !isHandDiscardActive("player") || state.currentPlayer !== "player") return Promise.resolve(false);
  const index = state.player.hand.findIndex((card) => card.uid === uidValue);
  if (index < 0) return Promise.resolve(false);

  const [discarded] = state.player.hand.splice(index, 1);
  state.player.discard.push(discarded);
  state.selectedAttackerUid = null;
  spawnFloatingFx("Discarded", cardElementByUid(discarded.uid) || panelForOwner("player"), "info");
  logEvent(`You discard ${discarded.name}.`);
  logMatchEvent({
    actor: "player",
    eventType: "card_discarded",
    cardId: discarded?.id,
    cardName: discarded?.name,
    sourceZone: "hand",
    targetZone: "discard",
  });
  const remaining = getHandDiscardRemaining("player");
  if (remaining > 0) {
    logEvent(getHandDiscardStatusText("player"));
    render();
    return Promise.resolve(true);
  }
  return maybeResolvePendingHandDiscard("player");
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
    discardHandCard: discardPlayerHandCard,
    selectAttacker,
    attackUnit: (defenderUid) => {
      if (!state?.selectedAttackerUid) return;
      attackUnit("player", state.selectedAttackerUid, defenderUid);
    },
    attackWriter: () => {
      if (!state?.selectedAttackerUid) return;
      attackWriter("player", state.selectedAttackerUid);
    },
    resolveCardTarget: (targetUid) => {
      resolvePendingTarget(targetUid);
    },
  },
  constants: {
    STATE_EVENT_NAME,
    FX_EVENT_NAME,
    SFX_EVENT_NAME,
    isFullscreenSupported,
    getFullscreenElement,
    canAttackWriterDirectly,
    getCardPlayBlockReason,
    canPlayCard,
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

window.ACGDev = window.ACGDev || {};
window.ACGDev.exportMatchCsv = () => exportMatchLogCsv("console");

refs.drawBtn.addEventListener("click", drawForPlayer);
refs.endTurnBtn.addEventListener("click", endPlayerTurn);
refs.toggleLogBtn.addEventListener("click", () => toggleDrawer(refs.logPanel));
refs.toggleTeacherBtn.addEventListener("click", () => toggleDrawer(refs.teacherPanel));
refs.toggleRulesBtn.addEventListener("click", () => toggleDrawer(refs.rulesPanel));
refs.audioToggleBtn.addEventListener("click", toggleSfx);
refs.teacherApplyBtn.addEventListener("click", applyTeacherSettings);
refs.newGameBtn.addEventListener("click", showAuthorSelection);
refs.playAgainBtn.addEventListener("click", showAuthorSelection);
refs.playerAuthorSelect?.addEventListener("change", updateAuthorSelectionPassive);
refs.authorSelectConfirmBtn?.addEventListener("click", startMatchFromSelection);
window.addEventListener(SFX_EVENT_NAME, handleSfxEvent);
window.addEventListener("pointerdown", unlockAudio, { once: true });
window.addEventListener("keydown", unlockAudio, { once: true });
updateAudioToggleUi();
ensureBuildBadge();
ensureDevMatchExportButton();
bindViewportState();
runScreenIntro();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`./sw.js?v=${APP_BUILD_ID}`, { updateViaCache: "none" })
      .catch(() => {});
  });
}

showAuthorSelection();
