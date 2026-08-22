export interface ShapeCategory {
  id: string;
  name: string;
  group: 'STANDARD' | 'SOFTWARE' | 'CLOUD' | 'NETWORK' | 'OTHER';
  defaultEnabled: boolean;
  shapes: ShapeItem[];
}

export interface ShapeItem {
  id: string;
  name: string;
  type: 'rectangle' | 'ellipse' | 'diamond' | 'arrow' | 'line' | 'text' | 'group';
  iconName: string;
  color?: string;
  factory: (cx: number, cy: number, api?: any) => any[];
}

// Helper to create clean vector outline elements (transparent background, white stroke, roughness 0)
function createOutlineShape(
  idPrefix: string,
  type: 'rectangle' | 'ellipse' | 'diamond',
  cx: number,
  cy: number,
  w: number,
  h: number,
  label?: string,
  roundnessType?: number,
  strokeColor: string = '#ffffff'
) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const shapeId = `${idPrefix}_${ts}`;
  const textId = label ? `${idPrefix}_txt_${ts}` : null;

  const elements: any[] = [
    {
      id: shapeId,
      type,
      x: cx - Math.floor(w / 2),
      y: cy - Math.floor(h / 2),
      width: w,
      height: h,
      angle: 0,
      strokeColor,
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 2,
      strokeStyle: 'solid',
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: roundnessType ? { type: roundnessType } : null,
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: textId ? [{ id: textId, type: 'text' }] : null,
      updated: Date.now(),
      link: null,
      locked: false,
    },
  ];

  if (label && textId) {
    elements.push({
      id: textId,
      type: 'text',
      x: cx - Math.floor(w / 2) + 10,
      y: cy - 12,
      width: w - 20,
      height: 24,
      angle: 0,
      strokeColor: '#ffffff',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 0,
      opacity: 100,
      groupIds: [],
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      fontSize: 14,
      fontFamily: 1,
      text: label,
      originalText: label,
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: shapeId,
    });
  }

  return elements;
}

// Specialized Vector Drawings (UML Actor, Database Cylinder, Cloud, Package, etc.)
function createUMLActor(cx: number, cy: number, label: string = 'Actor') {
  const ts = Date.now();
  const groupId = `grp_actor_${ts}`;
  return [
    // Head
    { id: `act_head_${ts}`, type: 'ellipse', x: cx - 15, y: cy - 45, width: 30, height: 30, strokeColor: '#ffffff', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [groupId] },
    // Body
    { id: `act_body_${ts}`, type: 'line', x: cx, y: cy - 15, width: 0, height: 35, points: [[0, 0], [0, 35]], strokeColor: '#ffffff', strokeWidth: 2, roughness: 0, groupIds: [groupId] },
    // Arms
    { id: `act_arms_${ts}`, type: 'line', x: cx - 25, y: cy - 5, width: 50, height: 0, points: [[0, 0], [50, 0]], strokeColor: '#ffffff', strokeWidth: 2, roughness: 0, groupIds: [groupId] },
    // Left Leg
    { id: `act_lleg_${ts}`, type: 'line', x: cx - 20, y: cy + 20, width: 20, height: 25, points: [[0, 0], [20, -25]], strokeColor: '#ffffff', strokeWidth: 2, roughness: 0, groupIds: [groupId] },
    // Right Leg
    { id: `act_rleg_${ts}`, type: 'line', x: cx, y: cy + 20, width: 20, height: 25, points: [[0, 0], [20, 25]], strokeColor: '#ffffff', strokeWidth: 2, roughness: 0, groupIds: [groupId] },
    // Label Text
    { id: `act_txt_${ts}`, type: 'text', x: cx - 40, y: cy + 50, width: 80, height: 20, text: label, originalText: label, fontSize: 13, strokeColor: '#ffffff', textAlign: 'center', groupIds: [groupId] },
  ];
}

function createDatabaseCylinder(cx: number, cy: number, label: string = 'Database') {
  const ts = Date.now();
  const groupId = `grp_db_${ts}`;
  return [
    { id: `db_body_${ts}`, type: 'rectangle', x: cx - 50, y: cy - 35, width: 100, height: 70, strokeColor: '#38bdf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, roundness: { type: 3 }, groupIds: [groupId] },
    { id: `db_top_${ts}`, type: 'ellipse', x: cx - 50, y: cy - 45, width: 100, height: 25, strokeColor: '#38bdf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [groupId] },
    { id: `db_mid_${ts}`, type: 'ellipse', x: cx - 50, y: cy - 10, width: 100, height: 20, strokeColor: '#38bdf8', backgroundColor: 'transparent', strokeWidth: 1, strokeStyle: 'dashed', roughness: 0, groupIds: [groupId] },
    { id: `db_txt_${ts}`, type: 'text', x: cx - 45, y: cy, width: 90, height: 20, text: label, originalText: label, fontSize: 13, strokeColor: '#ffffff', textAlign: 'center', groupIds: [groupId] },
  ];
}

function createCloudShape(cx: number, cy: number, label: string = 'Cloud') {
  const ts = Date.now();
  const groupId = `grp_cloud_${ts}`;
  return [
    { id: `c_base_${ts}`, type: 'ellipse', x: cx - 60, y: cy - 25, width: 120, height: 50, strokeColor: '#818cf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [groupId] },
    { id: `c_top_${ts}`, type: 'ellipse', x: cx - 35, y: cy - 45, width: 70, height: 50, strokeColor: '#818cf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [groupId] },
    { id: `c_txt_${ts}`, type: 'text', x: cx - 45, y: cy - 10, width: 90, height: 20, text: label, originalText: label, fontSize: 13, strokeColor: '#ffffff', textAlign: 'center', groupIds: [groupId] },
  ];
}

function createUMLPackage(cx: number, cy: number, label: string = 'Package') {
  const ts = Date.now();
  const groupId = `grp_pkg_${ts}`;
  return [
    { id: `pkg_tab_${ts}`, type: 'rectangle', x: cx - 70, y: cy - 50, width: 50, height: 18, strokeColor: '#a855f7', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [groupId] },
    { id: `pkg_body_${ts}`, type: 'rectangle', x: cx - 70, y: cy - 32, width: 140, height: 74, strokeColor: '#a855f7', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [groupId] },
    { id: `pkg_txt_${ts}`, type: 'text', x: cx - 60, y: cy - 10, width: 120, height: 20, text: label, originalText: label, fontSize: 13, strokeColor: '#ffffff', textAlign: 'center', groupIds: [groupId] },
  ];
}

export const ALL_SHAPE_CATEGORIES: ShapeCategory[] = [
  // STANDARD GENERAL SHAPES (Grid of clean vector shapes like Draw.io Image 2)
  {
    id: 'general',
    name: 'General',
    group: 'STANDARD',
    defaultEnabled: true,
    shapes: [
      { id: 'g_rect', name: 'Rectángulo', type: 'rectangle', iconName: 'Square', factory: (cx, cy) => createOutlineShape('g_rect', 'rectangle', cx, cy, 140, 80, '') },
      { id: 'g_rrect', name: 'Rect Redondeado', type: 'rectangle', iconName: 'Square', factory: (cx, cy) => createOutlineShape('g_rrect', 'rectangle', cx, cy, 140, 80, '', 3) },
      { id: 'g_ellipse', name: 'Elipse / Círculo', type: 'ellipse', iconName: 'Circle', factory: (cx, cy) => createOutlineShape('g_ell', 'ellipse', cx, cy, 100, 100, '') },
      { id: 'g_diamond', name: 'Rombo Decisión', type: 'diamond', iconName: 'Diamond', factory: (cx, cy) => createOutlineShape('g_dia', 'diamond', cx, cy, 120, 100, '') },
      { id: 'g_db', name: 'Cilindro Base Datos', type: 'rectangle', iconName: 'Database', factory: (cx, cy) => createDatabaseCylinder(cx, cy, 'Database') },
      { id: 'g_actor', name: 'Actor / Usuario', type: 'ellipse', iconName: 'User', factory: (cx, cy) => createUMLActor(cx, cy, 'User') },
      { id: 'g_cloud', name: 'Nube Cloud', type: 'ellipse', iconName: 'Cloud', factory: (cx, cy) => createCloudShape(cx, cy, 'Cloud') },
      { id: 'g_package', name: 'Paquete UML', type: 'rectangle', iconName: 'Boxes', factory: (cx, cy) => createUMLPackage(cx, cy, 'Package') },
      { id: 'g_text', name: 'Caja de Texto', type: 'text', iconName: 'Type', factory: (cx, cy) => [{ id: `txt_${Date.now()}`, type: 'text', x: cx - 40, y: cy - 15, width: 80, height: 30, text: 'Texto', originalText: 'Texto', fontSize: 16, strokeColor: '#ffffff' }] },
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    group: 'STANDARD',
    defaultEnabled: true,
    shapes: [
      { id: 'b_box', name: 'Caja Proceso', type: 'rectangle', iconName: 'Square', factory: (cx, cy) => createOutlineShape('b_box', 'rectangle', cx, cy, 130, 75, 'Proceso') },
      { id: 'b_sticky', name: 'Nota / Documento', type: 'rectangle', iconName: 'FileText', factory: (cx, cy) => createOutlineShape('b_stk', 'rectangle', cx, cy, 120, 120, 'Documento', 3, '#fde047') },
      { id: 'b_circle', name: 'Nodo Círculo', type: 'ellipse', iconName: 'Circle', factory: (cx, cy) => createOutlineShape('b_circ', 'ellipse', cx, cy, 80, 80, 'Nodo') },
    ],
  },
  {
    id: 'arrows',
    name: 'Arrows & Connectors',
    group: 'STANDARD',
    defaultEnabled: true,
    shapes: [
      {
        id: 'arr_right',
        name: 'Flecha Conectora',
        type: 'arrow',
        iconName: 'ArrowRight',
        factory: (cx, cy, api) => {
          if (api && typeof api.setActiveTool === 'function') {
            api.setActiveTool({ type: 'arrow' });
            return [];
          }
          return [{ id: `arr_${Date.now()}`, type: 'arrow', x: cx - 75, y: cy, width: 150, height: 0, points: [[0, 0], [150, 0]], strokeColor: '#ffffff', strokeWidth: 2 }];
        },
      },
      {
        id: 'line_straight',
        name: 'Línea Recta',
        type: 'line',
        iconName: 'ArrowRight',
        factory: (cx, cy, api) => {
          if (api && typeof api.setActiveTool === 'function') {
            api.setActiveTool({ type: 'line' });
            return [];
          }
          return [{ id: `line_${Date.now()}`, type: 'line', x: cx - 75, y: cy, width: 150, height: 0, points: [[0, 0], [150, 0]], strokeColor: '#ffffff', strokeWidth: 2 }];
        },
      },
    ],
  },
  {
    id: 'flowchart',
    name: 'Flowchart',
    group: 'STANDARD',
    defaultEnabled: true,
    shapes: [
      { id: 'fc_start', name: 'Inicio / Fin', type: 'ellipse', iconName: 'Circle', factory: (cx, cy) => createOutlineShape('fc_s', 'ellipse', cx, cy, 120, 60, 'INICIO', 0, '#10b981') },
      { id: 'fc_proc', name: 'Proceso', type: 'rectangle', iconName: 'Square', factory: (cx, cy) => createOutlineShape('fc_p', 'rectangle', cx, cy, 140, 70, 'Proceso A', 0, '#3b82f6') },
      { id: 'fc_dec', name: 'Decisión', type: 'diamond', iconName: 'Diamond', factory: (cx, cy) => createOutlineShape('fc_d', 'diamond', cx, cy, 120, 90, '¿Decisión?', 0, '#f59e0b') },
      { id: 'fc_end', name: 'Terminar', type: 'ellipse', iconName: 'Circle', factory: (cx, cy) => createOutlineShape('fc_e', 'ellipse', cx, cy, 120, 60, 'FIN', 0, '#ef4444') },
    ],
  },

  // SOFTWARE ENGINEERING & UML
  {
    id: 'uml',
    name: 'UML 2.5',
    group: 'SOFTWARE',
    defaultEnabled: true,
    shapes: [
      { id: 'u_class', name: 'Clase UML', type: 'rectangle', iconName: 'Boxes', factory: (cx, cy) => createOutlineShape('u_cls', 'rectangle', cx, cy, 160, 100, 'Class: User\n+ id: string\n+ login()', 3, '#ec4899') },
      { id: 'u_actor', name: 'Actor UML', type: 'ellipse', iconName: 'User', factory: (cx, cy) => createUMLActor(cx, cy, 'Actor') },
      { id: 'u_usecase', name: 'Caso de Uso', type: 'ellipse', iconName: 'Circle', factory: (cx, cy) => createOutlineShape('u_uc', 'ellipse', cx, cy, 140, 70, 'UC: Autenticar', 0, '#14b8a6') },
      { id: 'u_package', name: 'Paquete', type: 'rectangle', iconName: 'Boxes', factory: (cx, cy) => createUMLPackage(cx, cy, 'AuthModule') },
    ],
  },
  {
    id: 'entity_relation',
    name: 'Entity Relation (ER)',
    group: 'SOFTWARE',
    defaultEnabled: true,
    shapes: [
      { id: 'er_tbl', name: 'Entidad / Tabla', type: 'rectangle', iconName: 'Database', factory: (cx, cy) => createOutlineShape('er_tbl', 'rectangle', cx, cy, 160, 110, '📋 users\n🔑 id (PK)\n📧 email', 3, '#06b6d4') },
      { id: 'er_rel', name: 'Relación Rombo', type: 'diamond', iconName: 'Diamond', factory: (cx, cy) => createOutlineShape('er_rel', 'diamond', cx, cy, 110, 85, 'Pertenece a', 0, '#06b6d4') },
    ],
  },

  // CLOUD & DEVOPS
  {
    id: 'aws',
    name: 'AWS Cloud',
    group: 'CLOUD',
    defaultEnabled: true,
    shapes: [
      { id: 'aws_ec2', name: 'AWS EC2', type: 'rectangle', iconName: 'Server', factory: (cx, cy) => createOutlineShape('a_ec2', 'rectangle', cx, cy, 140, 75, '☁️ AWS EC2', 3, '#f59e0b') },
      { id: 'aws_s3', name: 'AWS S3', type: 'rectangle', iconName: 'Database', factory: (cx, cy) => createOutlineShape('a_s3', 'rectangle', cx, cy, 140, 75, '🪣 AWS S3', 3, '#d97706') },
      { id: 'aws_lambda', name: 'AWS Lambda', type: 'rectangle', iconName: 'Zap', factory: (cx, cy) => createOutlineShape('a_lmb', 'rectangle', cx, cy, 140, 75, '⚡ Lambda', 3, '#f97316') },
    ],
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    group: 'CLOUD',
    defaultEnabled: true,
    shapes: [
      { id: 'k8s_pod', name: 'K8s Pod', type: 'rectangle', iconName: 'Boxes', factory: (cx, cy) => createOutlineShape('k8s_pod', 'rectangle', cx, cy, 140, 75, '☸️ Pod', 3, '#3b82f6') },
      { id: 'k8s_svc', name: 'K8s Service', type: 'rectangle', iconName: 'Network', factory: (cx, cy) => createOutlineShape('k8s_svc', 'rectangle', cx, cy, 140, 75, '☸️ Service', 3, '#6366f1') },
    ],
  },

  // NETWORK & ELECTRONICS
  {
    id: 'cisco',
    name: 'Cisco Networking',
    group: 'NETWORK',
    defaultEnabled: true,
    shapes: [
      { id: 'c_rtr', name: 'Router', type: 'rectangle', iconName: 'Network', factory: (cx, cy) => createOutlineShape('c_rtr', 'rectangle', cx, cy, 140, 70, '🌐 Router', 3, '#0284c7') },
      { id: 'c_sw', name: 'Switch', type: 'rectangle', iconName: 'Network', factory: (cx, cy) => createOutlineShape('c_sw', 'rectangle', cx, cy, 140, 70, '🔀 Switch L3', 3, '#6366f1') },
      { id: 'c_fw', name: 'Firewall', type: 'rectangle', iconName: 'Shield', factory: (cx, cy) => createOutlineShape('c_fw', 'rectangle', cx, cy, 140, 70, '🛡️ Firewall', 3, '#ef4444') },
    ],
  },
  {
    id: 'electrical',
    name: 'Circuits & Embedded',
    group: 'OTHER',
    defaultEnabled: true,
    shapes: [
      { id: 'el_res', name: 'Resistencia', type: 'rectangle', iconName: 'Zap', factory: (cx, cy) => createOutlineShape('el_res', 'rectangle', cx, cy, 120, 45, '⚡ Resistor 10kΩ', 3, '#fcd34d') },
      { id: 'el_and', name: 'Compuerta AND', type: 'rectangle', iconName: 'Cpu', factory: (cx, cy) => createOutlineShape('el_and', 'rectangle', cx, cy, 120, 55, 'AND Gate', 3, '#3b82f6') },
      { id: 'el_mcu', name: 'Arduino / ESP32', type: 'rectangle', iconName: 'Cpu', factory: (cx, cy) => createOutlineShape('el_mcu', 'rectangle', cx, cy, 160, 85, '📟 ESP32 / MCU', 3, '#14b8a6') },
    ],
  },
];
