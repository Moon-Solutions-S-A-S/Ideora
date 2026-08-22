import { createExcalidrawNode, createExcalidrawLinear } from '../canvas/component-registry';

export interface AIDiagramRequest {
  prompt: string;
  type?: 'flowchart' | 'mindmap' | 'uml' | 'architecture' | 'er_diagram' | 'electronics' | 'devops' | 'ai_rag' | 'networking';
}

export async function generateDiagramElements(request: AIDiagramRequest): Promise<any[]> {
  const ts = Date.now();
  const promptLower = request.prompt.toLowerCase();
  const elements: any[] = [];

  // Check custom Gemini API Key in localStorage if provided
  const geminiApiKey = typeof window !== 'undefined' ? localStorage.getItem('ideora_gemini_api_key') : null;

  if (geminiApiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Genera una lista ordenada de 5 componentes o pasos clave para un diagrama de ingeniería sobre: "${request.prompt}". Devuelve ÚNICAMENTE un arreglo JSON de cadenas con los títulos de los nodos, ejemplo: ["Cliente", "API Gateway", "Servicio Auth", "Base de Datos", "Cache"]`
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
            const nodeId = `ai_gen_${ts}_${index}`;
            const color = index === 0 ? '#3b82f6' : index === parsedTitles.length - 1 ? '#10b981' : '#8b5cf6';
            const bgColor = index === 0 ? '#1e3a8a' : index === parsedTitles.length - 1 ? '#064e3b' : '#4c1d95';
            
            elements.push(...createExcalidrawNode(nodeId, 'rectangle', startX, 250, 180, 80, color, bgColor, title, { roundnessType: 3 }));

            if (index < parsedTitles.length - 1) {
              elements.push(...createExcalidrawLinear(`ai_arr_${ts}_${index}`, 'arrow', startX + 180, 290, 80, 0, [[0, 0], [80, 0]], color));
            }
            startX += 260;
          });
          return elements;
        }
      }
    } catch (e) {
      console.warn('Gemini API call fallback to built-in intelligent engine:', e);
    }
  }

  // Built-in Domain Generators for prompt intent:

  // 1. ELECTRONICS / ARDUINO / EMBEDDED
  if (promptLower.includes('arduino') || promptLower.includes('esp32') || promptLower.includes('circuito') || promptLower.includes('sensor') || promptLower.includes('electronica')) {
    elements.push(...createExcalidrawNode(`ard_mcu_${ts}`, 'rectangle', 350, 250, 190, 110, '#14b8a6', '#042f2e', '📟 ESP32 / Arduino MCU\n[VCC | GND | GPIO4 | A0]', { roundnessType: 3 }));
    elements.push(...createExcalidrawNode(`ard_sns_${ts}`, 'ellipse', 100, 180, 140, 80, '#f59e0b', '#451a03', '📡 Sensor Temp / I2C\n[SDA / SCL]'));
    elements.push(...createExcalidrawNode(`ard_act_${ts}`, 'rectangle', 630, 180, 150, 80, '#ef4444', '#7f1d1d', '⚡ Actuador / Motor PWM', { roundnessType: 3 }));
    elements.push(...createExcalidrawNode(`ard_disp_${ts}`, 'rectangle', 630, 310, 150, 80, '#38bdf8', '#0c4a6e', '📺 Pantalla OLED I2C', { roundnessType: 3 }));

    elements.push(...createExcalidrawLinear(`ard_a1_${ts}`, 'arrow', 240, 220, 110, 50, [[0, 0], [110, 50]], '#f59e0b', { label: 'Signal' }));
    elements.push(...createExcalidrawLinear(`ard_a2_${ts}`, 'arrow', 540, 280, 90, -60, [[0, 0], [90, -60]], '#ef4444', { label: 'PWM Out' }));
    elements.push(...createExcalidrawLinear(`ard_a3_${ts}`, 'arrow', 540, 310, 90, 40, [[0, 0], [90, 40]], '#38bdf8', { label: 'Display Bus' }));

    return elements;
  }

  // 2. UML CLASS DIAGRAM / OBJECT MODEL
  if (promptLower.includes('uml') || promptLower.includes('clase') || promptLower.includes('class') || promptLower.includes('sequence')) {
    elements.push(...createExcalidrawNode(`uml_c1_${ts}`, 'rectangle', 100, 220, 180, 140, '#ec4899', '#831843', '<<Class>> User\n------------------\n+ id: UUID\n+ email: String\n------------------\n+ login(): Boolean', { roundnessType: 3 }));
    elements.push(...createExcalidrawNode(`uml_c2_${ts}`, 'rectangle', 380, 220, 180, 140, '#a855f7', '#4c1d95', '<<Class>> Order\n------------------\n+ id: UUID\n+ total: Decimal\n------------------\n+ processPayment()', { roundnessType: 3 }));
    elements.push(...createExcalidrawNode(`uml_c3_${ts}`, 'rectangle', 660, 220, 180, 140, '#06b6d4', '#164e63', '<<Class>> Payment\n------------------\n+ transactionId: String\n+ status: Enum\n------------------\n+ refund()', { roundnessType: 3 }));

    elements.push(...createExcalidrawLinear(`uml_rel1_${ts}`, 'arrow', 280, 290, 100, 0, [[0, 0], [100, 0]], '#ec4899', { label: '1 .. *' }));
    elements.push(...createExcalidrawLinear(`uml_rel2_${ts}`, 'arrow', 560, 290, 100, 0, [[0, 0], [100, 0]], '#a855f7', { label: '1 .. 1' }));

    return elements;
  }

  // 3. DATABASE / ER DIAGRAM
  if (promptLower.includes('er') || promptLower.includes('database') || promptLower.includes('base de datos') || promptLower.includes('tabla') || promptLower.includes('sql')) {
    elements.push(...createExcalidrawNode(`er_t1_${ts}`, 'rectangle', 120, 200, 190, 140, '#06b6d4', '#164e63', '📋 users\n================\n🔑 id: UUID (PK)\n📧 email: VARCHAR\n🔐 password_hash: TEXT', { roundnessType: 3 }));
    elements.push(...createExcalidrawNode(`er_t2_${ts}`, 'rectangle', 420, 200, 190, 140, '#3b82f6', '#1e3a8a', '📋 products\n================\n🔑 id: UUID (PK)\n🏷️ name: VARCHAR\n💵 price: DECIMAL', { roundnessType: 3 }));
    elements.push(...createExcalidrawNode(`er_t3_${ts}`, 'rectangle', 720, 200, 190, 140, '#f59e0b', '#78350f', '📋 orders\n================\n🔑 id: UUID (PK)\n👤 user_id: UUID (FK)\n📦 product_id: UUID (FK)', { roundnessType: 3 }));

    elements.push(...createExcalidrawLinear(`er_fk1_${ts}`, 'arrow', 310, 270, 110, 0, [[0, 0], [110, 0]], '#06b6d4', { label: '1 : N' }));
    elements.push(...createExcalidrawLinear(`er_fk2_${ts}`, 'arrow', 610, 270, 110, 0, [[0, 0], [110, 0]], '#3b82f6', { label: '1 : N' }));

    return elements;
  }

  // 4. DEVOPS / KUBERNETES / CI-CD PIPELINE
  if (promptLower.includes('devops') || promptLower.includes('ci/cd') || promptLower.includes('kubernetes') || promptLower.includes('docker') || promptLower.includes('pipeline')) {
    elements.push(...createExcalidrawNode(`cicd_g_${ts}`, 'rectangle', 100, 240, 160, 80, '#f43f5e', '#881337', '🐙 GitHub Repo\n[Git Push main]', { roundnessType: 3 }));
    elements.push(...createExcalidrawNode(`cicd_act_${ts}`, 'rectangle', 330, 240, 170, 80, '#10b981', '#064e3b', '⚙️ GitHub Actions\n[Build & Test]', { roundnessType: 3 }));
    elements.push(...createExcalidrawNode(`cicd_dck_${ts}`, 'rectangle', 570, 240, 170, 80, '#3b82f6', '#1e3a8a', '🐳 Docker Registry\n[Push Image v1.0]', { roundnessType: 3 }));
    elements.push(...createExcalidrawNode(`cicd_k8s_${ts}`, 'rectangle', 810, 240, 170, 80, '#a855f7', '#4c1d95', '☸️ Kubernetes Cluster\n[Helm Deploy Pods]', { roundnessType: 3 }));

    elements.push(...createExcalidrawLinear(`cicd_a1_${ts}`, 'arrow', 260, 280, 70, 0, [[0, 0], [70, 0]], '#f43f5e', { label: 'Webhook' }));
    elements.push(...createExcalidrawLinear(`cicd_a2_${ts}`, 'arrow', 500, 280, 70, 0, [[0, 0], [70, 0]], '#10b981', { label: 'Image Push' }));
    elements.push(...createExcalidrawLinear(`cicd_a3_${ts}`, 'arrow', 740, 280, 70, 0, [[0, 0], [70, 0]], '#3b82f6', { label: 'Kubelet' }));

    return elements;
  }

  // 5. DEFAULT: SYSTEM ARCHITECTURE & MICROSERVICES
  elements.push(...createExcalidrawNode(`sys_cli_${ts}`, 'rectangle', 100, 240, 160, 80, '#3b82f6', '#1e3a8a', '💻 Client App\n[React / Mobile]', { roundnessType: 3 }));
  elements.push(...createExcalidrawNode(`sys_gw_${ts}`, 'rectangle', 330, 240, 160, 80, '#f43f5e', '#881337', '🛡️ API Gateway\n[Auth / Router]', { roundnessType: 3 }));
  elements.push(...createExcalidrawNode(`sys_ms_${ts}`, 'rectangle', 560, 240, 170, 80, '#a855f7', '#4c1d95', '📦 Core Microservice\n[Node.js / Express]', { roundnessType: 3 }));
  elements.push(...createExcalidrawNode(`sys_db_${ts}`, 'rectangle', 800, 180, 160, 80, '#06b6d4', '#164e63', '🗄️ PostgreSQL\n[Data Store]', { roundnessType: 3 }));
  elements.push(...createExcalidrawNode(`sys_cch_${ts}`, 'rectangle', 800, 300, 160, 80, '#ef4444', '#7f1d1d', '⚡ Redis Cache\n[Session Store]', { roundnessType: 3 }));

  elements.push(...createExcalidrawLinear(`sys_l1_${ts}`, 'arrow', 260, 280, 70, 0, [[0, 0], [70, 0]], '#3b82f6', { label: 'HTTPS' }));
  elements.push(...createExcalidrawLinear(`sys_l2_${ts}`, 'arrow', 490, 280, 70, 0, [[0, 0], [70, 0]], '#f43f5e', { label: 'REST' }));
  elements.push(...createExcalidrawLinear(`sys_l3_${ts}`, 'arrow', 730, 260, 70, -40, [[0, 0], [70, -40]], '#06b6d4', { label: 'SQL' }));
  elements.push(...createExcalidrawLinear(`sys_l4_${ts}`, 'arrow', 730, 300, 70, 40, [[0, 0], [70, 40]], '#ef4444', { label: 'Redis' }));

  return elements;
}
