export function sanitizeElement(el: any): any {
  if (!el || typeof el !== 'object' || typeof el.type !== 'string') {
    return null;
  }

  const type = el.type;
  const isText = type === 'text';
  const isLinear = ['arrow', 'line', 'freedraw'].includes(type);

  // Fallback text properties
  const textVal = typeof el.text === 'string' ? el.text : (typeof el.originalText === 'string' ? el.originalText : '');
  const originalTextVal = typeof el.originalText === 'string' ? el.originalText : textVal;

  const cleaned: any = {
    id: el.id || `el_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    type,
    x: typeof el.x === 'number' && !isNaN(el.x) ? el.x : 0,
    y: typeof el.y === 'number' && !isNaN(el.y) ? el.y : 0,
    width: typeof el.width === 'number' && !isNaN(el.width) ? el.width : 100,
    height: typeof el.height === 'number' && !isNaN(el.height) ? el.height : 100,
    angle: typeof el.angle === 'number' && !isNaN(el.angle) ? el.angle : 0,
    strokeColor: el.strokeColor || '#ffffff',
    backgroundColor: el.backgroundColor || 'transparent',
    fillStyle: el.fillStyle || 'solid',
    strokeWidth: typeof el.strokeWidth === 'number' ? el.strokeWidth : 1,
    strokeStyle: el.strokeStyle || 'solid',
    roughness: typeof el.roughness === 'number' ? el.roughness : 1,
    opacity: typeof el.opacity === 'number' ? el.opacity : 100,
    groupIds: Array.isArray(el.groupIds) ? el.groupIds : [],
    frameId: el.frameId || null,
    roundness: el.roundness || null,
    seed: el.seed || Math.floor(Math.random() * 100000),
    version: el.version || 1,
    versionNonce: el.versionNonce || Math.floor(Math.random() * 100000),
    isDeleted: Boolean(el.isDeleted),
    boundElements: Array.isArray(el.boundElements) ? el.boundElements : null,
    updated: el.updated || Date.now(),
    link: el.link || null,
    locked: Boolean(el.locked),
    ...el, // Preserve original properties
  };

  // OVERWRITE critical properties AFTER ...el to guarantee safe non-undefined values
  cleaned.groupIds = Array.isArray(cleaned.groupIds) ? cleaned.groupIds : [];
  cleaned.boundElements = Array.isArray(cleaned.boundElements) ? cleaned.boundElements : null;
  cleaned.frameId = cleaned.frameId || null;
  cleaned.link = cleaned.link || null;

  if (isText) {
    cleaned.text = textVal;
    cleaned.originalText = originalTextVal;
    cleaned.fontSize = typeof cleaned.fontSize === 'number' ? cleaned.fontSize : 14;
    cleaned.fontFamily = typeof cleaned.fontFamily === 'number' ? cleaned.fontFamily : 1;
    cleaned.textAlign = cleaned.textAlign || 'left';
    cleaned.verticalAlign = cleaned.verticalAlign || 'top';
    cleaned.containerId = cleaned.containerId || null;
    cleaned.lineHeight = typeof cleaned.lineHeight === 'number' ? cleaned.lineHeight : 1.25;
    cleaned.autoResize = cleaned.autoResize ?? true;
  }

  if (isLinear) {
    if (!Array.isArray(cleaned.points) || cleaned.points.length === 0) {
      cleaned.points = [[0, 0], [cleaned.width || 100, cleaned.height || 0]];
    } else {
      cleaned.points = cleaned.points.map((p: any) =>
        Array.isArray(p) && p.length >= 2 ? [Number(p[0]) || 0, Number(p[1]) || 0] : [0, 0]
      );
    }
    cleaned.startArrowhead = cleaned.startArrowhead || null;
    cleaned.endArrowhead = cleaned.endArrowhead || null;
  }

  return cleaned;
}

export function sanitizeElements(elements: any[]): any[] {
  if (!Array.isArray(elements)) return [];
  return elements.map(sanitizeElement).filter(Boolean);
}
