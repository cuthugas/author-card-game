// Background manifest for authored board themes.
// To swap in a future theme such as Shakespeare or Poe, duplicate this shape,
// update the asset keys/paths/tuning, and point MatchScene at the new config.
// Wonderland theme assets should live under phaser/assets/backgrounds/wonderland/.
// externalPath must match the actual runtime-served asset path Phaser loads, not just a doc/reference path.

export const WONDERLAND_BACKGROUND_ASSETS = [
  { key: "bg_base_field", externalPath: "phaser/assets/backgrounds/wonderland/bg_base_field.png", placeholderFilename: "phaser/assets/backgrounds/wonderland/bg_base_field.png" },
  { key: "bg_surface_motifs", externalPath: null, placeholderFilename: "phaser/assets/backgrounds/wonderland/bg_surface_motifs.png" },
  { key: "bg_frame_border", externalPath: "phaser/assets/backgrounds/wonderland/bg_frame_border.png", placeholderFilename: "phaser/assets/backgrounds/wonderland/bg_frame_border.png" },
  { key: "bg_corner_tl", externalPath: null, placeholderFilename: "phaser/assets/backgrounds/wonderland/bg_corner_tl.png" },
  { key: "bg_corner_tr", externalPath: null, placeholderFilename: "phaser/assets/backgrounds/wonderland/bg_corner_tr.png" },
  { key: "bg_corner_bl", externalPath: null, placeholderFilename: "phaser/assets/backgrounds/wonderland/bg_corner_bl.png" },
  { key: "bg_corner_br", externalPath: null, placeholderFilename: "phaser/assets/backgrounds/wonderland/bg_corner_br.png" },
  { key: "bg_atmosphere", externalPath: null, placeholderFilename: "phaser/assets/backgrounds/wonderland/bg_atmosphere.png" },
];

export const WONDERLAND_BACKGROUND_CONFIG = {
  themeKey: "wonderland",
  // Diagnostics were used during background integration; keep off for normal play.
  debugDiagnostics: false,
  // Keep the central play field visually quieter so gameplay remains readable.
  // This is currently a tuning contract for authored boards rather than an explicit mask:
  // decorative layers should avoid placing busy detail in this zone.
  centerSafeZone: { widthRatio: 0.56, heightRatio: 0.42 },
  // Intentionally omitted from active render layers for now:
  // `bg_surface_motifs` and all `bg_corner_*` placeholder art.
  // They remain loadable textures, but are not added to the scene.
  fullscreenLayers: [
    { key: "bg_base_field", alpha: 1, scaleMultiplier: 1, decorativeOnly: false },
    { key: "bg_frame_border", alpha: 0.92, scaleMultiplier: 1, decorativeOnly: false },
    { key: "bg_atmosphere", alpha: 0.08, scaleMultiplier: 1.02, decorativeOnly: true, drift: { x: 4, y: 3, duration: 24000 } },
  ],
  // Placeholder motif and corner layers stay disabled for now because their
  // generated rectangle/rose flourishes read as leftover artifacts rather than
  // authored board art.
  cornerLayers: [],
  // Per-device tuning lives here. Future themes should prefer manifest-level tuning
  // instead of scene-level special cases so authored boards stay modular.
  deviceTuning: {
    desktop: {
      cornerScaleMultiplier: 1,
      cornerOffsetX: 18,
      cornerOffsetY: 16,
      atmosphereDriftMultiplier: 1,
      cornerDriftMultiplier: 0.8,
    },
    tablet: {
      cornerScaleMultiplier: 0.88,
      cornerOffsetX: 12,
      cornerOffsetY: 10,
      atmosphereDriftMultiplier: 0.72,
      cornerDriftMultiplier: 0.65,
    },
    phone: {
      cornerScaleMultiplier: 0.72,
      cornerOffsetX: 8,
      cornerOffsetY: 6,
      atmosphereDriftMultiplier: 0.5,
      cornerDriftMultiplier: 0.42,
    },
  },
};
