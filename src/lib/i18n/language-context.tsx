'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es';

export const translations = {
  en: {
    // Header
    nav_dashboard: "Dashboard",
    nav_sign_in: "Sign In",
    nav_get_started: "Get Started Free",
    nav_google: "Google",
    nav_new_board: "New Board",
    nav_logout: "Log out",

    // Landing Hero
    hero_badge: "Free Infinite Canvas Platform",
    hero_title_1: "Turn your ideas into ",
    hero_title_2: "reality.",
    hero_subtitle: "Draw, organize and connect your ideas in one infinite workspace.",
    hero_btn_start: "Start creating",
    hero_btn_explore: "Explore Ideora",
    
    // Landing Features
    feat_title: "Built for speed and creativity",
    feat_subtitle: "Everything you need to conceptualize, visualize and keep your ideas organized.",
    feat_1_title: "Infinite Canvas",
    feat_1_desc: "Draw without boundaries using selection tools, shapes, arrows, text and images.",
    feat_2_title: "Workspaces",
    feat_2_desc: "Organize your boards into categories like University, Projects or Ideas with full order.",
    feat_3_title: "Auto-saving",
    feat_3_desc: "Your progress is saved in real time without having to press save.",
    feat_4_title: "Google Drive Sync",
    feat_4_desc: "Connect your Google account to back up your boards in native .ideora files.",
    feat_5_title: "Live Collaboration",
    feat_5_desc: "Invite your team to edit in real time with visible cursors and user tags.",
    feat_6_title: "AI Generation",
    feat_6_desc: "Transform text or prompts into mind maps, flowcharts and UML diagrams.",

    // Login
    login_title: "Sign In",
    login_subtitle: "Access your workspaces and infinite boards",
    login_google_btn: "Continue with Google",
    login_or_email: "Or enter with Email",
    login_email_label: "Email Address",
    login_pass_label: "Password",
    login_forgot_pass: "Forgot password?",
    login_btn_submit: "Sign In",
    login_no_account: "Don't have an account?",
    login_register_link: "Sign up for free",
    login_back_home: "Back to Home",
    reset_modal_title: "Reset Password",
    reset_modal_desc: "We will send a reset link to your email",
    reset_modal_success: "Link sent! Check your email to reset your password.",

    // Register
    reg_title: "Create Account",
    reg_subtitle: "Start drawing and connecting your ideas for free",
    reg_google_btn: "Sign up with Google",
    reg_or_form: "Or complete your registration",
    reg_name_label: "Full Name",
    reg_email_label: "Email Address",
    reg_pass_label: "Password",
    reg_btn_submit: "Create Free Account",
    reg_has_account: "Already have an account?",
    reg_login_link: "Sign In",

    // Dashboard
    dash_welcome: "Welcome",
    dash_subtitle: "Create, organize and draw your visual concepts in your personal infinite canvas.",
    dash_workspaces: "MY WORKSPACES",
    dash_recent_boards: "Recent Boards",
    dash_sorted_by: "Sorted by last update",
    dash_new_board: "New Board",
    dash_new_workspace: "New Workspace",
    dash_import: "Import",
    dash_all_boards: "All Boards",
    dash_favorites: "Favorites",
    dash_trash: "Trash",
    dash_search_placeholder: "Search boards or spaces...",
    dash_visual_elements: "visual elements",

    // Editor Header
    editor_saving: "Saving...",
    editor_saved: "Saved in real time",
    editor_save_error: "Could not save",
    editor_ai_btn: "Generate with AI",
    editor_gdrive_tooltip: "Google Drive Backup",
    editor_import_tooltip: "Import .ideora or JSON file",
    editor_export_btn: "Export",

    // AI Modal
    ai_modal_title: "Generate with AI",
    ai_modal_status: "Active Engine",
    ai_modal_desc: "Create automatic mind maps and diagrams for your canvas",
    ai_modal_prompt_label: "Description or Instruction",
    ai_modal_prompt_placeholder: "e.g., Create a mind map for a user authentication system...",
    ai_modal_presets_label: "Quick suggestions:",
    ai_modal_diagram_type: "Diagram Type",
    ai_modal_flowchart: "Flowchart",
    ai_modal_mindmap: "Mind Map",
    ai_modal_uml: "UML / Classes",
    ai_modal_architecture: "Architecture",
    ai_modal_submit: "Generate on Canvas",
    ai_modal_cancel: "Cancel",

    // Drive Modal
    gdrive_modal_title: "Google Drive Sync",
    gdrive_modal_desc: "Store and sync your .ideora boards in your Google Drive",
    gdrive_modal_connected: "Google Drive Connected",
    gdrive_modal_connect_btn: "Connect with Google Drive",
    gdrive_modal_sync_now: "Save in Drive",
    gdrive_modal_close: "Close",

    // Footer
    footer_project_by: "A project by",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_dev_with: "Developed with",
    footer_from: "from",
    footer_by: "by",
    footer_rights: "All rights reserved.",
    footer_view_github: "View on GitHub",

    // Privacy & Terms
    privacy_title: "Privacy Policy",
    privacy_updated: "Last updated: August 21, 2026",
    privacy_intro: "At Ideora, we take your privacy and data security seriously. This policy explains how we collect, use, and protect your information when using our infinite canvas platform.",
    privacy_sec1_title: "1. Information We Collect",
    privacy_sec1_desc: "We only collect the necessary information to provide our service:",
    privacy_sec1_item1: "Account data: Your username, email address, and profile picture from your authentication provider (Google / Supabase).",
    privacy_sec1_item2: "Content created: Diagrams, canvases, notes, and files created in the platform.",
    privacy_sec1_item3: "Technical data: Basic browser information and logs to maintain security and stability.",
    privacy_sec2_title: "2. Data Usage & Google OAuth",
    privacy_sec2_desc1: "We use your data solely to provide access to your workspace and enable real-time synchronization. We do not sell or share your personal information with third parties for advertising.",
    privacy_sec2_desc2: "When connecting your Google account, we use strictly necessary permissions to save your diagrams to your storage or authenticate your session.",
    privacy_sec3_title: "3. Contact",
    privacy_sec3_desc: "If you have questions about this policy or wish to exercise your privacy rights, contact us at:",

    terms_title: "Terms and Conditions of Service",
    terms_updated: "Last updated: August 21, 2026",
    terms_intro: "By accessing and using Ideora, you agree to comply with the following terms and conditions. Please read them carefully.",
    terms_sec1_title: "1. Acceptable Use of the Platform",
    terms_sec1_desc: "Ideora is a collaborative canvas tool designed to create, organize, and interconnect ideas. You agree to make appropriate use of the platform without violating third-party rights or engaging in illegal activities.",
    terms_sec2_title: "2. Accounts and Content Ownership",
    terms_sec2_desc: "You retain all intellectual property rights over the canvases and content you create in Ideora. You are responsible for maintaining the security of your access credentials.",
    back_to_home: "Back to Home",
  },
  es: {
    // Header
    nav_dashboard: "Dashboard",
    nav_sign_in: "Iniciar sesión",
    nav_get_started: "Comenzar gratis",
    nav_google: "Google",
    nav_new_board: "Nuevo tablero",
    nav_logout: "Cerrar sesión",

    // Landing Hero
    hero_badge: "Plataforma de Lienzo Colaborativo Gratuita",
    hero_title_1: "Transforma tus ideas en ",
    hero_title_2: "realidad.",
    hero_subtitle: "Dibuja, organiza y conecta tus ideas en un solo espacio de trabajo infinito.",
    hero_btn_start: "Comenzar a crear",
    hero_btn_explore: "Explorar Ideora",

    // Landing Features
    feat_title: "Diseñado para la velocidad y la creatividad",
    feat_subtitle: "Todo lo que necesitas para conceptualizar, visualizar y mantener tus ideas organizadas.",
    feat_1_title: "Lienzo Infinito",
    feat_1_desc: "Dibuja sin límites de espacio con herramientas de selección, formas, flechas, texto e imágenes.",
    feat_2_title: "Espacios de Trabajo",
    feat_2_desc: "Organiza tus tableros en categorías como Universidad, Proyectos o Ideas con total orden.",
    feat_3_title: "Guardado Automático",
    feat_3_desc: "Tus avances se persisten en tiempo real sin necesidad de presionar guardar.",
    feat_4_title: "Google Drive Sync",
    feat_4_desc: "Conecta tu cuenta de Google para respaldar tus tableros en archivos nativos .ideora.",
    feat_5_title: "Colaboración en Vivo",
    feat_5_desc: "Invita a tu equipo a editar en tiempo real con cursores y nombres visibles.",
    feat_6_title: "Generación con IA",
    feat_6_desc: "Transforma texto o prompts en mapas mentales, diagramas de flujo y esquemas UML.",

    // Login
    login_title: "Iniciar Sesión",
    login_subtitle: "Accede a tus espacios de trabajo y tableros infinitos",
    login_google_btn: "Continuar con Google",
    login_or_email: "O ingresa con Email",
    login_email_label: "Correo Electrónico",
    login_pass_label: "Contraseña",
    login_forgot_pass: "¿Olvidaste tu contraseña?",
    login_btn_submit: "Iniciar Sesión",
    login_no_account: "¿No tienes una cuenta?",
    login_register_link: "Regístrate gratis",
    login_back_home: "Volver al Inicio",
    reset_modal_title: "Recuperar Contraseña",
    reset_modal_desc: "Te enviaremos un enlace de restablecimiento",
    reset_modal_success: "¡Enlace enviado! Revisa tu correo electrónico para restablecer tu contraseña.",

    // Register
    reg_title: "Crear Cuenta",
    reg_subtitle: "Comienza a dibujar y conectar tus ideas de forma gratuita",
    reg_google_btn: "Registrarse con Google",
    reg_or_form: "O completa tu registro",
    reg_name_label: "Nombre Completo",
    reg_email_label: "Correo Electrónico",
    reg_pass_label: "Contraseña",
    reg_btn_submit: "Crear Cuenta Gratis",
    reg_has_account: "¿Ya tienes cuenta?",
    reg_login_link: "Iniciar sesión",

    // Dashboard
    dash_welcome: "Bienvenido",
    dash_subtitle: "Crea, organiza y dibuja tus conceptos visuales en tu lienzo infinito personal.",
    dash_workspaces: "MIS ESPACIOS",
    dash_recent_boards: "Tableros Recientes",
    dash_sorted_by: "Ordenados por última actualización",
    dash_new_board: "Nuevo Tablero",
    dash_new_workspace: "Nuevo Espacio",
    dash_import: "Importar",
    dash_all_boards: "Todos los tableros",
    dash_favorites: "Favoritos",
    dash_trash: "Papelera",
    dash_search_placeholder: "Buscar tableros o espacios...",
    dash_visual_elements: "elementos visuales",

    // Editor Header
    editor_saving: "Guardando...",
    editor_saved: "Guardado en tiempo real",
    editor_save_error: "No se pudo guardar",
    editor_ai_btn: "Generar con IA",
    editor_gdrive_tooltip: "Respaldo en Google Drive",
    editor_import_tooltip: "Importar archivo .ideora o JSON",
    editor_export_btn: "Exportar",

    // AI Modal
    ai_modal_title: "Generar con IA",
    ai_modal_status: "Motor Activo",
    ai_modal_desc: "Crea mapas mentales y diagramas automáticos para tu lienzo",
    ai_modal_prompt_label: "Descripción o Instrucción",
    ai_modal_prompt_placeholder: "Ej: Crea un mapa mental para un sistema de autenticación...",
    ai_modal_presets_label: "Sugerencias rápidas:",
    ai_modal_diagram_type: "Tipo de Diagrama",
    ai_modal_flowchart: "Diagrama de Flujo",
    ai_modal_mindmap: "Mapa Mental",
    ai_modal_uml: "UML / Clases",
    ai_modal_architecture: "Arquitectura",
    ai_modal_submit: "Generar en Lienzo",
    ai_modal_cancel: "Cancelar",

    // Drive Modal
    gdrive_modal_title: "Sincronización con Google Drive",
    gdrive_modal_desc: "Almacena y sincroniza tus tableros .ideora en tu Google Drive",
    gdrive_modal_connected: "Google Drive Conectado",
    gdrive_modal_connect_btn: "Conectar con Google Drive",
    gdrive_modal_sync_now: "Guardar en Drive",
    gdrive_modal_close: "Cerrar",

    // Footer
    footer_project_by: "Un proyecto de",
    footer_privacy: "Política de Privacidad",
    footer_terms: "Términos del Servicio",
    footer_dev_with: "Desarrollado con",
    footer_from: "desde",
    footer_by: "por",
    footer_rights: "Todos los derechos reservados.",
    footer_view_github: "Ver en GitHub",

    // Privacy & Terms
    privacy_title: "Política de Privacidad",
    privacy_updated: "Última actualización: 21 de agosto de 2026",
    privacy_intro: "En Ideora nos tomamos muy en serio la privacidad y seguridad de tus datos. Esta política explica cómo recopilamos, utilizamos y protegemos tu información cuando utilizas nuestra plataforma de lienzo infinito.",
    privacy_sec1_title: "1. Información que Recopilamos",
    privacy_sec1_desc: "Recopilamos únicamente la información necesaria para brindarte el servicio:",
    privacy_sec1_item1: "Datos de cuenta: Tu nombre de usuario, correo electrónico y foto de perfil provenientes de tu proveedor de autenticación (Google / Supabase).",
    privacy_sec1_item2: "Contenido creado: Diagramas, lienzos, notas y archivos que crees en la plataforma.",
    privacy_sec1_item3: "Datos técnicos: Información básica de navegador y logs para mantener la seguridad y estabilidad del servicio.",
    privacy_sec2_title: "2. Uso de los Datos y Google OAuth",
    privacy_sec2_desc1: "Utilizamos tus datos únicamente para proporcionarte acceso a tu espacio de trabajo y permitir la sincronización en tiempo real. No vendemos ni compartimos tu información personal con terceros para fines publicitarios.",
    privacy_sec2_desc2: "Al conectar tu cuenta de Google, utilizamos los permisos estrictamente necesarios para guardar tus diagramas en tu almacenamiento o autenticar tu sesión.",
    privacy_sec3_title: "3. Contacto",
    privacy_sec3_desc: "Si tienes preguntas sobre esta política o deseas ejercer tus derechos de privacidad, contáctanos en:",

    terms_title: "Términos y Condiciones del Servicio",
    terms_updated: "Última actualización: 21 de agosto de 2026",
    terms_intro: "Al acceder y utilizar Ideora, aceptas cumplir con los siguientes términos y condiciones de uso. Por favor léelos atentamente.",
    terms_sec1_title: "1. Uso Aceptable de la Plataforma",
    terms_sec1_desc: "Ideora es una herramienta de lienzo colaborativo diseñada para crear, organizar e interconectar ideas. Te comprometes a hacer un uso adecuado de la plataforma sin vulnerar derechos de terceros ni realizar actividades ilícitas.",
    terms_sec2_title: "2. Cuentas y Propiedad de Contenido",
    terms_sec2_desc: "Mantienes todos los derechos de propiedad intelectual sobre los lienzos y contenido que creas en Ideora. Eres responsable de mantener la seguridad de tus credenciales de acceso.",
    back_to_home: "Volver al Inicio",
  }
};

export type TranslationKey = keyof typeof translations['en'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations.en[key] || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('ideora_lang') as Language;
      if (savedLang === 'es' || savedLang === 'en') {
        setLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ideora_lang', lang);
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
