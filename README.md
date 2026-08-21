# 🎨 Ideora - Infinite Canvas Visual Workspace

Ideora es una plataforma web moderna de **lienzo infinito** para diseño visual, diagramación (UML, Flujogramas, Mapas Mentales) y organización de proyectos en tiempo real. 

Construida con **Next.js 16 (App Router)**, **TypeScript**, **Supabase**, **Google OAuth** y **Excalidraw**, Ideora combina una estética *glassmorphism* de nivel premium con arquitectura lista para producción.

---

## ✨ Características Principales

* 📐 **Lienzo Infinito y Librería Diagramática:** Creación de Diagramas de Clases UML, Flujogramas, Mapas Mentales y Formas libres sin desbordamientos ni límites de tamaño.
* 🔐 **Autenticación Real (Google OAuth & Email):** Integración nativa con Supabase Auth y Google OAuth 2.0.
* ☁️ **Sincronización con Google Drive:** Exportación y guardado directo de archivos `.ideora` en tu propio almacenamiento en la nube de Google.
* 🌐 **Soporte Internacional (i18n):** Alterna instantáneamente entre **Inglés** y **Español**.
* 📁 **Gestión de Espacios de Trabajo (Workspaces):** Organiza tus tableros en espacios dedicados con colores e íconos personalizados.
* 🎨 **Diseño Moderno & Glassmorphism:** Interfaz oscura, cuidada al detalle, con micro-animaciones y soporte responsivo.
* 💾 **Persistencia Automática:** Autoguardado continuo de cambios para evitar pérdida de trabajo.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** Next.js 16 (React 19), TypeScript, Lucide React, Tailwind CSS.
* **Canvas Engine:** Excalidraw Core Integration.
* **Backend & Auth:** Supabase (Auth, Postgres DB, Row Level Security).
* **Cloud Integration:** Google OAuth 2.0 & Google Drive API (`drive.file` scope).
* **Internacionalización:** Context-driven i18n Engine.

---

## 🚀 Instalación y Configuración Local

### 1. Requisitos Previos
* Node.js 18+ instalado.
* Una cuenta en [Supabase](https://supabase.com) y en [Google Cloud Console](https://console.cloud.google.com).

### 2. Clonar el Repositorio
```bash
git clone https://github.com/josedavid-07/Ideora.git
cd Ideora
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Configurar Variables de Entorno (`.env.local`)
Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_cliente_id_google.apps.googleusercontent.com
```

### 5. Ejecutar en Modo Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en funcionamiento.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.
