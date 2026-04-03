function getDeviceTier(width, height) {
  if (width < 900 || height < 540) return "phone";
  if (width < 1280) return "tablet";
  return "desktop";
}

function fitCover(width, height, textureWidth, textureHeight, scaleMultiplier = 1) {
  const textureAspectWidth = Math.max(1, textureWidth || width);
  const textureAspectHeight = Math.max(1, textureHeight || height);
  const scale = Math.max(width / textureAspectWidth, height / textureAspectHeight) * scaleMultiplier;
  return {
    width: textureAspectWidth * scale,
    height: textureAspectHeight * scale,
  };
}

function getTextureSize(scene, key) {
  const texture = scene.textures.get(key);
  const source = texture?.getSourceImage?.();
  return {
    width: source?.width || texture?.source?.[0]?.width || 1,
    height: source?.height || texture?.source?.[0]?.height || 1,
  };
}

function getTextureDiagnostic(scene, key) {
  const texture = scene.textures.get(key);
  const source = texture?.getSourceImage?.();
  return {
    exists: scene.textures.exists(key),
    width: source?.width || texture?.source?.[0]?.width || 1,
    height: source?.height || texture?.source?.[0]?.height || 1,
    origin: scene.registry.get(`wonderlandTextureOrigin:${key}`) || "unknown",
    path: scene.registry.get(`wonderlandTexturePath:${key}`) || null,
  };
}

export class BackgroundLayerManager {
  constructor(scene, container, config) {
    this.scene = scene;
    this.container = container;
    this.config = config;
    this.layerNodes = [];
    this.debugLabel = null;
  }

  create() {
    this.destroy();

    this.config.fullscreenLayers.forEach((layer) => {
      const image = this.scene.add.image(0, 0, layer.key).setOrigin(0.5).setAlpha(layer.alpha ?? 1);
      this.container.add(image);
      this.layerNodes.push({ type: "fullscreen", config: layer, image, baseX: 0, baseY: 0 });
    });

    this.config.cornerLayers.forEach((layer) => {
      const image = this.scene.add.image(0, 0, layer.key).setOrigin(0.5).setAlpha(layer.alpha ?? 1);
      this.container.add(image);
      this.layerNodes.push({ type: "corner", config: layer, image, baseX: 0, baseY: 0 });
    });

    this.logDisplayedTextureDiagnostics();
    this.createDebugLabel();

    this.layout(this.scene.scale.width, this.scene.scale.height);
  }

  destroy() {
    this.debugLabel?.destroy();
    this.debugLabel = null;
    this.layerNodes.forEach(({ image }) => image.destroy());
    this.layerNodes = [];
  }

  logDisplayedTextureDiagnostics() {
    ["bg_base_field", "bg_frame_border"].forEach((key) => {
      const info = getTextureDiagnostic(this.scene, key);
      console.info("[Wonderland BG][display]", {
        key,
        exists: info.exists,
        width: info.width,
        height: info.height,
        origin: info.origin,
        path: info.path,
      });
    });
  }

  createDebugLabel() {
    if (!this.config.debugDiagnostics) return;
    const baseInfo = getTextureDiagnostic(this.scene, "bg_base_field");
    const frameInfo = getTextureDiagnostic(this.scene, "bg_frame_border");
    const text = [
      "[Wonderland Rendered]",
      `bg_base_field: ${baseInfo.origin} (${baseInfo.width}x${baseInfo.height})`,
      `bg_frame_border: ${frameInfo.origin} (${frameInfo.width}x${frameInfo.height})`,
    ].join("\n");

    this.debugLabel = this.scene.add.text(14, 12, text, {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#f7f0d6",
      backgroundColor: "rgba(8, 12, 18, 0.72)",
      padding: { x: 6, y: 4 },
    });
    this.debugLabel.setScrollFactor(0).setDepth(1000).setAlpha(0.92);
    this.container.add(this.debugLabel);
  }

  layout(width, height) {
    const tier = getDeviceTier(width, height);
    // Device tuning is intentionally manifest-driven so future author boards can
    // reuse this manager without adding scene-specific resize branches.
    const tuning = this.config.deviceTuning[tier] || this.config.deviceTuning.desktop;

    this.layerNodes.forEach((node) => {
      const textureSize = getTextureSize(this.scene, node.config.key);
      if (node.type === "fullscreen") {
        const fitted = fitCover(width, height, textureSize.width, textureSize.height, node.config.scaleMultiplier ?? 1);
        node.baseX = width * 0.5;
        node.baseY = height * 0.5;
        node.image.setPosition(node.baseX, node.baseY);
        node.image.setDisplaySize(fitted.width, fitted.height);
        return;
      }

      const baseCornerScale = node.config.scaleMultiplier ?? 1;
      const scale = baseCornerScale * (tuning.cornerScaleMultiplier ?? 1);
      node.image.setScale(scale);

      const halfW = (textureSize.width * scale) * 0.5;
      const halfH = (textureSize.height * scale) * 0.5;
      const offsetX = tuning.cornerOffsetX ?? 0;
      const offsetY = tuning.cornerOffsetY ?? 0;

      switch (node.config.anchor) {
        case "tl":
          node.baseX = halfW - offsetX;
          node.baseY = halfH - offsetY;
          break;
        case "tr":
          node.baseX = width - halfW + offsetX;
          node.baseY = halfH - offsetY;
          break;
        case "bl":
          node.baseX = halfW - offsetX;
          node.baseY = height - halfH + offsetY;
          break;
        case "br":
          node.baseX = width - halfW + offsetX;
          node.baseY = height - halfH + offsetY;
          break;
        default:
          node.baseX = width * 0.5;
          node.baseY = height * 0.5;
          break;
      }

      node.image.setPosition(node.baseX, node.baseY);
    });

    if (this.debugLabel) {
      this.debugLabel.setPosition(14, 12);
    }
  }

  update(delta) {
    const tier = getDeviceTier(this.scene.scale.width, this.scene.scale.height);
    const tuning = this.config.deviceTuning[tier] || this.config.deviceTuning.desktop;
    const time = this.scene.time.now;

    this.layerNodes.forEach((node) => {
      const drift = node.config.drift;
      if (!drift) return;
      // Decorative motion only: fullscreen atmosphere uses one multiplier and
      // corner props use a separate, usually lower, multiplier to avoid pulling
      // attention away from the center play area.
      const multiplier = node.type === "fullscreen"
        ? (tuning.atmosphereDriftMultiplier ?? 1)
        : (tuning.cornerDriftMultiplier ?? tuning.atmosphereDriftMultiplier ?? 1);
      const xAmp = (drift.x ?? 0) * multiplier;
      const yAmp = (drift.y ?? 0) * multiplier;
      const duration = Math.max(1, drift.duration ?? 12000);
      const phase = (time % duration) / duration;
      const x = node.baseX + Math.sin(phase * Math.PI * 2) * xAmp;
      const y = node.baseY + Math.cos(phase * Math.PI * 2) * yAmp;
      node.image.setPosition(x, y);
    });
  }
}
