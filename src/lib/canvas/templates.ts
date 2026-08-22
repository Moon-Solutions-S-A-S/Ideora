import { createExcalidrawNode, createExcalidrawLinear } from './component-registry';

export interface DiagramTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  mode: string;
  factory: () => any[];
}

export const DIAGRAM_TEMPLATES: DiagramTemplate[] = [
  // 1. SOFTWARE: 3-TIER ARCHITECTURE
  {
    id: 'tpl_3tier',
    title: 'Arquitectura 3 Capas (3-Tier)',
    category: 'Software Architecture',
    description: 'Frontend Web/Mobile ➔ API Gateway ➔ Microservicios ➔ PostgreSQL DB',
    mode: 'software',
    factory: () => {
      const ts = Date.now();
      const elements: any[] = [];

      // Layer 1: Client
      elements.push(...createExcalidrawNode(`t3_cli_${ts}`, 'rectangle', 100, 200, 160, 80, '#3b82f6', '#1e3a8a', '🌐 Client Web App\n[Next.js / React]', { roundnessType: 3 }));
      // Layer 2: API Gateway
      elements.push(...createExcalidrawNode(`t3_gw_${ts}`, 'rectangle', 350, 200, 160, 80, '#8b5cf6', '#3b0764', '🛡️ API Gateway\n[Auth / Rate Limit]', { roundnessType: 3 }));
      // Layer 3: Microservice
      elements.push(...createExcalidrawNode(`t3_srv_${ts}`, 'rectangle', 600, 200, 160, 80, '#a855f7', '#4c1d95', '⚡ Core Service\n[Node.js REST]', { roundnessType: 3 }));
      // Layer 4: DB & Cache
      elements.push(...createExcalidrawNode(`t3_db_${ts}`, 'rectangle', 850, 140, 160, 80, '#06b6d4', '#164e63', '🗄️ PostgreSQL\n[Primary DB]', { roundnessType: 3 }));
      elements.push(...createExcalidrawNode(`t3_cache_${ts}`, 'rectangle', 850, 260, 160, 80, '#ef4444', '#7f1d1d', '⚡ Redis Cache\n[Session Store]', { roundnessType: 3 }));

      // Connections
      elements.push(...createExcalidrawLinear(`t3_arr1_${ts}`, 'arrow', 260, 240, 90, 0, [[0, 0], [90, 0]], '#3b82f6', { label: 'HTTPS' }));
      elements.push(...createExcalidrawLinear(`t3_arr2_${ts}`, 'arrow', 510, 240, 90, 0, [[0, 0], [90, 0]], '#8b5cf6', { label: 'gRPC' }));
      elements.push(...createExcalidrawLinear(`t3_arr3_${ts}`, 'arrow', 760, 220, 90, -40, [[0, 0], [90, -40]], '#06b6d4', { label: 'SQL' }));
      elements.push(...createExcalidrawLinear(`t3_arr4_${ts}`, 'arrow', 760, 260, 90, 20, [[0, 0], [90, 20]], '#ef4444', { label: 'Cache' }));

      return elements;
    },
  },

  // 2. AI / RAG: LLM ARCHITECTURE
  {
    id: 'tpl_rag_ai',
    title: 'Arquitectura RAG & LLM Agent',
    category: 'Inteligencia Artificial',
    description: 'User Query ➔ Embeddings ➔ Vector DB Pinecone ➔ LLM Inference',
    mode: 'ai',
    factory: () => {
      const ts = Date.now();
      const elements: any[] = [];

      elements.push(...createExcalidrawNode(`rag_usr_${ts}`, 'rectangle', 100, 200, 150, 80, '#ec4899', '#831843', '💬 User Prompt', { roundnessType: 3 }));
      elements.push(...createExcalidrawNode(`rag_emb_${ts}`, 'rectangle', 320, 200, 160, 80, '#8b5cf6', '#4c1d95', '🔢 Embedding Model\n[text-embedding-3]', { roundnessType: 3 }));
      elements.push(...createExcalidrawNode(`rag_vdb_${ts}`, 'rectangle', 560, 200, 160, 80, '#06b6d4', '#164e63', '🌲 Vector DB\n[Pinecone / Qdrant]', { roundnessType: 3 }));
      elements.push(...createExcalidrawNode(`rag_llm_${ts}`, 'rectangle', 800, 200, 170, 80, '#10b981', '#064e3b', '🧠 LLM Reasoning\n[Gemini / Claude]', { roundnessType: 3 }));

      elements.push(...createExcalidrawLinear(`rag_a1_${ts}`, 'arrow', 250, 240, 70, 0, [[0, 0], [70, 0]], '#ec4899'));
      elements.push(...createExcalidrawLinear(`rag_a2_${ts}`, 'arrow', 480, 240, 80, 0, [[0, 0], [80, 0]], '#8b5cf6', { label: 'Similarity Search' }));
      elements.push(...createExcalidrawLinear(`rag_a3_${ts}`, 'arrow', 720, 240, 80, 0, [[0, 0], [80, 0]], '#10b981', { label: 'Context Prompt' }));

      return elements;
    },
  },

  // 3. ELECTRONICS: ARDUINO IOT WEATHER STATION
  {
    id: 'tpl_arduino_iot',
    title: 'Estación IoT Arduino / ESP32',
    category: 'Arduino / Electrónica',
    description: 'ESP32 ➔ Sensores DHT11 & I2C ➔ Módulo WiFi ➔ Cloud Dashboard',
    mode: 'iot',
    factory: () => {
      const ts = Date.now();
      const elements: any[] = [];

      elements.push(...createExcalidrawNode(`ard_mcu_${ts}`, 'rectangle', 400, 200, 190, 110, '#14b8a6', '#042f2e', '📟 ESP32 Microcontroller\n[WiFi / Bluetooth]', { roundnessType: 3 }));
      elements.push(...createExcalidrawNode(`ard_sns1_${ts}`, 'ellipse', 150, 140, 140, 80, '#f59e0b', '#451a03', '🌡️ Sensor DHT22\n[Temperatura]'));
      elements.push(...createExcalidrawNode(`ard_sns2_${ts}`, 'ellipse', 150, 260, 140, 80, '#38bdf8', '#0c4a6e', '💧 Sensor Humedad\n[Análogo]'));
      elements.push(...createExcalidrawNode(`ard_cld_${ts}`, 'rectangle', 680, 215, 170, 80, '#a855f7', '#3b0764', '☁️ ThingSpeak Cloud\n[MQTT Server]', { roundnessType: 3 }));

      elements.push(...createExcalidrawLinear(`ard_l1_${ts}`, 'arrow', 290, 180, 110, 30, [[0, 0], [110, 30]], '#f59e0b', { label: 'GPIO 4' }));
      elements.push(...createExcalidrawLinear(`ard_l2_${ts}`, 'arrow', 290, 300, 110, -30, [[0, 0], [110, -30]], '#38bdf8', { label: 'ADC 34' }));
      elements.push(...createExcalidrawLinear(`ard_l3_${ts}`, 'arrow', 590, 255, 90, 0, [[0, 0], [90, 0]], '#a855f7', { label: 'WiFi / MQTT' }));

      return elements;
    },
  },
];
