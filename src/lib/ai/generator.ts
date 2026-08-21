// AI Diagram Generator engine for Ideora
export interface AIDiagramRequest {
  prompt: string;
  type: 'flowchart' | 'mindmap' | 'uml' | 'architecture';
}

function createExcalidrawNode(
  id: string,
  type: 'rectangle' | 'ellipse' | 'diamond',
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  backgroundColor: string,
  textLabel: string
) {
  const nodeElement = {
    id,
    type,
    x,
    y,
    width,
    height,
    strokeColor,
    backgroundColor,
    fillStyle: 'solid',
    strokeWidth: 2,
    roughness: 1,
    opacity: 100,
    groupIds: [],
    roundness: { type: 3 },
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: 1,
    link: null,
    locked: false,
  };

  const textElement = {
    id: `${id}_text`,
    type: 'text',
    x: x + 15,
    y: y + Math.floor(height / 2) - 12,
    width: width - 30,
    height: 24,
    strokeColor: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: 16,
    fontFamily: 1,
    text: textLabel,
    textAlign: 'center',
    verticalAlign: 'middle',
    containerId: id,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
  };

  return [nodeElement, textElement];
}

function createExcalidrawArrow(id: string, startX: number, startY: number, endX: number, endY: number, color = '#6366f1') {
  return {
    id,
    type: 'arrow',
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
    strokeColor: color,
    strokeWidth: 2,
    roughness: 1,
    opacity: 100,
    groupIds: [],
    points: [
      [0, 0],
      [endX - startX, endY - startY],
    ],
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    isDeleted: false,
  };
}

export async function generateDiagramElements(request: AIDiagramRequest): Promise<any[]> {
  const ts = Date.now();
  const promptLower = request.prompt.toLowerCase();
  const elements: any[] = [];

  // Check if user has optional custom Gemini API Key
  const geminiApiKey = typeof window !== 'undefined' ? localStorage.getItem('ideora_gemini_api_key') : null;

  if (geminiApiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a list of 4 key steps/nodes for a diagram about: "${request.prompt}". Return ONLY a JSON array of strings for step titles, example: ["Inicio", "Proceso A", "Proceso B", "Resultado"]`
            }]
          }]
        })
      });
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsedTitles = JSON.parse(rawText.substring(rawText.indexOf('['), rawText.lastIndexOf(']') + 1));
        if (Array.isArray(parsedTitles) && parsedTitles.length > 0) {
          let startX = 100;
          parsedTitles.forEach((title: string, index: number) => {
            const nodeId = `ai_node_${ts}_${index}`;
            const color = index === 0 ? '#3b82f6' : index === parsedTitles.length - 1 ? '#10b981' : '#8b5cf6';
            const bgColor = index === 0 ? '#1e3a8a' : index === parsedTitles.length - 1 ? '#064e3b' : '#4c1d95';
            
            elements.push(...createExcalidrawNode(nodeId, 'rectangle', startX, 250, 180, 80, color, bgColor, title));

            if (index < parsedTitles.length - 1) {
              elements.push(createExcalidrawArrow(`ai_arrow_${ts}_${index}`, startX + 180, 290, startX + 260, 290));
            }
            startX += 260;
          });
          return elements;
        }
      }
    } catch (e) {
      console.warn('Gemini API call fallback to built-in generator:', e);
    }
  }

  // Fast Built-in Multi-type Generator
  if (request.type === 'mindmap' || promptLower.includes('mapa') || promptLower.includes('mindmap')) {
    // Central Node
    const centerTitle = request.prompt.length > 20 ? request.prompt.slice(0, 20) + '...' : request.prompt || 'Idea Central';
    elements.push(...createExcalidrawNode(`mm_center_${ts}`, 'ellipse', 450, 250, 220, 100, '#ec4899', '#831843', centerTitle));

    const branches = [
      { label: 'Concepto 1', x: 200, y: 120, color: '#3b82f6', bg: '#1e3a8a' },
      { label: 'Estrategia', x: 750, y: 120, color: '#10b981', bg: '#064e3b' },
      { label: 'Recursos', x: 200, y: 400, color: '#f59e0b', bg: '#78350f' },
      { label: 'Resultados', x: 750, y: 400, color: '#8b5cf6', bg: '#4c1d95' },
    ];

    branches.forEach((b, i) => {
      const bId = `mm_branch_${ts}_${i}`;
      elements.push(...createExcalidrawNode(bId, 'rectangle', b.x, b.y, 160, 70, b.color, b.bg, b.label));
      
      const arrowStartX = b.x > 450 ? 560 : 450;
      const arrowStartY = b.y > 250 ? 300 : 270;
      elements.push(createExcalidrawArrow(`mm_arrow_${ts}_${i}`, arrowStartX, arrowStartY, b.x + 80, b.y + 35, b.color));
    });

    return elements;
  }

  // Architecture / System Flowchart
  const steps = [
    { title: 'Cliente / App', bg: '#1e3a8a', border: '#3b82f6' },
    { title: 'API Gateway', bg: '#4c1d95', border: '#8b5cf6' },
    { title: 'Servicio Lógica', bg: '#78350f', border: '#f59e0b' },
    { title: 'Base de Datos', bg: '#064e3b', border: '#10b981' },
  ];

  let currentX = 120;
  steps.forEach((s, idx) => {
    const nodeId = `sys_node_${ts}_${idx}`;
    elements.push(...createExcalidrawNode(nodeId, 'rectangle', currentX, 260, 180, 85, s.border, s.bg, s.title));

    if (idx < steps.length - 1) {
      elements.push(createExcalidrawArrow(`sys_arrow_${ts}_${idx}`, currentX + 180, 302, currentX + 250, 302, s.border));
    }
    currentX += 250;
  });

  return elements;
}
