# 🏥 Centro Quirúrgico Human — Plataforma Web Médica & Portafolio Digital (v2.0)

> **Repositorio Oficial:** [https://github.com/bracebalDev/centro-quirurgico-human.git](https://github.com/bracebalDev/centro-quirurgico-human.git)  
> **Especialidad:** Cirugía Bariátrica, Traumatología & Artroscopia, Medicina Interna Perioperatoria, Fisiatría y Quirófanos Inteligentes Clase A.

---

## 📋 Resumen Ejecutivo del Proyecto

El proyecto **Centro Quirúrgico Human** ha sido completamente refactorizado para transformar un prototipo web inicial en una **experiencia digital médica de alta gama**, orientada a servir como **landing page y portafolio interactivo de servicios de salud**.

Se preservó estrictamente la **identidad corporativa y la paleta de colores original**, elevando la calidad visual, la interactividad del paciente, la optimización para motores de búsqueda (**SEO Avanzado**) y un **blindaje de ciberseguridad frontend** robusto de grado médico.

---

## 🔄 Matriz Comparativa: Versión Original vs. Nueva Versión Refactorizada (v2.0)

| Aspecto | Versión Original | Nueva Versión Refactorizada (v2.0) |
| :--- | :--- | :--- |
| **Arquitectura Visual & UI/UX** | Diseño estático básico, tipografías rígidas y espaciados fijos. | Experiencia moderna con **Glassmorphism**, diseño responsivo adaptativo (`clamp()`, CSS Grid & Flexbox), micro-animaciones fluidas y sombras volumétricas. |
| **Paleta de Colores** | Definición en variables CSS pero con aplicación plana. | Paleta corporativa preservada e integrada en un sistema coherente de gradientes clínicos (`#022140`, `#04BBBF`, `#03558A`, `#007D8C`). |
| **Directorio Médico** | Tarjetas estáticas con botones no funcionales y estrellas con imágenes rotas. | Tarjetas interactivas con badges de sub-especialidad, **calificación 5.0 con SVG vectoriales nítidos**, y **Modales Clínicos Dinámicos** con credenciales, bio y agendamiento directo. |
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

## 📁 Estructura del Proyecto

```text
Centro Quirúrgico Human/
├── Assets/                        # Imágenes y recursos multimedia optimizados
│   ├── Dr. Jose Gomez.jpg         # Fotografía especialista en Traumatología
│   ├── Dr. Luis Gómez.jpg         # Fotografía cirujano Bariátrico
│   ├── Dra. Carmen Lomana.jpg     # Fotografía médico Fisiatra
│   ├── Luisa Perez.jpg            # Fotografía especialista en Medicina Interna
│   ├── Logo.jpg                   # Isotipo / Logotipo principal
│   ├── logo_footer.svg            # Logo vectorial SVG para pie de página
│   ├── jumbotron1.jpg             # Imagen de fondo Hero Section
│   ├── jumbotron2.jpg             # Imagen de infraestructura hospitalaria
│   └── Star.jpg                   # Recurso gráfico de calificación
├── Fonts/                         # Fuentes locales con formato TrueType
│   ├── Roboto-Bold.ttf
│   ├── Roboto-Light.ttf
│   └── Roboto-Regular.ttf
├── index.html                     # Landing Page Principal con todas las secciones y Schema.org
├── servicios.html                 # Portafolio detallado de especialidades quirúrgicas
├── directorio.html                # Staff y directorio médico de especialistas
├── sobre_nosotros.html            # Misión, visión, políticas de privacidad y términos
├── style.css                      # Sistema de diseño moderno, CSS Grid, Glassmorphism y Flexbox
├── script.js                      # Motor interactivo blindado con seguridad y sanitización XSS
├── sitemap.xml                    # Mapa del sitio estructurado para motores de búsqueda
├── robots.txt                     # Directivas seguras para rastreadores web
└── README.md                      # Documentación completa y memoria técnica del proyecto
```

---

## 🚀 Despliegue e Instrucciones de Uso

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/bracebalDev/centro-quirurgico-human.git
   ```
2. **Ejecutar localmente:**
   - Puede abrirse directamente el archivo `index.html` en cualquier navegador web moderno, o servirse mediante cualquier servidor web estático (Nginx, Apache, GitHub Pages, Vercel, Netlify, Live Server).
3. **Compatibilidad:**
   - Totalmente compatible con Chrome, Edge, Firefox, Safari, iOS y Android.
