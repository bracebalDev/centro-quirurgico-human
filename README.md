# 🏥 Centro Quirúrgico Human — Plataforma Web Médica & Portafolio Digital (v2.0)

> **Repositorio Oficial:** [https://github.com/bracebalDev/centro-quirurgico-human.git](https://github.com/bracebalDev/centro-quirurgico-human.git)  
> **Sitio en Vivo (GitHub Pages):** [https://bracebaldev.github.io/centro-quirurgico-human/](https://bracebaldev.github.io/centro-quirurgico-human/)  
> **Especialidad:** Cirugía Bariátrica, Traumatología & Artroscopia, Medicina Interna Perioperatoria, Fisiatría y Quirófanos Inteligentes Clase A.

---

## 📋 Resumen Ejecutivo del Proyecto

El proyecto **Centro Quirúrgico Human** ha sido completamente refactorizado para transformar un prototipo web inicial en una **experiencia digital médica de alta gama**, orientada a servir como **landing page y portafolio interactivo de servicios de salud**.

Se preservó estrictamente la **identidad corporativa y la paleta de colores original**, elevando la calidad visual, la interactividad del paciente, la optimización para motores de búsqueda (**SEO Avanzado**) y un **blindaje de ciberseguridad frontend** robusto de grado médico.

---

## 🧪 Reporte QA de Compatibilidad y Responsividad Multidispositivo

Como parte del control de calidad exhaustivo (QA), se incorporaron estándares de renderizado y adaptabilidad para toda la gama de dispositivos del mercado:

### 1. 🍎 Ecosistema Apple & Motor WebKit (Safari en iPhone, iPad, Mac)
- **Soporte de Safe Area Insets (`env(safe-area-inset-*)`)**:
  - Ajuste dinámico de cabeceras, Top Bar, modales clínicos y botones flotantes para respetar el **Dynamic Island**, el **Notch** y la barra de navegación gestual inferior (**Home Indicator** de iOS).
- **Viewport Fit Cover (`viewport-fit=cover`)**:
  - Permite que el diseño aproveche la pantalla de extremo a extremo sin márgenes blancos antiestéticos en Safari móvil.
- **Dynamic Viewport Height (`100dvh` / `100svh`)**:
  - Corrige el molesto salto de scroll en iOS provocado por el colapso y expansión dinámica de la barra de direcciones de Safari.
- **Prevención de Zoom Involuntario en Formularios**:
  - Tamaño de tipografía de inputs fijado en `16px` para evitar el zoom automático forzado por WebKit al hacer foco.
- **Tipografía y Renderizado Retina**:
  - Implementación de `-webkit-font-smoothing: antialiased;` y fuentes locales optimizadas con fallback a *SF Pro Display/Text*.
- **Efectos Glassmorphic con Aceleración por Hardware**:
  - Prefijo `-webkit-backdrop-filter: blur(20px) saturate(180%)` garantizando el efecto de cristal traslúcido nativo de Apple.

### 2. 📱 Dispositivos Dual-Screen & Plegables (iPhone Duo / Surface Duo / Foldables)
- **Soporte de la API CSS Viewport Segments**:
  - `@media (horizontal-viewport-segments: 2)`: Distribución inteligente en dos columnas cuando el dispositivo se despliega horizontalmente, evitando que los textos o botones queden cortados por la bisagra física (*hinge*).
  - `@media (vertical-viewport-segments: 2)`: Adaptación para modo plegado vertical / postura semiabierta (Laptop Mode).
- **Contenedores Flexibles y Grids Auto-adaptables**:
  - El catálogo de servicios y el directorio médico se redistribuyen fluidamente entre 1, 2, 3 y 4 columnas según el ancho disponible (`minmax()`).

### 3. 🖥️ Escritorios, Laptops y Tablets
- Soporte para pantallas 4K, UltraWide y monitores de alta resolución con límites de lectura ergonómicos (`max-width: 1240px`).

---

## 🔄 Matriz Comparativa: Versión Original vs. Nueva Versión Refactorizada (v2.0)

| Aspecto | Versión Original | Nueva Versión Refactorizada (v2.0) |
| :--- | :--- | :--- |
| **Arquitectura Visual & UI/UX** | Diseño estático básico, tipografías rígidas y espaciados fijos. | Experiencia moderna con **Glassmorphism**, diseño responsivo adaptativo (`clamp()`, CSS Grid & Flexbox), micro-animaciones fluidas y sombras volumétricas. |
| **Rendimiento y Carga de Imágenes** | Imágenes pesadas sin compresión (>7.5 MB total) con tiempos lentos de carga. | **Optimización Extrema WebP/JPEG** (~600 KB total, reducción de >90%). Carga diferida (`loading="lazy"`), fotos de especialistas <55 KB y nuevo Quirófano Clase A a 168 KB. |
| **Paleta de Colores** | Definición en variables CSS pero con aplicación plana. | Paleta corporativa preservada e integrada en un sistema coherente de gradientes clínicos (`#022140`, `#04BBBF`, `#03558A`, `#007D8C`). |
| **Directorio Médico** | Tarjetas estáticas con botones no funcionales y estrellas con imágenes rotas. | **Staff ampliado a 6 Especialistas** distribuidos en **filas de 3 tarjetas en escritorio (Grid 3x2)** y **filas de 2 tarjetas en mobile (2 Columnas)** con badges de sub-especialidad, **calificación 5.0 con SVG vectoriales nítidos**, y **Modales Clínicos Dinámicos**. |
| **Servicios Médicos** | Página vacía sin maquetar (`servicios.html`). | Módulo interactivo con **filtro de categorías en tiempo real** (Alta Complejidad, Diagnóstico, Cuidados) y fichas técnicas completas por procedimiento. |
| **Asistente Quirúrgico** | Inexistente. | **Cotizador / Asistente Interactivo de Citas** que permite calcular tiempos de respuesta y pre-cargar especialidades al formulario. |
| **Estrategia SEO** | Metadatos mínimos y comentario pendiente sobre OpenGraph. | **SEO Integral de Última Generación**: OpenGraph completo, Twitter Cards, Geo Tags, Canonical URLs, `sitemap.xml`, `robots.txt` y **Schema.org JSON-LD** con entidades `MedicalOrganization`, `Physician` y `FAQPage`. |
| **Ciberseguridad & Blindaje** | Sin medidas de protección; archivo `script.js` con datos de prueba. | **Blindaje Frontend Multicapa**: Modo estricto `'use strict'`, Sanitización profunda contra ataques **XSS**, **Rate Limiting** por sesión, **Honeypot invisible contra bots**, protección contra Prototype Pollution (`Object.freeze`) y cabeceras de seguridad. |
| **Formulario de Citas** | Botón de interfaz sin funcionalidad de captura. | **Sistema de Pre-Reserva Blindado**: Validación Regex en tiempo real, generación de **Tokens Criptográficos de Reserva** (`CQH-XXXX`) e integración directa y segura con **WhatsApp API**. |
| **Navegación & Accesibilidad** | Menú fijo sin soporte móvil real ni enlaces accesibles. | **Top Bar médica 24/7**, Navbar flotante con desenfoque de cristal, menú hamburguesa accesible con atributos ARIA y botón flotante de retorno suave (*Scroll-to-top*). |

---

## 🎯 ¿Qué se logra con esta nueva versión del sistema web?

1. **Conversión y Confianza Inmediata del Paciente:**
   - Transmite credibilidad médica desde el primer segundo gracias a métricas en vivo (+15 años, +12.000 cirugías, 99.8% satisfacción), acreditaciones de bioseguridad y fichas de especialistas.
2. **Portafolio Médico Interactivo y Exhaustivo:**
   - Los pacientes pueden explorar no solo quiénes son los cirujanos, sino qué tecnologías quirúrgicas se utilizan (Torres 4K, filtrado HEPA, recuperación ERAS) y los tiempos estimados de recuperación.
3. **Indexación y Posicionamiento en Google (SEO Orgánico):**
   - Con los esquemas estructurados de Schema.org, los motores de búsqueda pueden mostrar *Rich Snippets* (estrellas de valoración de doctores, preguntas frecuentes y ubicación de la clínica).
4. **Protección de Datos e Integridad del Código:**
   - Se mitigan riesgos de inyecciones maliciosas, spam masivo en formularios y captación automatizada por bots mediante trampas criptográficas.
5. **Experiencia Omnicanal Fluida:**
   - Integración nativa con WhatsApp Web/Móvil con mensajes pre-formateados que incluyen el token de seguimiento médico del paciente.

---

## 🎨 Paleta de Colores Corporativa Preservada

- **Azul Primario (Navy Quirúrgico):** `#022140` — Elegancia, sobriedad y confianza institucional.
- **Turquesa de Acción (Cyan Radiante):** `#04BBBF` — Llamados a la acción (CTAs), botones e interactividad.
- **Azul Secundario (Zafiro Clínico):** `#03558A` — Fondos secundarios y acentos de navegación.
- **Azul Terciario (Petróleo / Teal):** `#007D8C` — Subtítulos, badges y estados hover.
- **Neutros y Superficies:** `#2E2E2E` (Texto principal), `#F8FAFC` (Superficie clínica limpia), `#FFFFFF` (Tarjetas y modales).

---

## 🛡️ Medidas de Ciberseguridad y Blindaje de Códigos

### 1. Cabeceras de Seguridad y Directivas Meta
- `X-Content-Type-Options: nosniff`: Evita que el navegador interprete archivos con tipos MIME incorrectos (MIME sniffing).
- `X-Frame-Options: SAMEORIGIN`: Protege contra ataques de **Clickjacking** e incrustación en iframes maliciosos.
- `Referrer-Policy: strict-origin-when-cross-origin`: Resguarda la privacidad de las URLs en enlaces externos.
- `Permissions-Policy`: Restringe el acceso no autorizado a hardware como micrófono y cámara.

### 2. Sanitización Estricta contra Inyecciones XSS (`SecuritySanitizer`)
- Escapado exhaustivo de caracteres HTML especiales (`&`, `<`, `>`, `"`, `'`, `/`, `` ` ``).
- Limpieza profunda de esquemas URI inseguros (`javascript:`, `data:`, `vbscript:`) y etiquetas maliciosas antes de procesar cualquier entrada de datos.

### 3. Rate Limiting en Cliente (`ClientRateLimiter`)
- Bloqueo de envíos continuos repetitivos para prevenir ataques de denegación de servicio (DoS) o saturación de canales de mensajería (máximo 4 solicitudes en ventanas de 5 minutos por sesión).

### 4. Trampa Honeypot contra Bots Automatizados
- Campo oculto indetectable para humanos pero detectable por scrapers/crawlers maliciosos, neutralizando envíos automatizados silenciosamente.

### 5. Inmutabilidad y Protección de Prototipos
- Uso de `Object.freeze()` en configuraciones y objetos clínicos nucleares para evitar la manipulación en tiempo de ejecución (*Prototype Pollution*).

---

## 🚀 Despliegue en GitHub Pages

El proyecto cuenta con integración continua automática mediante **GitHub Actions**.

### Pasos para activar en el repositorio:
1. Ir a **Settings** en el repositorio de GitHub: `https://github.com/bracebalDev/centro-quirurgico-human/settings/pages`.
2. En la sección **Build and deployment**:
   - **Source:** Seleccionar `GitHub Actions` (o `Deploy from a branch` -> Rama `main` / Carpeta `/(root)`).
3. La web quedará publicada automáticamente en:  
   👉 **[https://bracebaldev.github.io/centro-quirurgico-human/](https://bracebaldev.github.io/centro-quirurgico-human/)**
