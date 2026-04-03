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
  // Temporary visual diagnostics: toggle on while verifying external PNG usage.
  debugDiagnostics: true,
  // Keep the central play field visually quieter so gameplay remains readable.
  // This is currently a tuning contract for authored boards rather than an explicit mask:
  // decorative layers should avoid placing busy detail in this zone.
  centerSafeZone: { widthRatio: 0.56, heightRatio: 0.42 },
  fullscreenLayers: [
    { key: "bg_base_field", alpha: 1, scaleMultiplier: 1, decorativeOnly: false },
    { key: "bg_surface_motifs", alpha: 0.18, scaleMultiplier: 1.01, decorativeOnly: true },
    { key: "bg_frame_border", alpha: 0.92, scaleMultiplier: 1, decorativeOnly: false },
    { key: "bg_atmosphere", alpha: 0.22, scaleMultiplier: 1.03, decorativeOnly: true, drift: { x: 6, y: 5, duration: 22000 } },
  ],
  cornerLayers: [
    { key: "bg_corner_tl", anchor: "tl", alpha: 0.9, scaleMultiplier: 1, decorativeOnly: true, drift: { x: 2.5, y: 2, duration: 20000 } },
    { key: "bg_corner_tr", anchor: "tr", alpha: 0.9, scaleMultiplier: 1, decorativeOnly: true, drift: { x: -2.5, y: 2, duration: 21000 } },
    { key: "bg_corner_bl", anchor: "bl", alpha: 0.94, scaleMultiplier: 1, decorativeOnly: true, drift: { x: 3, y: -2.5, duration: 19000 } },
    { key: "bg_corner_br", anchor: "br", alpha: 0.94, scaleMultiplier: 1, decorativeOnly: true, drift: { x: -3, y: -2.5, duration: 20500 } },
  ],
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
