import { instantiateLibraryElements } from './library-loader';

export interface CatalogCategory {
  id: string;
  name: string;
  group: 'BASIC' | 'SOFTWARE' | 'UML' | 'DATABASE' | 'CLOUD' | 'NETWORK' | 'ELECTRONICS' | 'DEVOPS' | 'AI';
  items: CatalogComponent[];
}

export interface CatalogComponent {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  iconName: string;
  factory: (cx: number, cy: number) => any[];
}

// Vector Element Factory Helpers with guaranteed originalText & defensive properties
function makeVectorRect(cx: number, cy: number, w: number, h: number, label: string, strokeColor = '#38bdf8', roundness = 3) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const shapeId = `rect_${ts}`;
  const textId = `txt_${ts}`;
  return [
    {
      id: shapeId,
      type: 'rectangle',
      x: cx - w / 2,
      y: cy - h / 2,
      width: w,
      height: h,
      strokeColor,
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 2,
      roughness: 0,
      roundness: { type: roundness },
      boundElements: [{ id: textId, type: 'text' }],
    },
    {
      id: textId,
      type: 'text',
      x: cx - w / 2 + 10,
      y: cy - 10,
      width: w - 20,
      height: 20,
      strokeColor: '#ffffff',
      fontSize: 13,
      fontFamily: 1,
      text: label,
      originalText: label,
      lineHeight: 1.25,
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: shapeId,
    },
  ];
}

function makeVectorCircle(cx: number, cy: number, r: number, label: string, strokeColor = '#10b981') {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const shapeId = `circ_${ts}`;
  const textId = `txt_${ts}`;
  return [
    {
      id: shapeId,
      type: 'ellipse',
      x: cx - r,
      y: cy - r,
      width: r * 2,
      height: r * 2,
      strokeColor,
      backgroundColor: 'transparent',
      strokeWidth: 2,
      roughness: 0,
      boundElements: [{ id: textId, type: 'text' }],
    },
    {
      id: textId,
      type: 'text',
      x: cx - r + 5,
      y: cy - 10,
      width: r * 2 - 10,
      height: 20,
      strokeColor: '#ffffff',
      fontSize: 12,
      fontFamily: 1,
      text: label,
      originalText: label,
      lineHeight: 1.25,
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: shapeId,
    },
  ];
}

function makeVectorDiamond(cx: number, cy: number, w: number, h: number, label: string, strokeColor = '#f59e0b') {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const shapeId = `dia_${ts}`;
  const textId = `txt_${ts}`;
  return [
    {
      id: shapeId,
      type: 'diamond',
      x: cx - w / 2,
      y: cy - h / 2,
      width: w,
      height: h,
      strokeColor,
      backgroundColor: 'transparent',
      strokeWidth: 2,
      roughness: 0,
      boundElements: [{ id: textId, type: 'text' }],
    },
    {
      id: textId,
      type: 'text',
      x: cx - w / 2 + 10,
      y: cy - 10,
      width: w - 20,
      height: 20,
      strokeColor: '#ffffff',
      fontSize: 12,
      fontFamily: 1,
      text: label,
      originalText: label,
      lineHeight: 1.25,
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: shapeId,
    },
  ];
}

/* =========================================================================
   STANDARD UML 2.5 SPECIFICATION ELEMENT FACTORIES (OMG UML Standard)
   ========================================================================= */

// 1. UML Structure Diagrams Factories
export function makeUmlClassAssembly(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_cls_${ts}`;
  return [
    { id: `cls_hdr_${ts}`, type: 'rectangle', x: cx - 80, y: cy - 55, width: 160, height: 30, strokeColor: '#38bdf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `cls_body_${ts}`, type: 'rectangle', x: cx - 80, y: cy - 25, width: 160, height: 80, strokeColor: '#38bdf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `cls_txt_hdr_${ts}`, type: 'text', x: cx - 75, y: cy - 50, width: 150, height: 20, text: 'ClassName', originalText: 'ClassName', fontSize: 13, strokeColor: '#38bdf8', textAlign: 'center', groupIds: [gid] },
    { id: `cls_txt_body_${ts}`, type: 'text', x: cx - 75, y: cy - 18, width: 150, height: 70, text: '+ attribute1: type\n+ attribute2: type\n---\n+ operation1(): void\n+ operation2(): boolean', originalText: '+ attribute1: type\n+ attribute2: type\n---\n+ operation1(): void\n+ operation2(): boolean', fontSize: 11, strokeColor: '#e2e8f0', textAlign: 'left', groupIds: [gid] },
  ];
}

export function makeUmlAbstractClassAssembly(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_abcls_${ts}`;
  return [
    { id: `abcls_hdr_${ts}`, type: 'rectangle', x: cx - 80, y: cy - 55, width: 160, height: 32, strokeColor: '#c084fc', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `abcls_body_${ts}`, type: 'rectangle', x: cx - 80, y: cy - 23, width: 160, height: 75, strokeColor: '#c084fc', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `abcls_txt_hdr_${ts}`, type: 'text', x: cx - 75, y: cy - 52, width: 150, height: 26, text: '«abstract»\nAbstractClass', originalText: '«abstract»\nAbstractClass', fontSize: 11, strokeColor: '#c084fc', textAlign: 'center', groupIds: [gid] },
    { id: `abcls_txt_body_${ts}`, type: 'text', x: cx - 75, y: cy - 16, width: 150, height: 65, text: '+ id: string\n---\n+ execute()*: void', originalText: '+ id: string\n---\n+ execute()*: void', fontSize: 11, strokeColor: '#e2e8f0', textAlign: 'left', groupIds: [gid] },
  ];
}

export function makeUmlInterfaceAssembly(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_if_${ts}`;
  return [
    { id: `if_hdr_${ts}`, type: 'rectangle', x: cx - 80, y: cy - 55, width: 160, height: 32, strokeColor: '#818cf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `if_body_${ts}`, type: 'rectangle', x: cx - 80, y: cy - 23, width: 160, height: 65, strokeColor: '#818cf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `if_txt_hdr_${ts}`, type: 'text', x: cx - 75, y: cy - 52, width: 150, height: 26, text: '«interface»\nIService', originalText: '«interface»\nIService', fontSize: 11, strokeColor: '#818cf8', textAlign: 'center', groupIds: [gid] },
    { id: `if_txt_body_${ts}`, type: 'text', x: cx - 75, y: cy - 16, width: 150, height: 55, text: '+ start(): void\n+ stop(): void', originalText: '+ start(): void\n+ stop(): void', fontSize: 11, strokeColor: '#e2e8f0', textAlign: 'left', groupIds: [gid] },
  ];
}

export function makeUmlEnumAssembly(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_enum_${ts}`;
  return [
    { id: `enum_hdr_${ts}`, type: 'rectangle', x: cx - 70, y: cy - 50, width: 140, height: 30, strokeColor: '#f59e0b', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `enum_body_${ts}`, type: 'rectangle', x: cx - 70, y: cy - 20, width: 140, height: 70, strokeColor: '#f59e0b', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `enum_txt_hdr_${ts}`, type: 'text', x: cx - 65, y: cy - 48, width: 130, height: 25, text: '«enumeration»\nStatus', originalText: '«enumeration»\nStatus', fontSize: 11, strokeColor: '#f59e0b', textAlign: 'center', groupIds: [gid] },
    { id: `enum_txt_body_${ts}`, type: 'text', x: cx - 65, y: cy - 14, width: 130, height: 60, text: 'PENDING\nACTIVE\nCOMPLETED\nCANCELLED', originalText: 'PENDING\nACTIVE\nCOMPLETED\nCANCELLED', fontSize: 11, strokeColor: '#e2e8f0', textAlign: 'left', groupIds: [gid] },
  ];
}

export function makeUmlObjectAssembly(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_obj_${ts}`;
  return [
    { id: `obj_hdr_${ts}`, type: 'rectangle', x: cx - 75, y: cy - 45, width: 150, height: 28, strokeColor: '#10b981', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `obj_body_${ts}`, type: 'rectangle', x: cx - 75, y: cy - 17, width: 150, height: 55, strokeColor: '#10b981', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `obj_txt_hdr_${ts}`, type: 'text', x: cx - 70, y: cy - 41, width: 140, height: 20, text: 'user1 : User', originalText: 'user1 : User', fontSize: 12, strokeColor: '#10b981', textAlign: 'center', groupIds: [gid] },
    { id: `obj_txt_body_${ts}`, type: 'text', x: cx - 70, y: cy - 12, width: 140, height: 45, text: 'id = "usr_101"\nname = "Alice"', originalText: 'id = "usr_101"\nname = "Alice"', fontSize: 11, strokeColor: '#e2e8f0', textAlign: 'left', groupIds: [gid] },
  ];
}

export function makeUmlPackageAssembly(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_pkg_${ts}`;
  return [
    { id: `pkg_tab_${ts}`, type: 'rectangle', x: cx - 80, y: cy - 55, width: 60, height: 18, strokeColor: '#a855f7', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `pkg_body_${ts}`, type: 'rectangle', x: cx - 80, y: cy - 37, width: 160, height: 80, strokeColor: '#a855f7', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `pkg_txt_${ts}`, type: 'text', x: cx - 70, y: cy - 15, width: 140, height: 20, text: 'PackageName', originalText: 'PackageName', fontSize: 13, strokeColor: '#a855f7', textAlign: 'center', groupIds: [gid] },
  ];
}

export function makeUmlComponentAssembly(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_cmp_${ts}`;
  return [
    { id: `cmp_body_${ts}`, type: 'rectangle', x: cx - 75, y: cy - 45, width: 150, height: 90, strokeColor: '#38bdf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    // Badge small tabs representing UML component icon
    { id: `cmp_t1_${ts}`, type: 'rectangle', x: cx - 85, y: cy - 30, width: 20, height: 12, strokeColor: '#38bdf8', backgroundColor: '#0f172a', fillStyle: 'solid', strokeWidth: 1.5, roughness: 0, groupIds: [gid] },
    { id: `cmp_t2_${ts}`, type: 'rectangle', x: cx - 85, y: cy - 10, width: 20, height: 12, strokeColor: '#38bdf8', backgroundColor: '#0f172a', fillStyle: 'solid', strokeWidth: 1.5, roughness: 0, groupIds: [gid] },
    { id: `cmp_txt_${ts}`, type: 'text', x: cx - 60, y: cy - 15, width: 120, height: 30, text: '«component»\nAuthComponent', originalText: '«component»\nAuthComponent', fontSize: 12, strokeColor: '#ffffff', textAlign: 'center', groupIds: [gid] },
  ];
}

export function makeUmlArtifactAssembly(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_art_${ts}`;
  return [
    { id: `art_body_${ts}`, type: 'rectangle', x: cx - 70, y: cy - 45, width: 140, height: 85, strokeColor: '#34d399', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    // Folded page icon
    { id: `art_fold_${ts}`, type: 'line', x: cx + 45, y: cy - 45, width: 20, height: 20, points: [[0, 0], [20, 20]], strokeColor: '#34d399', strokeWidth: 1.5, roughness: 0, groupIds: [gid] },
    { id: `art_txt_${ts}`, type: 'text', x: cx - 60, y: cy - 15, width: 120, height: 30, text: '«artifact»\nAppServer.jar', originalText: '«artifact»\nAppServer.jar', fontSize: 12, strokeColor: '#ffffff', textAlign: 'center', groupIds: [gid] },
  ];
}

export function makeUmlDeploymentNode(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_node_${ts}`;
  return [
    // Front face
    { id: `node_front_${ts}`, type: 'rectangle', x: cx - 75, y: cy - 35, width: 130, height: 80, strokeColor: '#06b6d4', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    // Top face perspective lines
    { id: `node_top1_${ts}`, type: 'line', x: cx - 75, y: cy - 35, width: 20, height: -20, points: [[0, 0], [20, -20]], strokeColor: '#06b6d4', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `node_top2_${ts}`, type: 'line', x: cx + 55, y: cy - 35, width: 20, height: -20, points: [[0, 0], [20, -20]], strokeColor: '#06b6d4', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `node_top3_${ts}`, type: 'line', x: cx - 55, y: cy - 55, width: 130, height: 0, points: [[0, 0], [130, 0]], strokeColor: '#06b6d4', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    // Right face perspective lines
    { id: `node_side1_${ts}`, type: 'line', x: cx + 55, y: cy + 45, width: 20, height: -20, points: [[0, 0], [20, -20]], strokeColor: '#06b6d4', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `node_side2_${ts}`, type: 'line', x: cx + 75, y: cy - 55, width: 0, height: 80, points: [[0, 0], [0, 80]], strokeColor: '#06b6d4', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `node_txt_${ts}`, type: 'text', x: cx - 65, y: cy - 10, width: 110, height: 30, text: '«device»\nServerNode', originalText: '«device»\nServerNode', fontSize: 12, strokeColor: '#ffffff', textAlign: 'center', groupIds: [gid] },
  ];
}

export function makeUmlPort(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_port_${ts}`;
  return [
    { id: `port_box_${ts}`, type: 'rectangle', x: cx - 12, y: cy - 12, width: 24, height: 24, strokeColor: '#38bdf8', backgroundColor: '#0284c7', fillStyle: 'solid', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `port_txt_${ts}`, type: 'text', x: cx - 40, y: cy + 16, width: 80, height: 16, text: 'port1', originalText: 'port1', fontSize: 11, strokeColor: '#e2e8f0', textAlign: 'center', groupIds: [gid] },
  ];
}

export function makeUmlLollipop(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_lol_${ts}`;
  return [
    { id: `lol_line_${ts}`, type: 'line', x: cx - 40, y: cy, width: 40, height: 0, points: [[0, 0], [40, 0]], strokeColor: '#818cf8', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `lol_head_${ts}`, type: 'ellipse', x: cx, y: cy - 8, width: 16, height: 16, strokeColor: '#818cf8', backgroundColor: '#818cf8', fillStyle: 'solid', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `lol_txt_${ts}`, type: 'text', x: cx - 40, y: cy - 25, width: 80, height: 16, text: 'ProvidedIF', originalText: 'ProvidedIF', fontSize: 11, strokeColor: '#818cf8', textAlign: 'center', groupIds: [gid] },
  ];
}

export function makeUmlSocket(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_sck_${ts}`;
  return [
    { id: `sck_line_${ts}`, type: 'line', x: cx - 40, y: cy, width: 32, height: 0, points: [[0, 0], [32, 0]], strokeColor: '#a855f7', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `sck_arc_${ts}`, type: 'ellipse', x: cx - 8, y: cy - 10, width: 20, height: 20, strokeColor: '#a855f7', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `sck_txt_${ts}`, type: 'text', x: cx - 40, y: cy - 25, width: 80, height: 16, text: 'RequiredIF', originalText: 'RequiredIF', fontSize: 11, strokeColor: '#a855f7', textAlign: 'center', groupIds: [gid] },
  ];
}

// 2. UML Use Case Diagrams Factories
export function makeUmlActorAssembly(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_act_${ts}`;
  return [
    { id: `act_head_${ts}`, type: 'ellipse', x: cx - 15, y: cy - 45, width: 30, height: 30, strokeColor: '#e2e8f0', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `act_body_${ts}`, type: 'line', x: cx, y: cy - 15, width: 0, height: 35, points: [[0, 0], [0, 35]], strokeColor: '#e2e8f0', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `act_arms_${ts}`, type: 'line', x: cx - 25, y: cy - 5, width: 50, height: 0, points: [[0, 0], [50, 0]], strokeColor: '#e2e8f0', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `act_leg1_${ts}`, type: 'line', x: cx, y: cy + 20, width: -20, height: 25, points: [[0, 0], [-20, 25]], strokeColor: '#e2e8f0', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `act_leg2_${ts}`, type: 'line', x: cx, y: cy + 20, width: 20, height: 25, points: [[0, 0], [20, 25]], strokeColor: '#e2e8f0', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `act_txt_${ts}`, type: 'text', x: cx - 50, y: cy + 50, width: 100, height: 20, text: 'Actor', originalText: 'Actor', fontSize: 13, strokeColor: '#ffffff', textAlign: 'center', groupIds: [gid] },
  ];
}

export function makeUmlSystemBoundary(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_sys_${ts}`;
  return [
    { id: `sys_box_${ts}`, type: 'rectangle', x: cx - 120, y: cy - 100, width: 240, height: 200, strokeColor: '#94a3b8', backgroundColor: 'transparent', strokeWidth: 2, strokeStyle: 'dashed', roughness: 0, groupIds: [gid] },
    { id: `sys_txt_${ts}`, type: 'text', x: cx - 110, y: cy - 92, width: 150, height: 20, text: 'Sistema Ideora', originalText: 'Sistema Ideora', fontSize: 12, strokeColor: '#cbd5e1', textAlign: 'left', groupIds: [gid] },
  ];
}

// 3. UML Activity & Behavior Diagram Factories
export function makeUmlInitialNode(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  return [
    { id: `init_${ts}`, type: 'ellipse', x: cx - 12, y: cy - 12, width: 24, height: 24, strokeColor: '#ffffff', backgroundColor: '#ffffff', fillStyle: 'solid', strokeWidth: 2, roughness: 0 },
  ];
}

export function makeUmlActivityFinal(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_af_${ts}`;
  return [
    { id: `af_outer_${ts}`, type: 'ellipse', x: cx - 15, y: cy - 15, width: 30, height: 30, strokeColor: '#ef4444', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `af_inner_${ts}`, type: 'ellipse', x: cx - 9, y: cy - 9, width: 18, height: 18, strokeColor: '#ef4444', backgroundColor: '#ef4444', fillStyle: 'solid', strokeWidth: 1, roughness: 0, groupIds: [gid] },
  ];
}

export function makeUmlFlowFinal(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_ff_${ts}`;
  return [
    { id: `ff_circ_${ts}`, type: 'ellipse', x: cx - 14, y: cy - 14, width: 28, height: 28, strokeColor: '#f59e0b', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `ff_l1_${ts}`, type: 'line', x: cx - 9, y: cy - 9, width: 18, height: 18, points: [[0, 0], [18, 18]], strokeColor: '#f59e0b', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `ff_l2_${ts}`, type: 'line', x: cx - 9, y: cy + 9, width: 18, height: -18, points: [[0, 0], [18, -18]], strokeColor: '#f59e0b', strokeWidth: 2, roughness: 0, groupIds: [gid] },
  ];
}

export function makeUmlForkBarH(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  return [
    { id: `fork_h_${ts}`, type: 'rectangle', x: cx - 70, y: cy - 4, width: 140, height: 8, strokeColor: '#ffffff', backgroundColor: '#ffffff', fillStyle: 'solid', strokeWidth: 1, roughness: 0 },
  ];
}

export function makeUmlForkBarV(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  return [
    { id: `fork_v_${ts}`, type: 'rectangle', x: cx - 4, y: cy - 70, width: 8, height: 140, strokeColor: '#ffffff', backgroundColor: '#ffffff', fillStyle: 'solid', strokeWidth: 1, roughness: 0 },
  ];
}

export function makeUmlSendSignal(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const shapeId = `sig_send_${ts}`;
  const textId = `sig_txt_${ts}`;
  return [
    {
      id: shapeId,
      type: 'rectangle',
      x: cx - 65,
      y: cy - 25,
      width: 130,
      height: 50,
      strokeColor: '#38bdf8',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 2,
      roughness: 0,
      roundness: { type: 3 },
      boundElements: [{ id: textId, type: 'text' }],
    },
    {
      id: textId,
      type: 'text',
      x: cx - 55,
      y: cy - 10,
      width: 110,
      height: 20,
      text: 'Enviar Señal ✉️',
      originalText: 'Enviar Señal ✉️',
      fontSize: 12,
      strokeColor: '#38bdf8',
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: shapeId,
    },
  ];
}

// 4. UML Sequence Diagram Factories
export function makeUmlLifeline(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_life_${ts}`;
  return [
    { id: `life_hdr_${ts}`, type: 'rectangle', x: cx - 60, y: cy - 120, width: 120, height: 40, strokeColor: '#38bdf8', backgroundColor: '#0f172a', fillStyle: 'solid', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `life_hdr_txt_${ts}`, type: 'text', x: cx - 50, y: cy - 110, width: 100, height: 20, text: ': Participant', originalText: ': Participant', fontSize: 13, strokeColor: '#38bdf8', textAlign: 'center', groupIds: [gid] },
    { id: `life_line_${ts}`, type: 'line', x: cx, y: cy - 80, width: 0, height: 200, points: [[0, 0], [0, 200]], strokeColor: '#64748b', strokeWidth: 2, strokeStyle: 'dashed', roughness: 0, groupIds: [gid] },
  ];
}

export function makeUmlActivationBar(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  return [
    { id: `act_bar_${ts}`, type: 'rectangle', x: cx - 8, y: cy - 40, width: 16, height: 80, strokeColor: '#38bdf8', backgroundColor: '#0284c7', fillStyle: 'solid', strokeWidth: 2, roughness: 0 },
  ];
}

export function makeUmlCombinedFragment(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_frag_${ts}`;
  return [
    { id: `frag_box_${ts}`, type: 'rectangle', x: cx - 130, y: cy - 80, width: 260, height: 160, strokeColor: '#818cf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `frag_tab_${ts}`, type: 'rectangle', x: cx - 130, y: cy - 80, width: 50, height: 22, strokeColor: '#818cf8', backgroundColor: '#1e1b4b', fillStyle: 'solid', strokeWidth: 1.5, roughness: 0, groupIds: [gid] },
    { id: `frag_tab_txt_${ts}`, type: 'text', x: cx - 125, y: cy - 76, width: 40, height: 16, text: 'alt', originalText: 'alt', fontSize: 11, strokeColor: '#818cf8', textAlign: 'center', groupIds: [gid] },
    { id: `frag_sep_${ts}`, type: 'line', x: cx - 130, y: cy, width: 260, height: 0, points: [[0, 0], [260, 0]], strokeColor: '#818cf8', strokeWidth: 1.5, strokeStyle: 'dashed', roughness: 0, groupIds: [gid] },
  ];
}

// 5. UML State Machine Factories
export function makeUmlHistoryState(cx: number, cy: number, deep = false) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_hist_${ts}`;
  const label = deep ? 'H*' : 'H';
  return [
    { id: `hist_circ_${ts}`, type: 'ellipse', x: cx - 14, y: cy - 14, width: 28, height: 28, strokeColor: '#f59e0b', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `hist_txt_${ts}`, type: 'text', x: cx - 10, y: cy - 9, width: 20, height: 18, text: label, originalText: label, fontSize: 13, strokeColor: '#f59e0b', textAlign: 'center', groupIds: [gid] },
  ];
}

// 6. UML Standard Line Connectors
export function makeUmlRelation(
  type: 'generalization' | 'dependency' | 'realization' | 'aggregation' | 'composition' | 'include' | 'extend',
  cx: number,
  cy: number
) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const lineId = `rel_${type}_${ts}`;

  let strokeStyle: 'solid' | 'dashed' = 'solid';
  let startArrowhead: string | null = null;
  let endArrowhead: string | null = null;
  let label = '';

  switch (type) {
    case 'generalization':
      endArrowhead = 'triangle';
      label = 'Herencia';
      break;
    case 'dependency':
      strokeStyle = 'dashed';
      endArrowhead = 'arrow';
      label = 'Dependencia';
      break;
    case 'realization':
      strokeStyle = 'dashed';
      endArrowhead = 'triangle';
      label = 'Realización';
      break;
    case 'aggregation':
      endArrowhead = 'diamond';
      label = 'Agregación';
      break;
    case 'composition':
      endArrowhead = 'diamond_full';
      label = 'Composición';
      break;
    case 'include':
      strokeStyle = 'dashed';
      endArrowhead = 'arrow';
      label = '«include»';
      break;
    case 'extend':
      strokeStyle = 'dashed';
      endArrowhead = 'arrow';
      label = '«extend»';
      break;
  }

  const lineElement: any = {
    id: lineId,
    type: 'arrow',
    x: cx - 75,
    y: cy,
    width: 150,
    height: 0,
    points: [[0, 0], [150, 0]],
    strokeColor: '#38bdf8',
    strokeWidth: 2,
    strokeStyle,
    roughness: 0,
    startArrowhead,
    endArrowhead,
  };

  if (label) {
    const textId = `${lineId}_txt`;
    lineElement.boundElements = [{ id: textId, type: 'text' }];
    const textElement: any = {
      id: textId,
      type: 'text',
      x: cx - 40,
      y: cy - 12,
      width: 80,
      height: 20,
      text: label,
      originalText: label,
      fontSize: 11,
      strokeColor: '#ffffff',
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: lineId,
    };
    return [lineElement, textElement];
  }

  return [lineElement];
}

// Hardware & Microcontrollers
function makeArduinoUnoAssembly(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_ard_${ts}`;
  return [
    { id: `ard_pcb_${ts}`, type: 'rectangle', x: cx - 90, y: cy - 65, width: 180, height: 130, strokeColor: '#06b6d4', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, roundness: { type: 3 }, groupIds: [gid] },
    { id: `ard_mcu_${ts}`, type: 'rectangle', x: cx - 40, y: cy - 20, width: 80, height: 35, strokeColor: '#e2e8f0', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `ard_usb_${ts}`, type: 'rectangle', x: cx - 85, y: cy - 45, width: 35, height: 40, strokeColor: '#94a3b8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `ard_dpins_${ts}`, type: 'rectangle', x: cx - 60, y: cy - 60, width: 120, height: 12, strokeColor: '#cbd5e1', backgroundColor: 'transparent', strokeWidth: 1, roughness: 0, groupIds: [gid] },
    { id: `ard_apins_${ts}`, type: 'rectangle', x: cx - 60, y: cy + 48, width: 120, height: 12, strokeColor: '#cbd5e1', backgroundColor: 'transparent', strokeWidth: 1, roughness: 0, groupIds: [gid] },
    { id: `ard_txt_${ts}`, type: 'text', x: cx - 70, y: cy + 20, width: 140, height: 20, text: '📟 Arduino Uno R3', originalText: '📟 Arduino Uno R3', fontSize: 13, strokeColor: '#06b6d4', textAlign: 'center', groupIds: [gid] },
  ];
}

function makePostgresTableAssembly(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_pg_${ts}`;
  return [
    { id: `pg_hdr_${ts}`, type: 'rectangle', x: cx - 80, y: cy - 50, width: 160, height: 30, strokeColor: '#38bdf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `pg_body_${ts}`, type: 'rectangle', x: cx - 80, y: cy - 20, width: 160, height: 75, strokeColor: '#38bdf8', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `pg_txt_hdr_${ts}`, type: 'text', x: cx - 75, y: cy - 45, width: 150, height: 20, text: '🐘 users', originalText: '🐘 users', fontSize: 13, strokeColor: '#38bdf8', textAlign: 'center', groupIds: [gid] },
    { id: `pg_txt_body_${ts}`, type: 'text', x: cx - 75, y: cy - 12, width: 150, height: 60, text: '🔑 id : UUID (PK)\n📧 email : string\n📅 created_at : ts', originalText: '🔑 id : UUID (PK)\n📧 email : string\n📅 created_at : ts', fontSize: 11, strokeColor: '#e2e8f0', textAlign: 'left', groupIds: [gid] },
  ];
}

function makeLogicGateAND(cx: number, cy: number) {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const gid = `grp_and_${ts}`;
  return [
    { id: `and_body_${ts}`, type: 'rectangle', x: cx - 40, y: cy - 30, width: 60, height: 60, strokeColor: '#a855f7', backgroundColor: 'transparent', strokeWidth: 2, roughness: 0, roundness: { type: 3 }, groupIds: [gid] },
    { id: `and_in1_${ts}`, type: 'line', x: cx - 60, y: cy - 15, width: 20, height: 0, points: [[0, 0], [20, 0]], strokeColor: '#a855f7', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `and_in2_${ts}`, type: 'line', x: cx - 60, y: cy + 15, width: 20, height: 0, points: [[0, 0], [20, 0]], strokeColor: '#a855f7', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `and_out_${ts}`, type: 'line', x: cx + 20, y: cy, width: 20, height: 0, points: [[0, 0], [20, 0]], strokeColor: '#a855f7', strokeWidth: 2, roughness: 0, groupIds: [gid] },
    { id: `and_txt_${ts}`, type: 'text', x: cx - 35, y: cy - 10, width: 50, height: 20, text: 'AND', originalText: 'AND', fontSize: 13, strokeColor: '#ffffff', textAlign: 'center', groupIds: [gid] },
  ];
}

/* =========================================================================
   MASTER COMPONENT CATALOG WITH COMPLETE OMG UML 2.5 CATEGORIES
   ========================================================================= */

export const OFFICIAL_COMPONENT_CATALOG: CatalogCategory[] = [
  // 1. UML STRUCTURE DIAGRAMS (OMG UML 2.5)
  {
    id: 'uml_structure',
    name: 'UML 2.5 Structure Diagrams',
    group: 'UML',
    items: [
      { id: 'u_class', name: 'Clase UML (Class)', category: 'uml_structure', keywords: ['class', 'uml', 'object', 'clase'], iconName: 'Square', factory: (cx, cy) => makeUmlClassAssembly(cx, cy) },
      { id: 'u_abstract', name: 'Clase Abstracta', category: 'uml_structure', keywords: ['abstract', 'class', 'uml'], iconName: 'Square', factory: (cx, cy) => makeUmlAbstractClassAssembly(cx, cy) },
      { id: 'u_interface', name: 'Interfaz (Interface)', category: 'uml_structure', keywords: ['interface', 'uml', 'service'], iconName: 'Square', factory: (cx, cy) => makeUmlInterfaceAssembly(cx, cy) },
      { id: 'u_enum', name: 'Enumeración (Enum)', category: 'uml_structure', keywords: ['enum', 'enumeration', 'uml'], iconName: 'Square', factory: (cx, cy) => makeUmlEnumAssembly(cx, cy) },
      { id: 'u_object', name: 'Objeto / Instancia', category: 'uml_structure', keywords: ['object', 'instance', 'uml'], iconName: 'Square', factory: (cx, cy) => makeUmlObjectAssembly(cx, cy) },
      { id: 'u_package', name: 'Paquete (Package)', category: 'uml_structure', keywords: ['package', 'folder', 'uml'], iconName: 'Layers', factory: (cx, cy) => makeUmlPackageAssembly(cx, cy) },
      { id: 'u_component', name: 'Componente UML', category: 'uml_structure', keywords: ['component', 'module', 'uml'], iconName: 'Boxes', factory: (cx, cy) => makeUmlComponentAssembly(cx, cy) },
      { id: 'u_artifact', name: 'Artefacto (Artifact)', category: 'uml_structure', keywords: ['artifact', 'file', 'jar'], iconName: 'File', factory: (cx, cy) => makeUmlArtifactAssembly(cx, cy) },
      { id: 'u_node', name: 'Nodo / Dispositivo 3D', category: 'uml_structure', keywords: ['node', 'device', 'server', '3d'], iconName: 'Server', factory: (cx, cy) => makeUmlDeploymentNode(cx, cy) },
      { id: 'u_port', name: 'Puerto (Port)', category: 'uml_structure', keywords: ['port', 'connection', 'uml'], iconName: 'Square', factory: (cx, cy) => makeUmlPort(cx, cy) },
      { id: 'u_lollipop', name: 'Interfaz Provista (Lollipop)', category: 'uml_structure', keywords: ['lollipop', 'provided', 'interface'], iconName: 'Circle', factory: (cx, cy) => makeUmlLollipop(cx, cy) },
      { id: 'u_socket', name: 'Interfaz Requerida (Socket)', category: 'uml_structure', keywords: ['socket', 'required', 'interface'], iconName: 'Circle', factory: (cx, cy) => makeUmlSocket(cx, cy) },
    ],
  },

  // 2. UML USE CASE DIAGRAMS
  {
    id: 'uml_usecase_cat',
    name: 'UML 2.5 Use Case Diagrams',
    group: 'UML',
    items: [
      { id: 'u_actor', name: 'Actor UML', category: 'uml_usecase_cat', keywords: ['actor', 'user', 'stick', 'uml'], iconName: 'User', factory: (cx, cy) => makeUmlActorAssembly(cx, cy) },
      { id: 'u_usecase', name: 'Caso de Uso', category: 'uml_usecase_cat', keywords: ['usecase', 'ellipse', 'uml'], iconName: 'Circle', factory: (cx, cy) => makeVectorCircle(cx, cy, 60, 'Caso de Uso', '#38bdf8') },
      { id: 'u_sys_boundary', name: 'Límite del Sistema', category: 'uml_usecase_cat', keywords: ['system', 'boundary', 'box'], iconName: 'Square', factory: (cx, cy) => makeUmlSystemBoundary(cx, cy) },
    ],
  },

  // 3. UML ACTIVITY & BEHAVIOR DIAGRAMS
  {
    id: 'uml_activity',
    name: 'UML 2.5 Activity Diagrams',
    group: 'UML',
    items: [
      { id: 'u_initial_node', name: 'Nodo Inicial Actividad', category: 'uml_activity', keywords: ['initial', 'start', 'activity'], iconName: 'Circle', factory: (cx, cy) => makeUmlInitialNode(cx, cy) },
      { id: 'u_activity_final', name: 'Nodo Final Actividad', category: 'uml_activity', keywords: ['final', 'end', 'bullseye'], iconName: 'Circle', factory: (cx, cy) => makeUmlActivityFinal(cx, cy) },
      { id: 'u_flow_final', name: 'Nodo Final de Flujo', category: 'uml_activity', keywords: ['flow', 'final', 'cancel'], iconName: 'Circle', factory: (cx, cy) => makeUmlFlowFinal(cx, cy) },
      { id: 'u_action', name: 'Acción / Estado', category: 'uml_activity', keywords: ['action', 'activity', 'state'], iconName: 'Square', factory: (cx, cy) => makeVectorRect(cx, cy, 140, 60, 'Acción / Estado', '#38bdf8', 3) },
      { id: 'u_decision', name: 'Nodo Decisión (Rombo)', category: 'uml_activity', keywords: ['decision', 'merge', 'if'], iconName: 'Diamond', factory: (cx, cy) => makeVectorDiamond(cx, cy, 120, 80, '¿Decisión?', '#f59e0b') },
      { id: 'u_fork_bar_h', name: 'Barra Fork/Join (Horiz)', category: 'uml_activity', keywords: ['fork', 'join', 'bar', 'horizontal'], iconName: 'Square', factory: (cx, cy) => makeUmlForkBarH(cx, cy) },
      { id: 'u_fork_bar_v', name: 'Barra Fork/Join (Vert)', category: 'uml_activity', keywords: ['fork', 'join', 'bar', 'vertical'], iconName: 'Square', factory: (cx, cy) => makeUmlForkBarV(cx, cy) },
      { id: 'u_send_signal', name: 'Enviar Señal', category: 'uml_activity', keywords: ['signal', 'send', 'event'], iconName: 'Square', factory: (cx, cy) => makeUmlSendSignal(cx, cy) },
    ],
  },

  // 4. UML SEQUENCE & INTERACTION DIAGRAMS
  {
    id: 'uml_sequence',
    name: 'UML 2.5 Sequence & Interaction',
    group: 'UML',
    items: [
      { id: 'u_lifeline', name: 'Línea de Vida (Lifeline)', category: 'uml_sequence', keywords: ['lifeline', 'participant', 'sequence'], iconName: 'Square', factory: (cx, cy) => makeUmlLifeline(cx, cy) },
      { id: 'u_activation', name: 'Barra de Activación', category: 'uml_sequence', keywords: ['activation', 'bar', 'execution'], iconName: 'Square', factory: (cx, cy) => makeUmlActivationBar(cx, cy) },
      { id: 'u_combined_fragment', name: 'Fragmento Combinado (alt/loop)', category: 'uml_sequence', keywords: ['fragment', 'alt', 'loop', 'opt', 'frame'], iconName: 'Square', factory: (cx, cy) => makeUmlCombinedFragment(cx, cy) },
    ],
  },

  // 5. UML STATE MACHINE DIAGRAMS
  {
    id: 'uml_state',
    name: 'UML 2.5 State Machine',
    group: 'UML',
    items: [
      { id: 'u_state_start', name: 'Estado Inicial', category: 'uml_state', keywords: ['start', 'state'], iconName: 'Circle', factory: (cx, cy) => makeUmlInitialNode(cx, cy) },
      { id: 'u_state_final', name: 'Estado Final', category: 'uml_state', keywords: ['final', 'state'], iconName: 'Circle', factory: (cx, cy) => makeUmlActivityFinal(cx, cy) },
      { id: 'u_state', name: 'Estado (State)', category: 'uml_state', keywords: ['state', 'rounded'], iconName: 'Square', factory: (cx, cy) => makeVectorRect(cx, cy, 130, 60, 'Estado Activo', '#10b981', 3) },
      { id: 'u_history_state', name: 'Estado Historia (H)', category: 'uml_state', keywords: ['history', 'state', 'h'], iconName: 'Circle', factory: (cx, cy) => makeUmlHistoryState(cx, cy, false) },
      { id: 'u_deep_history', name: 'Historia Profunda (H*)', category: 'uml_state', keywords: ['deep', 'history', 'h*'], iconName: 'Circle', factory: (cx, cy) => makeUmlHistoryState(cx, cy, true) },
    ],
  },

  // 6. UML RELATIONSHIPS & CONNECTORS
  {
    id: 'uml_relationships',
    name: 'UML 2.5 Relationships & Connectors',
    group: 'UML',
    items: [
      { id: 'u_rel_gen', name: 'Generalización / Herencia', category: 'uml_relationships', keywords: ['generalization', 'inheritance', 'arrow'], iconName: 'ArrowRight', factory: (cx, cy) => makeUmlRelation('generalization', cx, cy) },
      { id: 'u_rel_dep', name: 'Dependencia', category: 'uml_relationships', keywords: ['dependency', 'dashed'], iconName: 'ArrowRight', factory: (cx, cy) => makeUmlRelation('dependency', cx, cy) },
      { id: 'u_rel_real', name: 'Realización / Interfaz', category: 'uml_relationships', keywords: ['realization', 'interface'], iconName: 'ArrowRight', factory: (cx, cy) => makeUmlRelation('realization', cx, cy) },
      { id: 'u_rel_agg', name: 'Agregación (Rombo Hueco)', category: 'uml_relationships', keywords: ['aggregation', 'diamond'], iconName: 'Diamond', factory: (cx, cy) => makeUmlRelation('aggregation', cx, cy) },
      { id: 'u_rel_comp', name: 'Composición (Rombo Relleno)', category: 'uml_relationships', keywords: ['composition', 'diamond'], iconName: 'Diamond', factory: (cx, cy) => makeUmlRelation('composition', cx, cy) },
      { id: 'u_rel_include', name: 'Relación «include»', category: 'uml_relationships', keywords: ['include', 'usecase'], iconName: 'ArrowRight', factory: (cx, cy) => makeUmlRelation('include', cx, cy) },
      { id: 'u_rel_extend', name: 'Relación «extend»', category: 'uml_relationships', keywords: ['extend', 'usecase'], iconName: 'ArrowRight', factory: (cx, cy) => makeUmlRelation('extend', cx, cy) },
    ],
  },

  // GENERAL & BASIC SHAPES
  {
    id: 'basic',
    name: 'Basic & General',
    group: 'BASIC',
    items: [
      { id: 'b_rect', name: 'Rectángulo', category: 'basic', keywords: ['rectangle', 'box', 'rect'], iconName: 'Square', factory: (cx, cy) => makeVectorRect(cx, cy, 140, 80, '') },
      { id: 'b_rrect', name: 'Rect Redondeado', category: 'basic', keywords: ['process', 'rounded'], iconName: 'Square', factory: (cx, cy) => makeVectorRect(cx, cy, 140, 80, '', '#38bdf8', 3) },
      { id: 'b_circle', name: 'Círculo / Elipse', category: 'basic', keywords: ['circle', 'ellipse', 'start', 'end'], iconName: 'Circle', factory: (cx, cy) => makeVectorCircle(cx, cy, 50, '') },
      { id: 'b_diamond', name: 'Rombo Decisión', category: 'basic', keywords: ['decision', 'diamond', 'if'], iconName: 'Diamond', factory: (cx, cy) => makeVectorDiamond(cx, cy, 120, 90, '') },
    ],
  },

  // SOFTWARE ARCHITECTURE
  {
    id: 'software',
    name: 'Software Architecture & System Design',
    group: 'SOFTWARE',
    items: [
      { id: 's_fe', name: 'Frontend (React/Web)', category: 'software', keywords: ['react', 'frontend', 'web', 'ui'], iconName: 'Square', factory: (cx, cy) => makeVectorRect(cx, cy, 150, 80, '💻 Frontend App', '#38bdf8') },
      { id: 's_gw', name: 'API Gateway', category: 'software', keywords: ['api', 'gateway', 'proxy'], iconName: 'Boxes', factory: (cx, cy) => makeVectorRect(cx, cy, 160, 80, '🌐 API Gateway', '#818cf8') },
      { id: 's_ms', name: 'Microservicio', category: 'software', keywords: ['microservice', 'service', 'api', 'backend'], iconName: 'Server', factory: (cx, cy) => makeVectorRect(cx, cy, 150, 80, '⚙️ Microservicio', '#c084fc') },
      { id: 's_lb', name: 'Load Balancer', category: 'software', keywords: ['load balancer', 'lb', 'nginx'], iconName: 'Network', factory: (cx, cy) => makeVectorRect(cx, cy, 150, 75, '🔀 Load Balancer', '#38bdf8') },
      { id: 's_mq', name: 'Message Queue / RabbitMQ', category: 'software', keywords: ['queue', 'rabbitmq', 'kafka', 'pubsub'], iconName: 'Boxes', factory: (cx, cy) => makeVectorRect(cx, cy, 160, 75, '📨 Message Queue', '#f59e0b') },
    ],
  },

  // DATABASES & STORAGE
  {
    id: 'database',
    name: 'Databases & Storage',
    group: 'DATABASE',
    items: [
      { id: 'db_pg', name: 'PostgreSQL Tabla', category: 'database', keywords: ['postgres', 'postgresql', 'table', 'db'], iconName: 'Database', factory: (cx, cy) => makePostgresTableAssembly(cx, cy) },
      { id: 'db_redis', name: 'Redis Cache', category: 'database', keywords: ['redis', 'cache', 'key-value'], iconName: 'Database', factory: (cx, cy) => makeVectorRect(cx, cy, 140, 75, '🔴 Redis Cache', '#ef4444') },
      { id: 'db_mongo', name: 'MongoDB / NoSQL', category: 'database', keywords: ['mongo', 'mongodb', 'nosql'], iconName: 'Database', factory: (cx, cy) => makeVectorRect(cx, cy, 140, 75, '🍃 MongoDB', '#10b981') },
    ],
  },

  // CLOUD AWS
  {
    id: 'cloud_aws',
    name: 'AWS Cloud',
    group: 'CLOUD',
    items: [
      { id: 'aws_lambda', name: 'AWS Lambda (Serverless)', category: 'cloud_aws', keywords: ['aws', 'lambda', 'serverless', 'function'], iconName: 'Zap', factory: (cx, cy) => makeVectorRect(cx, cy, 150, 80, '⚡ AWS Lambda', '#f97316') },
      { id: 'aws_s3', name: 'AWS S3 Bucket', category: 'cloud_aws', keywords: ['aws', 's3', 'bucket', 'storage'], iconName: 'Database', factory: (cx, cy) => makeVectorRect(cx, cy, 150, 80, '🪣 AWS S3', '#d97706') },
      { id: 'aws_ec2', name: 'AWS EC2 Instance', category: 'cloud_aws', keywords: ['aws', 'ec2', 'instance', 'vm'], iconName: 'Server', factory: (cx, cy) => makeVectorRect(cx, cy, 150, 80, '☁️ AWS EC2', '#f59e0b') },
    ],
  },

  // DEVOPS & KUBERNETES
  {
    id: 'devops_k8s',
    name: 'Kubernetes & DevOps',
    group: 'DEVOPS',
    items: [
      { id: 'k8s_pod', name: 'K8s Pod', category: 'devops_k8s', keywords: ['kubernetes', 'k8s', 'pod', 'container'], iconName: 'Boxes', factory: (cx, cy) => makeVectorRect(cx, cy, 140, 75, '☸️ K8s Pod', '#3b82f6') },
      { id: 'k8s_svc', name: 'K8s Service', category: 'devops_k8s', keywords: ['kubernetes', 'k8s', 'service'], iconName: 'Network', factory: (cx, cy) => makeVectorRect(cx, cy, 140, 75, '☸️ K8s Service', '#6366f1') },
      { id: 'd_docker', name: 'Docker Container', category: 'devops_k8s', keywords: ['docker', 'container'], iconName: 'Boxes', factory: (cx, cy) => makeVectorRect(cx, cy, 150, 75, '🐳 Docker Container', '#0284c7') },
    ],
  },

  // ELECTRONICS & IOT
  {
    id: 'electronics_iot',
    name: 'Arduino, Electronics & IoT',
    group: 'ELECTRONICS',
    items: [
      { id: 'e_arduino', name: 'Arduino Uno R3 Board', category: 'electronics_iot', keywords: ['arduino', 'uno', 'microcontroller', 'iot'], iconName: 'Cpu', factory: (cx, cy) => makeArduinoUnoAssembly(cx, cy) },
      { id: 'e_esp32', name: 'ESP32 Wi-Fi / BT', category: 'electronics_iot', keywords: ['esp32', 'wifi', 'bluetooth', 'iot'], iconName: 'Cpu', factory: (cx, cy) => makeVectorRect(cx, cy, 160, 90, '📟 ESP32 MCU', '#14b8a6') },
      { id: 'e_resistor', name: 'Resistencia 10kΩ', category: 'electronics_iot', keywords: ['resistor', 'electronics', 'schematic'], iconName: 'Zap', factory: (cx, cy) => makeVectorRect(cx, cy, 120, 50, '⚡ Resistor 10kΩ', '#fcd34d') },
    ],
  },

  // LOGIC GATES
  {
    id: 'logic_gates',
    name: 'Logic Gates',
    group: 'ELECTRONICS',
    items: [
      { id: 'lg_and', name: 'Compuerta AND', category: 'logic_gates', keywords: ['and', 'gate', 'logic'], iconName: 'Cpu', factory: (cx, cy) => makeLogicGateAND(cx, cy) },
      { id: 'lg_or', name: 'Compuerta OR', category: 'logic_gates', keywords: ['or', 'gate', 'logic'], iconName: 'Cpu', factory: (cx, cy) => makeVectorRect(cx, cy, 130, 65, 'OR Gate', '#a855f7') },
      { id: 'lg_not', name: 'Compuerta NOT (Inversor)', category: 'logic_gates', keywords: ['not', 'inverter', 'logic'], iconName: 'Cpu', factory: (cx, cy) => makeVectorRect(cx, cy, 120, 60, 'NOT Gate', '#ec4899') },
    ],
  },
];
