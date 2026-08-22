import { DiagramComponentDefinition, CatalogCategory } from '@/types/component-registry';

// Helper generator for standard Excalidraw node with bound text
export function createExcalidrawNode(
  id: string,
  type: 'rectangle' | 'ellipse' | 'diamond',
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  backgroundColor: string,
  label: string,
  options: {
    strokeWidth?: number;
    roundnessType?: number; // 3 for rounded rect
    fontSize?: number;
    textColor?: string;
    fillStyle?: 'solid' | 'hachure' | 'zigzag' | 'cross-hatch';
    extraProps?: Record<string, any>;
  } = {}
) {
  const ts = Date.now();
  const textId = `${id}_text_${ts}`;
  const strokeWidth = options.strokeWidth ?? 2;
  const roundness = options.roundnessType ? { type: options.roundnessType } : null;
  const fontSize = options.fontSize ?? 13;
  const textColor = options.textColor ?? '#ffffff';
  const fillStyle = options.fillStyle ?? 'solid';

  const shapeElement: any = {
    id,
    type,
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor,
    backgroundColor,
    fillStyle,
    strokeWidth,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: [{ id: textId, type: 'text' }],
    updated: Date.now(),
    link: null,
    locked: false,
    ...(options.extraProps || {}),
  };

  const textElement: any = {
    id: textId,
    type: 'text',
    x: x + 10,
    y: y + Math.floor(height / 2) - Math.floor(fontSize / 2) - 4,
    width: width - 20,
    height: fontSize + 8,
    angle: 0,
    strokeColor: textColor,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    fontSize,
    fontFamily: 1,
    text: label,
    originalText: label,
    lineHeight: 1.25,
    textAlign: 'center',
    verticalAlign: 'middle',
    containerId: id,
  };

  return [shapeElement, textElement];
}

// Helper generator for linear arrow / line
export function createExcalidrawLinear(
  id: string,
  type: 'arrow' | 'line',
  x: number,
  y: number,
  width: number,
  height: number,
  points: number[][],
  strokeColor: string,
  options: {
    strokeWidth?: number;
    strokeStyle?: 'solid' | 'dashed' | 'dotted';
    startArrowhead?: string | null;
    endArrowhead?: string | null;
    label?: string;
  } = {}
) {
  const ts = Date.now();
  const linearElement: any = {
    id,
    type,
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: options.strokeWidth ?? 2,
    strokeStyle: options.strokeStyle ?? 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: { type: 2 },
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    points: points && points.length > 0 ? points : [[0, 0], [width, height]],
    startArrowhead: options.startArrowhead ?? null,
    endArrowhead: options.endArrowhead ?? (type === 'arrow' ? 'arrow' : null),
  };

  if (options.label) {
    const textId = `${id}_text_${ts}`;
    linearElement.boundElements = [{ id: textId, type: 'text' }];
    const textElement: any = {
      id: textId,
      type: 'text',
      x: x + Math.floor(width / 2) - 30,
      y: y + Math.floor(height / 2) - 10,
      width: 60,
      height: 20,
      angle: 0,
      strokeColor: '#f1f5f9',
      backgroundColor: '#0f172a',
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      groupIds: [],
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      fontSize: 11,
      fontFamily: 1,
      text: options.label,
      originalText: options.label,
      lineHeight: 1.25,
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: id,
    };
    return [linearElement, textElement];
  }

  return [linearElement];
}

// Master Component Registry
export const COMPONENT_CATALOG: DiagramComponentDefinition[] = [
  // =========================================
  // 1. BASIC SHAPES
  // =========================================
  {
    id: 'basic_rect',
    name: 'Rectángulo',
    category: 'basic',
    subcategory: 'Formas',
    description: 'Bloque estándar para diagramas',
    keywords: ['rectangulo', 'rectangle', 'box', 'caja', 'nodo', 'block'],
    iconName: 'Square',
    color: 'text-indigo-400',
    elementType: 'rectangle',
    supportsText: true,
    supportsConnections: true,
    factory: (cx, cy) => createExcalidrawNode(`rect_${Date.now()}`, 'rectangle', cx - 70, cy - 40, 140, 80, '#6366f1', '#1e1b4b', 'Rectángulo'),
  },
  {
    id: 'basic_round_rect',
    name: 'Rect Redondeado',
    category: 'basic',
    subcategory: 'Formas',
    description: 'Bloque con bordes suaves',
    keywords: ['round', 'redondeado', 'process', 'proceso', 'card'],
    iconName: 'Square',
    color: 'text-violet-400',
    elementType: 'rectangle',
    supportsText: true,
    supportsConnections: true,
    factory: (cx, cy) => createExcalidrawNode(`rrect_${Date.now()}`, 'rectangle', cx - 70, cy - 40, 140, 80, '#8b5cf6', '#2e1065', 'Proceso', { roundnessType: 3 }),
  },
  {
    id: 'basic_ellipse',
    name: 'Círculo / Elipse',
    category: 'basic',
    subcategory: 'Formas',
    description: 'Inicio/Fin o nodo circular',
    keywords: ['circulo', 'elipse', 'circle', 'ellipse', 'start', 'end'],
    iconName: 'Circle',
    color: 'text-sky-400',
    elementType: 'ellipse',
    supportsText: true,
    supportsConnections: true,
    factory: (cx, cy) => createExcalidrawNode(`ell_${Date.now()}`, 'ellipse', cx - 50, cy - 50, 100, 100, '#38bdf8', '#0c4a6e', 'Inicio / Fin'),
  },
  {
    id: 'basic_diamond',
    name: 'Rombo de Decisión',
    category: 'basic',
    subcategory: 'Formas',
    description: 'Evaluación lógica o decisión',
    keywords: ['rombo', 'decision', 'diamond', 'condicion', 'if'],
    iconName: 'Diamond',
    color: 'text-amber-400',
    elementType: 'diamond',
    supportsText: true,
    supportsConnections: true,
    factory: (cx, cy) => createExcalidrawNode(`dia_${Date.now()}`, 'diamond', cx - 60, cy - 50, 120, 100, '#f59e0b', '#451a03', '¿Decisión?'),
  },
  {
    id: 'basic_text',
    name: 'Caja de Texto',
    category: 'basic',
    subcategory: 'Anotaciones',
    description: 'Etiqueta o texto flotante',
    keywords: ['texto', 'text', 'label', 'anotacion', 'nota'],
    iconName: 'Type',
    color: 'text-slate-200',
    elementType: 'text',
    factory: (cx, cy) => [
      {
        id: `txt_${Date.now()}`,
        type: 'text',
        x: cx - 50,
        y: cy - 15,
        width: 100,
        height: 30,
        text: 'Texto Editable',
        fontSize: 18,
        strokeColor: '#f8fafc',
        backgroundColor: 'transparent',
      },
    ],
  },
  {
    id: 'basic_arrow',
    name: 'Flecha Conectora',
    category: 'basic',
    subcategory: 'Conectores',
    description: 'Conector unidireccional',
    keywords: ['flecha', 'arrow', 'linea', 'connector', 'conector'],
    iconName: 'ArrowRight',
    color: 'text-purple-400',
    elementType: 'arrow',
    factory: (cx, cy) => createExcalidrawLinear(`arr_${Date.now()}`, 'arrow', cx - 75, cy, 150, 0, [[0, 0], [150, 0]], '#a855f7'),
  },
  {
    id: 'basic_sticky',
    name: 'Nota Adhesiva',
    category: 'basic',
    subcategory: 'Anotaciones',
    description: 'Post-it para notas de diseño',
    keywords: ['postit', 'sticky', 'note', 'nota', 'comentario'],
    iconName: 'FileText',
    color: 'text-yellow-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`note_${Date.now()}`, 'rectangle', cx - 60, cy - 60, 120, 120, '#fde047', '#854d0e', 'Nota de Diseño\n📌 Recordatorio', { fontSize: 12 }),
  },

  // =========================================
  // 2. SOFTWARE ENGINEERING & ARCHITECTURE
  // =========================================
  {
    id: 'sw_microservice',
    name: 'Microservicio Node.js',
    category: 'software',
    subcategory: 'Backend',
    description: 'Servicio autónomo de backend',
    keywords: ['microservice', 'microservicio', 'node', 'backend', 'api', 'service'],
    iconName: 'Cpu',
    color: 'text-purple-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`swms_${Date.now()}`, 'rectangle', cx - 80, cy - 40, 160, 80, '#a855f7', '#3b0764', '📦 Microservicio\n[Auth / Payment]', { roundnessType: 3 }),
  },
  {
    id: 'sw_api_gateway',
    name: 'API Gateway REST',
    category: 'software',
    subcategory: 'Gateway',
    description: 'Enrutador y proxy de APIs',
    keywords: ['gateway', 'api', 'rest', 'proxy', 'auth', 'kong', 'nginx'],
    iconName: 'Shield',
    color: 'text-rose-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`swgw_${Date.now()}`, 'rectangle', cx - 90, cy - 40, 180, 80, '#f43f5e', '#881337', '🛡️ API Gateway\nhttps://api.domain.com', { roundnessType: 3 }),
  },
  {
    id: 'sw_terminal',
    name: 'CLI / Terminal',
    category: 'software',
    subcategory: 'Herramientas',
    description: 'Consola de comandos',
    keywords: ['terminal', 'cli', 'bash', 'shell', 'console'],
    iconName: 'Terminal',
    color: 'text-emerald-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`swt_${Date.now()}`, 'rectangle', cx - 85, cy - 45, 170, 90, '#10b981', '#022c22', '💻 CLI Terminal\n$ npm run build\n✓ Success in 1.2s', { fontSize: 11 }),
  },
  {
    id: 'sw_db',
    name: 'Base de Datos SQL',
    category: 'software',
    subcategory: 'Storage',
    description: 'Almacenamiento relacional',
    keywords: ['database', 'base de datos', 'sql', 'postgres', 'mysql'],
    iconName: 'Database',
    color: 'text-cyan-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`swdb_${Date.now()}`, 'rectangle', cx - 75, cy - 45, 150, 90, '#06b6d4', '#164e63', '🗄️ PostgreSQL DB\n[Port: 5432]', { roundnessType: 3 }),
  },
  {
    id: 'sw_cache',
    name: 'Caché Redis / Memcached',
    category: 'software',
    subcategory: 'Storage',
    description: 'Caché en memoria de alta velocidad',
    keywords: ['cache', 'redis', 'memcached', 'memory', 'speed'],
    iconName: 'Zap',
    color: 'text-red-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`swc_${Date.now()}`, 'rectangle', cx - 75, cy - 35, 150, 70, '#ef4444', '#7f1d1d', '⚡ Redis Cache\n[In-Memory Store]', { roundnessType: 3 }),
  },
  {
    id: 'sw_queue',
    name: 'Cola de Mensajes Kafka/Rabbit',
    category: 'software',
    subcategory: 'Messaging',
    description: 'Bus de eventos o cola pub/sub',
    keywords: ['queue', 'kafka', 'rabbitmq', 'message', 'bus', 'pubsub'],
    iconName: 'Workflow',
    color: 'text-amber-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`swq_${Date.now()}`, 'rectangle', cx - 85, cy - 35, 170, 70, '#f59e0b', '#78350f', '📨 Apache Kafka\n[Topic: user.created]', { roundnessType: 3 }),
  },

  // =========================================
  // 3. UML DIAGRAMS
  // =========================================
  {
    id: 'uml_class',
    name: 'Clase UML',
    category: 'uml',
    subcategory: 'Estructura',
    description: 'Clase con atributos y métodos',
    keywords: ['uml', 'clase', 'class', 'object', 'oo'],
    iconName: 'Boxes',
    color: 'text-pink-400',
    elementType: 'rectangle',
    factory: (cx, cy) => {
      const ts = Date.now();
      return [
        {
          id: `umlc_${ts}`,
          type: 'rectangle',
          x: cx - 85,
          y: cy - 65,
          width: 170,
          height: 130,
          strokeColor: '#ec4899',
          backgroundColor: '#831843',
          fillStyle: 'solid',
          strokeWidth: 2,
          roundness: { type: 3 },
          seed: 12345,
          version: 1,
        },
        {
          id: `umlc_txt_${ts}`,
          type: 'text',
          x: cx - 75,
          y: cy - 55,
          width: 150,
          height: 110,
          text: '<<Class>> User\n------------------\n+ id: UUID\n+ email: String\n------------------\n+ login(): Boolean\n+ updateProfile()',
          fontSize: 11,
          strokeColor: '#ffffff',
        },
      ];
    },
  },
  {
    id: 'uml_actor',
    name: 'Actor (Usuario)',
    category: 'uml',
    subcategory: 'Casos de Uso',
    description: 'Actor o rol de sistema',
    keywords: ['actor', 'user', 'usuario', 'role', 'person'],
    iconName: 'User',
    color: 'text-emerald-400',
    elementType: 'ellipse',
    factory: (cx, cy) => createExcalidrawNode(`uact_${Date.now()}`, 'ellipse', cx - 40, cy - 45, 80, 90, '#10b981', '#064e3b', '👤 Actor'),
  },
  {
    id: 'uml_usecase',
    name: 'Caso de Uso',
    category: 'uml',
    subcategory: 'Casos de Uso',
    description: 'Acción o función de uso',
    keywords: ['usecase', 'caso de uso', 'action', 'goal'],
    iconName: 'Circle',
    color: 'text-teal-400',
    elementType: 'ellipse',
    factory: (cx, cy) => createExcalidrawNode(`uuc_${Date.now()}`, 'ellipse', cx - 75, cy - 40, 150, 80, '#14b8a6', '#042f2e', 'UC-01: Autenticar'),
  },

  // =========================================
  // 4. DATABASE & ER DIAGRAMS
  // =========================================
  {
    id: 'db_entity',
    name: 'Entidad ER (Tabla)',
    category: 'database',
    subcategory: 'Modelado ER',
    description: 'Tabla relacional con claves PK / FK',
    keywords: ['table', 'tabla', 'entity', 'entidad', 'pk', 'fk', 'er'],
    iconName: 'Database',
    color: 'text-cyan-400',
    elementType: 'rectangle',
    factory: (cx, cy) => {
      const ts = Date.now();
      return [
        {
          id: `dbe_${ts}`,
          type: 'rectangle',
          x: cx - 90,
          y: cy - 70,
          width: 180,
          height: 140,
          strokeColor: '#06b6d4',
          backgroundColor: '#164e63',
          fillStyle: 'solid',
          strokeWidth: 2,
          roundness: { type: 3 },
          seed: 54321,
        },
        {
          id: `dbe_txt_${ts}`,
          type: 'text',
          x: cx - 80,
          y: cy - 60,
          width: 160,
          height: 120,
          text: '📋 TABLE: orders\n================\n🔑 id: INT (PK)\n👤 user_id: INT (FK)\n💵 total: DECIMAL\n📅 created_at: DATE',
          fontSize: 11,
          strokeColor: '#e0f2fe',
        },
      ];
    },
  },

  // =========================================
  // 5. ELECTRONICS & ARDUINO / IOT
  // =========================================
  {
    id: 'hw_arduino',
    name: 'Arduino Uno / ESP32',
    category: 'iot',
    subcategory: 'Placas',
    description: 'Placa de desarrollo microcontrolador',
    keywords: ['arduino', 'esp32', 'raspberry', 'mcu', 'iot', 'hardware'],
    iconName: 'Cpu',
    color: 'text-teal-400',
    elementType: 'rectangle',
    connectionPoints: [
      { id: 'VCC', label: '5V', xPercent: 0.1, yPercent: 0 },
      { id: 'GND', label: 'GND', xPercent: 0.3, yPercent: 0 },
      { id: 'D13', label: 'D13', xPercent: 0.7, yPercent: 0 },
      { id: 'A0', label: 'A0', xPercent: 0.9, yPercent: 1 },
    ],
    factory: (cx, cy) => createExcalidrawNode(`ard_${Date.now()}`, 'rectangle', cx - 95, cy - 55, 190, 110, '#14b8a6', '#042f2e', '📟 Arduino / ESP32\n[VCC | GND | D13 | A0]', { roundnessType: 3 }),
  },
  {
    id: 'hw_sensor',
    name: 'Sensor I2C / Análogo',
    category: 'electronics',
    subcategory: 'Sensores',
    description: 'Captura de temperatura, luz o distancia',
    keywords: ['sensor', 'i2c', 'analog', 'dht11', 'ultrasonic'],
    iconName: 'Zap',
    color: 'text-amber-400',
    elementType: 'ellipse',
    factory: (cx, cy) => createExcalidrawNode(`sen_${Date.now()}`, 'ellipse', cx - 65, cy - 45, 130, 90, '#f59e0b', '#451a03', '📡 Sensor I2C\n[SDA / SCL]'),
  },
  {
    id: 'hw_resistor',
    name: 'Resistencia (Resistor)',
    category: 'electronics',
    subcategory: 'Componentes Pasivos',
    description: 'Resistencia pasiva de circuito (Ω)',
    keywords: ['resistor', 'resistencia', 'ohm', 'circuito', 'pasivo'],
    iconName: 'Zap',
    color: 'text-amber-300',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`res_${Date.now()}`, 'rectangle', cx - 55, cy - 25, 110, 50, '#fcd34d', '#78350f', '⚡ 10kΩ Resistor', { roundnessType: 3, fontSize: 11 }),
  },
  {
    id: 'hw_logic_gate_and',
    name: 'Compuerta Lógica AND',
    category: 'electronics',
    subcategory: 'Lógica Digital',
    description: 'Compuerta digital AND (A AND B)',
    keywords: ['and', 'logic', 'gate', 'compuerta', 'logica', 'digital'],
    iconName: 'Cpu',
    color: 'text-blue-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`gate_and_${Date.now()}`, 'rectangle', cx - 60, cy - 35, 120, 70, '#3b82f6', '#1e3a8a', 'AND Gate\n[A, B ➔ Y]', { roundnessType: 3 }),
  },

  // =========================================
  // 6. NETWORKING & TELECOM
  // =========================================
  {
    id: 'net_router',
    name: 'Router / Switch',
    category: 'networking',
    subcategory: 'Equipos',
    description: 'Conmutador o enrutador de red',
    keywords: ['router', 'switch', 'network', 'red', 'cisco'],
    iconName: 'Network',
    color: 'text-sky-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`rtr_${Date.now()}`, 'rectangle', cx - 80, cy - 40, 160, 80, '#0284c7', '#0c4a6e', '🌐 Router / Switch\n[Subnet: 192.168.1.0/24]', { roundnessType: 3 }),
  },
  {
    id: 'telecom_antenna',
    name: 'Antena 5G / Radiofrecuencia',
    category: 'telecom',
    subcategory: 'Inalámbrico',
    description: 'Torre celular o antena RF',
    keywords: ['antenna', 'antena', '5g', '4g', 'rf', 'cellular', 'telecom'],
    iconName: 'Radio',
    color: 'text-indigo-400',
    elementType: 'diamond',
    factory: (cx, cy) => createExcalidrawNode(`ant_${Date.now()}`, 'diamond', cx - 60, cy - 55, 120, 110, '#6366f1', '#1e1b4b', '📡 Antena 5G RF'),
  },

  // =========================================
  // 7. CLOUD & DEVOPS
  // =========================================
  {
    id: 'cloud_aws_ec2',
    name: 'AWS EC2 Instance',
    category: 'cloud',
    subcategory: 'AWS',
    description: 'Servidor virtual en la nube',
    keywords: ['aws', 'ec2', 'cloud', 'server', 'vps'],
    iconName: 'Server',
    color: 'text-amber-500',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`ec2_${Date.now()}`, 'rectangle', cx - 80, cy - 40, 160, 80, '#f59e0b', '#78350f', '☁️ AWS EC2\n[t3.medium]', { roundnessType: 3 }),
  },
  {
    id: 'devops_docker',
    name: 'Contenedor Docker / K8s',
    category: 'devops',
    subcategory: 'Contenedores',
    description: 'Contenedor o Pod de Kubernetes',
    keywords: ['docker', 'kubernetes', 'k8s', 'container', 'pod', 'devops'],
    iconName: 'Boxes',
    color: 'text-blue-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`k8s_${Date.now()}`, 'rectangle', cx - 85, cy - 40, 170, 80, '#3b82f6', '#1e3a8a', '🐳 Docker Container\n[K8s Pod: app-v1]', { roundnessType: 3 }),
  },

  // =========================================
  // 8. AI / MACHINE LEARNING & DATA
  // =========================================
  {
    id: 'ai_llm_rag',
    name: 'Pipeline RAG / Modelo LLM',
    category: 'ai',
    subcategory: 'Modelos IA',
    description: 'Modelo de lenguaje con base vectorial RAG',
    keywords: ['ai', 'llm', 'rag', 'vector', 'embedding', 'gpt', 'gemini', 'prompt'],
    iconName: 'Brain',
    color: 'text-pink-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`rag_${Date.now()}`, 'rectangle', cx - 90, cy - 45, 180, 90, '#ec4899', '#831843', '🧠 LLM + RAG Engine\n[VectorDB: Pinecone]', { roundnessType: 3 }),
  },
  {
    id: 'data_etl',
    name: 'ETL Data Pipeline',
    category: 'data',
    subcategory: 'Pipelines',
    description: 'Transformación y procesamiento de datos',
    keywords: ['etl', 'pipeline', 'data', 'spark', 'airflow', 'dbt'],
    iconName: 'GitBranch',
    color: 'text-emerald-400',
    elementType: 'rectangle',
    factory: (cx, cy) => createExcalidrawNode(`etl_${Date.now()}`, 'rectangle', cx - 85, cy - 40, 170, 80, '#10b981', '#064e3b', '🔄 ETL Pipeline\n[Spark / Airflow]', { roundnessType: 3 }),
  },
];
