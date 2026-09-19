/**
 * ==========================================================================
 * CENTRO QUIRÚRGICO HUMAN - SISTEMA DE CONTROL & SEGURIDAD FRONTEND
 * Módulos: Blindaje Ciberseguridad, Sanitización XSS, Rate Limiting, UI Interactiva
 * ==========================================================================
 */

(function () {
    'use strict';

    /* ==========================================================================
       1. BLINDAJE DE CIBERSEGURIDAD Y SANITIZACIÓN (DEFENSE-IN-DEPTH)
       ========================================================================== */
    const Security = Object.freeze({
        /**
         * Sanitización estricta contra inyección de código XSS
         */
        escapeHTML: function (str) {
            if (typeof str !== 'string') return '';
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                "/": '&#x2F;',
                "`": '&#x60;'
            };
            return str.replace(/[&<>"'/`]/g, function (s) {
                return map[s];
            });
        },

        /**
         * Limpieza profunda de entradas textuales
         */
        sanitizeString: function (str) {
            if (typeof str !== 'string') return '';
            // Remueve esquemas javascript:, data:, vbscript: y tags HTML
            return str
                .replace(/javascript:/gi, '')
                .replace(/data:/gi, '')
                .replace(/vbscript:/gi, '')
                .replace(/<[^>]*>?/gm, '')
                .trim();
        },

        /**
         * Validadores con expresiones regulares estrictas
         */
        validateName: function (name) {
            const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.]{2,70}$/;
            return nameRegex.test(name.trim());
        },

        validateEmail: function (email) {
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return emailRegex.test(email.trim()) && email.length <= 100;
        },

        validatePhone: function (phone) {
            const phoneRegex = /^[+]?[(]?[0-9]{2,4}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,6}$/;
            return phoneRegex.test(phone.trim().replace(/\s+/g, ''));
        },

        /**
         * Generador seguro de identificador de reserva (Cliente)
         */
        generateReservationToken: function () {
            const randomBytes = new Uint8Array(4);
            if (window.crypto && window.crypto.getRandomValues) {
                window.crypto.getRandomValues(randomBytes);
                const hex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
                return 'CQH-' + hex;
            }
            return 'CQH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        }
    });

    /* ==========================================================================
       2. RATE LIMITER Y PROTECCIÓN CONTRA BOT/SPAM
       ========================================================================== */
    const RateLimiter = (function () {
        const MAX_SUBMISSIONS = 4;
        const TIME_WINDOW_MS = 60 * 1000 * 5; // 5 minutos
        const STORAGE_KEY = 'cqh_sub_tracker';

        function getHistory() {
            try {
                const data = sessionStorage.getItem(STORAGE_KEY);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                return [];
            }
        }

        function recordSubmission() {
            try {
                const history = getHistory();
                const now = Date.now();
                history.push(now);
                // Filtrar entradas antiguas
                const filtered = history.filter(ts => now - ts < TIME_WINDOW_MS);
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            } catch (e) {
                // Fallback silencioso seguro
            }
        }

        function isAllowed() {
            try {
                const history = getHistory();
                const now = Date.now();
                const recent = history.filter(ts => now - ts < TIME_WINDOW_MS);
                return recent.length < MAX_SUBMISSIONS;
            } catch (e) {
                return true;
            }
        }

        return {
            isAllowed: isAllowed,
            recordSubmission: recordSubmission
        };
    })();

    /* ==========================================================================
       3. BASE DE DATOS DE ESPECIALISTAS Y SERVICIOS QUIRÚRGICOS
       ========================================================================== */
    const CLINICAL_DATA = Object.freeze({
        doctors: [
            {
                id: 'dr-jose-gomez',
                name: 'Dr. José Gómez',
                role: 'Traumatólogo Especialista en Rodilla y Artroscopia',
                image: 'Assets/dr-jose-gomez.jpg',
                stars: 5,
                experience: '16+ años de experiencia',
                credentials: 'M.D. Cirugía Ortopédica y Traumatología de Alta Complejidad. Miembro de la Sociedad Internacional de Artroscopia.',
                bio: 'Especialista de referencia en reemplazos articulares, lesiones ligamentarias complejas y reconstrucción artroscópica de rodilla con protocolos de recuperación acelerada (Fast-Track).',
                procedures: ['Artroscopia de rodilla avanzada', 'Reemplazo total y parcial de rodilla', 'Reconstrucción de ligamento cruzado anterior (LCA)', 'Medicina regenerativa osteoarticular'],
                schedule: 'Lunes a Jueves: 08:00 AM - 02:00 PM'
            },
            {
                id: 'dra-luisa-perez',
                name: 'Dra. Luisa Pérez',
                role: 'Especialista en Medicina Interna y Riesgo Perioperatorio',
                image: 'Assets/dra-luisa-perez.jpg',
                stars: 5,
                experience: '14+ años de experiencia',
                credentials: 'M.D. Especialista en Medicina Interna y Cuidados Críticos. Diplomado en Evaluación Cardiopulmonar Perioperatoria.',
                bio: 'Líder del equipo de valoración prequirúrgica y seguimiento hospitalario continuo, garantizando la máxima seguridad clínica y estabilidad metabólica antes, durante y después de la cirugía.',
                procedures: ['Evaluación integral de riesgo quirúrgico', 'Manejo de comorbilidades (diabetes, hipertensión)', 'Optimización cardiopulmonar preoperatoria', 'Control metabólico y postquirúrgico intensivo'],
                schedule: 'Lunes a Viernes: 09:00 AM - 04:00 PM'
            },
            {
                id: 'dr-luis-gomez',
                name: 'Dr. Luis Gómez',
                role: 'Cirujano Bariátrico y Metabólico Laparoscópico',
                image: 'Assets/dr-luis-gomez.jpg',
                stars: 5,
                experience: '18+ años de experiencia',
                credentials: 'M.D. Cirugía General y Laparoscópica Avanzada. Certificación Internacional en Cirugía Bariátrica y Metabólica.',
                bio: 'Pionero en procedimientos de mínima invasión bariátrica (Manga Gástrica y Bypass Gástrico por Laparoscopia), enfocado en la resolución de obesidad severa y reversión del síndrome metabólico.',
                procedures: ['Manga Gástrica por Laparoscopia (Sleeve)', 'Bypass Gástrico en Y de Roux', 'Cirugía de Revisión Bariátrica', 'Cirugía Metabólica para Diabetes Tipo 2'],
                schedule: 'Martes, Jueves y Sábados: 10:00 AM - 05:00 PM'
            },
            {
                id: 'dra-carmen-lomana',
                name: 'Dra. Carmen Lomana',
                role: 'Médico Fisiatra y Rehabilitación Postquirúrgica',
                image: 'Assets/dra-carmen-lomana.jpg',
                stars: 5,
                experience: '12+ años de experiencia',
                credentials: 'M.D. Especialista en Medicina Física y Rehabilitación. Certificación en Terapia Física Intervencionista.',
                bio: 'Dedicada a la reincorporación funcional temprana de pacientes postoperados, aplicando fisioterapia avanzada, analgesia multimodal y planes individualizados de movilidad.',
                procedures: ['Rehabilitación postoperatoria osteoarticular', 'Terapia física para reintegro deportivo y laboral', 'Manejo intervencionista del dolor agudo y crónico', 'Readaptación neuromuscular guiada'],
                schedule: 'Lunes a Viernes: 07:30 AM - 01:30 PM'
            },
            {
                id: 'dr-alejandro-morales',
                name: 'Dr. Alejandro Morales',
                role: 'Cirujano General & Laparoscopia de Alta Precisión',
                image: 'Assets/dr-alejandro-morales.jpg',
                stars: 5,
                experience: '15+ años de experiencia',
                credentials: 'M.D. Cirugía General y Digestiva. Miembro de la Asociación Internacional de Cirugía Laparoscópica.',
                bio: 'Especialista en colecistectomía laparoscópica, hernioplastias complejas con malla y cirugía de pared abdominal con mínimas incisiones y rápida alta médica.',
                procedures: ['Colecistectomía laparoscópica avanzada', 'Reparación anatómica de hernias inguinales y umbilicales', 'Cirugía de reflujo gastroesofágico', 'Procedimientos ambulatorios de corta estancia'],
                schedule: 'Lunes, Miércoles y Viernes: 08:30 AM - 03:00 PM'
            },
            {
                id: 'dra-sofia-valenzuela',
                name: 'Dra. Sofía Valenzuela',
                role: 'Anestesióloga & Manejo Avanzado del Dolor Perioperatorio',
                image: 'Assets/dra-sofia-valenzuela.jpg',
                stars: 5,
                experience: '13+ años de experiencia',
                credentials: 'M.D. Especialista en Anestesiología y Reanimación. Fellow en Anestesia Regional Guiada por Ultrasonido.',
                bio: 'Líder en analgesia multimodal libre de opioides, monitoreo cerebral de profundidad anestésica (BIS) y confort total antes y durante el despertar quirúrgico.',
                procedures: ['Anestesia regional guiada por ultrasonido', 'Protocolos ERAS de analgesia multimodal preventiva', 'Monitoreo hemodinámico y BIS continuo', 'Manejo especializado de dolor postoperatorio'],
                schedule: 'Lunes a Sábado: 07:00 AM - 02:00 PM'
            }
        ],
        services: [
            {
                id: 'bariatrica',
                category: 'alta-complejidad',
                title: 'Cirugía Bariátrica & Metabólica',
                desc: 'Procedimientos laparoscópicos de mínima invasión diseñados para una pérdida de peso segura, control metabólico integral y rápida reincorporación.',
                tech: 'Torres Laparoscópicas 4K Ultra HD y Grapado Quirúrgico Inteligente',
                recovery: '24 a 48 horas de estancia hospitalaria',
                features: ['Manga gástrica de alta precisión', 'Bypass gástrico laparoscópico', 'Acompañamiento nutricional y psicológico integral', 'Protocolos ERAS de rápida recuperación']
            },
            {
                id: 'traumatologia',
                category: 'alta-complejidad',
                title: 'Traumatología & Artroscopia Avanzada',
                desc: 'Intervenciones quirúrgicas de vanguardia para articulaciones, cartílagos, tendones y huesos con implantes de grado médico internacional.',
                tech: 'Sistemas de visualización artroscópica de fibra óptica y navegación guiada',
                recovery: 'Protocolos de deambulación precoz desde el día 1',
                features: ['Cirugía de rodilla, cadera y hombro', 'Reconstrucción ligamentaria artroscópica', 'Prótesis articulares de titanio y cerámica', 'Manejo de lesiones deportivas de alto rendimiento']
            },
            {
                id: 'medicina-interna',
                category: 'diagnostico',
                title: 'Medicina Interna & Riesgo Perioperatorio',
                desc: 'Blindaje clínico total de la salud del paciente mediante chequeos prequirúrgicos profundos y monitoreo postoperatorio exhaustivo.',
                tech: 'Monitores multiparámetros y laboratorio clínico de respuesta inmediata',
                recovery: 'Monitoreo continuo 24/7 en sala de recuperación',
                features: ['Evaluación cardiovascular preoperatoria', 'Estratificación de riesgo quirúrgico ASA/Goldman', 'Control glucémico y hemodinámico estricto', 'Manejo interdisciplinario del paciente complejo']
            },
            {
                id: 'fisiatria',
                category: 'cuidados',
                title: 'Fisiatría & Rehabilitación Acelerada',
                desc: 'Programas de rehabilitación física y readaptación funcional postquirúrgica para acelerar la recuperación y eliminar el dolor.',
                tech: 'Equipos de electroestimulación selectiva y ultrasonido terapéutico',
                recovery: 'Planes ambulatorios personalizados',
                features: ['Terapia física postquirúrgica inmediata', 'Recuperación de rango articular y fuerza', 'Prevención de rigidez y adherencias', 'Protocolos personalizados de ejercicio terapéutico']
            },
            {
                id: 'laparoscopica',
                category: 'alta-complejidad',
                title: 'Cirugía General Laparoscópica',
                desc: 'Tratamiento quirúrgico mínimamente invasivo para patologías digestivas, hernias de pared abdominal y vesícula biliar con incisiones milimétricas.',
                tech: 'Instrumental laparoscópico de corte ultrasónico y sellado vascular',
                recovery: 'Alta hospitalaria en 12 a 24 horas',
                features: ['Colecistectomía laparoscópica (vesícula)', 'Hernioplastias de pared abdominal con malla', 'Cirugía de reflujo gastroesofágico', 'Menor dolor postoperatorio y cicatrices mínimas']
            },
            {
                id: 'quirofano-inteligente',
                category: 'cuidados',
                title: 'Quirófano Inteligente & Corta Estancia',
                desc: 'Salas quirúrgicas Clase A con presión positiva de aire, flujo laminar estéril y tecnología médica de última generación.',
                tech: 'Filtración de aire HEPA 99.97% y mesas quirúrgicas electrohidráulicas',
                recovery: 'Suites individuales de corta estancia con confort premium',
                features: ['Bioseguridad hospitalaria nivel quirúrgico superior', 'Sistemas de energía ininterrumpida de grado médico', 'Monitoreo anestésico BIS y gases medicinales centralizados', 'Atención de enfermería quirúrgica 1 a 1']
            }
        ]
    });

    /* ==========================================================================
       4. CONTROLADOR PRINCIPAL DE LA INTERFAZ DE USUARIO (UI CONTROLLER)
       ========================================================================== */
    document.addEventListener('DOMContentLoaded', function () {
        initNavigation();
        initDoctorModals();
        initServiceModals();
        initCategoryFilters();
        initEstimatorTool();
        initFaqAccordion();
        initBookingForm();
        initScrollEffects();
        initSecurityStamp();
    });

    /**
     * Navegación y Menú Móvil Accesible
     */
    function initNavigation() {
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        const links = document.querySelectorAll('.nav-link');

        if (mobileBtn && navLinks) {
            mobileBtn.addEventListener('click', function () {
                const isOpen = navLinks.classList.toggle('active');
                mobileBtn.setAttribute('aria-expanded', isOpen);
                mobileBtn.classList.toggle('open', isOpen);
            });

            links.forEach(link => {
                link.addEventListener('click', function () {
                    navLinks.classList.remove('active');
                    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }

    /**
     * Modal interactivo para detalles de Especialistas
     */
    function initDoctorModals() {
        const modalOverlay = document.getElementById('medicalModal');
        const modalBody = document.getElementById('modalContent');
        const closeBtn = document.getElementById('modalCloseBtn');
        const doctorBtns = document.querySelectorAll('[data-doctor-id]');

        function openDoctorModal(doctorId) {
            const doctor = CLINICAL_DATA.doctors.find(d => d.id === doctorId);
            if (!doctor || !modalBody || !modalOverlay) return;

            const safeName = Security.escapeHTML(doctor.name);
            const safeRole = Security.escapeHTML(doctor.role);
            const safeExp = Security.escapeHTML(doctor.experience);
            const safeCred = Security.escapeHTML(doctor.credentials);
            const safeBio = Security.escapeHTML(doctor.bio);
            const safeSchedule = Security.escapeHTML(doctor.schedule);
            const safeImage = Security.escapeHTML(doctor.image);

            let proceduresHtml = '';
            doctor.procedures.forEach(proc => {
                proceduresHtml += `<li><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> ${Security.escapeHTML(proc)}</li>`;
            });

            modalBody.innerHTML = `
                <div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <img src="${safeImage}" alt="${safeName}" style="width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 3px solid var(--color-action);">
                    <div>
                        <span class="badge-tag" style="margin-bottom: 0.5rem;">${safeExp}</span>
                        <h3 style="color: var(--color-primary); font-size: 1.5rem; font-family: var(--font-heading); margin-bottom: 0.25rem;">${safeName}</h3>
                        <p style="color: var(--color-tertiary); font-weight: 600; font-size: 0.95rem;">${safeRole}</p>
                    </div>
                </div>
                
                <div style="margin-bottom: 1.25rem;">
                    <h4 style="color: var(--color-primary); font-size: 1rem; margin-bottom: 0.35rem; font-family: var(--font-heading);">Credenciales y Acreditación:</h4>
                    <p style="color: var(--color-gray-dark); font-size: 0.9rem; line-height: 1.5;">${safeCred}</p>
                </div>

                <div style="margin-bottom: 1.25rem;">
                    <h4 style="color: var(--color-primary); font-size: 1rem; margin-bottom: 0.35rem; font-family: var(--font-heading);">Perfil Clínico:</h4>
                    <p style="color: var(--color-black); font-size: 0.9rem; line-height: 1.5;">${safeBio}</p>
                </div>

                <div style="margin-bottom: 1.25rem;">
                    <h4 style="color: var(--color-primary); font-size: 1rem; margin-bottom: 0.5rem; font-family: var(--font-heading);">Procedimientos de Enfoque:</h4>
                    <ul class="service-features" style="margin-bottom: 0;">
                        ${proceduresHtml}
                    </ul>
                </div>

                <div style="background-color: var(--color-bg); padding: 0.85rem 1.25rem; border-radius: var(--border-radius-sm); margin-bottom: 1.5rem; border-left: 4px solid var(--color-action);">
                    <strong style="color: var(--color-primary); font-size: 0.875rem;">Horario de Consulta:</strong>
                    <p style="font-size: 0.85rem; color: var(--color-gray-dark); margin-top: 2px;">${safeSchedule}</p>
                </div>

                <div style="display: flex; gap: 1rem; justify-content: flex-end; flex-wrap: wrap;">
                    <button type="button" class="btn btn-outline btn-sm" id="modalCloseBtnInner">Cerrar</button>
                    <a href="#contacto" class="btn btn-action btn-sm" id="modalBookDocBtn" data-doc-name="${safeName}">Agendar con este Especialista</a>
                </div>
            `;

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            const innerClose = document.getElementById('modalCloseBtnInner');
            if (innerClose) innerClose.addEventListener('click', closeModal);

            const bookBtn = document.getElementById('modalBookDocBtn');
            if (bookBtn) {
                bookBtn.addEventListener('click', function () {
                    closeModal();
                    const doctorSelect = document.getElementById('bookingDoctor');
                    if (doctorSelect) {
                        for (let i = 0; i < doctorSelect.options.length; i++) {
                            if (doctorSelect.options[i].text.includes(doctor.name) || doctorSelect.options[i].value === doctor.id) {
                                doctorSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                });
            }
        }

        function closeModal() {
            if (modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        doctorBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const docId = this.getAttribute('data-doctor-id');
                if (docId) openDoctorModal(docId);
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) closeModal();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /**
     * Modal interactivo para detalles de Servicios
     */
    function initServiceModals() {
        const serviceBtns = document.querySelectorAll('[data-service-id]');
        const modalOverlay = document.getElementById('medicalModal');
        const modalBody = document.getElementById('modalContent');

        serviceBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const servId = this.getAttribute('data-service-id');
                const service = CLINICAL_DATA.services.find(s => s.id === servId);
                if (!service || !modalBody || !modalOverlay) return;

                const safeTitle = Security.escapeHTML(service.title);
                const safeDesc = Security.escapeHTML(service.desc);
                const safeTech = Security.escapeHTML(service.tech);
                const safeRec = Security.escapeHTML(service.recovery);

                let featuresHtml = '';
                service.features.forEach(f => {
                    featuresHtml += `<li><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> ${Security.escapeHTML(f)}</li>`;
                });

                modalBody.innerHTML = `
                    <div style="margin-bottom: 1.5rem;">
                        <span class="badge-tag" style="margin-bottom: 0.5rem;">Ficha Técnica de Procedimiento</span>
                        <h3 style="color: var(--color-primary); font-size: 1.6rem; font-family: var(--font-heading);">${safeTitle}</h3>
                    </div>

                    <p style="color: var(--color-black); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">${safeDesc}</p>

                    <div style="background-color: var(--color-bg); padding: 1.25rem; border-radius: var(--border-radius-md); margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
                        <div>
                            <strong style="color: var(--color-primary); font-size: 0.9rem;">Tecnología Quirúrgica Empleada:</strong>
                            <p style="font-size: 0.85rem; color: var(--color-gray-dark); margin-top: 2px;">${safeTech}</p>
                        </div>
                        <div>
                            <strong style="color: var(--color-primary); font-size: 0.9rem;">Tiempo Promedio de Estancia / Recuperación:</strong>
                            <p style="font-size: 0.85rem; color: var(--color-gray-dark); margin-top: 2px;">${safeRec}</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="color: var(--color-primary); font-size: 1rem; margin-bottom: 0.5rem; font-family: var(--font-heading);">Beneficios del Protocolo Human:</h4>
                        <ul class="service-features">
                            ${featuresHtml}
                        </ul>
                    </div>

                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <a href="#contacto" class="btn btn-action" id="modalBookServBtn">Solicitar Valoración de este Procedimiento</a>
                    </div>
                `;

                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';

                const bookBtn = document.getElementById('modalBookServBtn');
                if (bookBtn) {
                    bookBtn.addEventListener('click', function () {
                        if (modalOverlay) modalOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                        const serviceSelect = document.getElementById('bookingService');
                        if (serviceSelect) {
                            for (let i = 0; i < serviceSelect.options.length; i++) {
                                if (serviceSelect.options[i].value === service.id || serviceSelect.options[i].text.includes(service.title)) {
                                    serviceSelect.selectedIndex = i;
                                    break;
                                }
                            }
                        }
                    });
                }
            });
        });
    }

    /**
     * Filtro dinámico de categorías de servicios
     */
    function initCategoryFilters() {
        const filterBtns = document.querySelectorAll('.filter-tab-btn');
        const serviceCards = document.querySelectorAll('.service-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                serviceCards.forEach(card => {
                    if (filter === 'todos' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                        card.style.opacity = '1';
                    } else {
                        card.style.display = 'none';
                        card.style.opacity = '0';
                    }
                });
            });
        });
    }

    /**
     * Cotizador / Asistente Quirúrgico Interactivo
     */
    function initEstimatorTool() {
        const specSelect = document.getElementById('calcSpecialty');
        const typeSelect = document.getElementById('calcType');
        const estimateDesc = document.getElementById('calcEstimateDesc');
        const estimateTime = document.getElementById('calcEstimateTime');
        const applyBtn = document.getElementById('calcApplyBtn');

        const estimatorGuide = {
            'bariatrica': {
                'presencial': { desc: 'Valoración metabólica integral con cirujano bariátrico y plan prequirúrgico personalizado.', time: 'Cita en 24-48h hábiles' },
                'teleconsulta': { desc: 'Orientación virtual inicial, revisión de analíticas y cálculo de IMC.', time: 'Mismo día / 24h' },
                'quirurgica': { desc: 'Protocolo completo preoperatorio con evaluación multidisciplinaria.', time: 'Programación semanal' }
            },
            'traumatologia': {
                'presencial': { desc: 'Examen articular clínico, revisión de resonancia y test de movilidad.', time: 'Cita en 24-48h hábiles' },
                'teleconsulta': { desc: 'Segunda opinión médica sobre estudios radiológicos e imagenológicos.', time: 'Mismo día / 24h' },
                'quirurgica': { desc: 'Planificación de artroscopia o sustitución articular con implantes certificados.', time: 'Programación semanal' }
            },
            'medicina-interna': {
                'presencial': { desc: 'Evaluación de riesgo quirúrgico ASA, electrocardiograma y chequeo integral.', time: 'Cita en 24h hábiles' },
                'teleconsulta': { desc: 'Control de tratamientos crónicos y ajuste de medicación perioperatoria.', time: 'Mismo día' },
                'quirurgica': { desc: 'Acompañamiento clínico integral intrahospitalario.', time: 'Inmediata' }
            },
            'fisiatria': {
                'presencial': { desc: 'Evaluación funcional postoperatoria y diseño de pauta terapéutica.', time: 'Cita en 24h hábiles' },
                'teleconsulta': { desc: 'Guía de ejercicios asistidos en casa y ergonomía postoperatoria.', time: 'Mismo día' },
                'quirurgica': { desc: 'Rehabilitación precoz intrahospitalaria.', time: 'Inmediata' }
            }
        };

        function updateEstimate() {
            if (!specSelect || !typeSelect || !estimateDesc || !estimateTime) return;
            const spec = specSelect.value || 'bariatrica';
            const type = typeSelect.value || 'presencial';

            if (estimatorGuide[spec] && estimatorGuide[spec][type]) {
                estimateDesc.textContent = estimatorGuide[spec][type].desc;
                estimateTime.textContent = 'Tiempo estimado de respuesta: ' + estimatorGuide[spec][type].time;
            }
        }

        if (specSelect) specSelect.addEventListener('change', updateEstimate);
        if (typeSelect) typeSelect.addEventListener('change', updateEstimate);

        if (applyBtn) {
            applyBtn.addEventListener('click', function () {
                const spec = specSelect ? specSelect.value : '';
                const bookSpec = document.getElementById('bookingService');
                if (bookSpec && spec) {
                    bookSpec.value = spec;
                }
                const contactSection = document.getElementById('contacto');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    /**
     * Acordeón de Preguntas Frecuentes (FAQ)
     */
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            if (btn) {
                btn.addEventListener('click', function () {
                    const isActive = item.classList.contains('active');
                    
                    // Cerrar los demás acordeones para mejor UX
                    faqItems.forEach(other => {
                        other.classList.remove('active');
                        const otherBtn = other.querySelector('.faq-question');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    });

                    if (!isActive) {
                        item.classList.add('active');
                        btn.setAttribute('aria-expanded', 'true');
                    } else {
                        btn.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    }

    /**
     * Formulario de Agendamiento / Contacto con Blindaje Ciberseguro
     */
    function initBookingForm() {
        const form = document.getElementById('bookingForm');
        if (!form) return;

        // Inserción dinámica de token de sesión y timestamp de protección bot
        const formLoadTimestamp = Date.now();

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // 1. Verificación de Rate Limiting (Anti-Spam / Anti-DDoS)
            if (!RateLimiter.isAllowed()) {
                showFormAlert('Has superado el límite de solicitudes por minuto. Por motivos de seguridad médica, aguarda unos instantes o contáctanos por teléfono.', 'error');
                return;
            }

            // 2. Trampa Honeypot contra Bots automatizados
            const honeypot = document.getElementById('securityHoneypot');
            if (honeypot && honeypot.value.trim() !== '') {
                // Bot detectado silenciosamente
                console.warn('Bot submission trapped');
                showFormAlert('Solicitud procesada con éxito.', 'success');
                form.reset();
                return;
            }

            // 3. Verificación de velocidad humana (Anti-fast submit bots)
            const submitSpeedMs = Date.now() - formLoadTimestamp;
            if (submitSpeedMs < 1200) {
                // Completado en menos de 1.2 segundos (humano imposible)
                console.warn('Submission too fast');
                return;
            }

            // 4. Extracción y Sanitización de campos
            const nameField = document.getElementById('bookingName');
            const emailField = document.getElementById('bookingEmail');
            const phoneField = document.getElementById('bookingPhone');
            const serviceField = document.getElementById('bookingService');
            const doctorField = document.getElementById('bookingDoctor');
            const dateField = document.getElementById('bookingDate');
            const notesField = document.getElementById('bookingNotes');
            const consentCheckbox = document.getElementById('bookingConsent');

            const name = Security.sanitizeString(nameField ? nameField.value : '');
            const email = Security.sanitizeString(emailField ? emailField.value : '');
            const phone = Security.sanitizeString(phoneField ? phoneField.value : '');
            const service = Security.sanitizeString(serviceField ? serviceField.value : '');
            const doctor = Security.sanitizeString(doctorField ? doctorField.value : '');
            const date = Security.sanitizeString(dateField ? dateField.value : '');
            const notes = Security.sanitizeString(notesField ? notesField.value : '');

            // 5. Validaciones de Integridad de Datos
            if (!Security.validateName(name)) {
                showFormAlert('Por favor ingresa un nombre y apellido válido (solo letras, mín. 3 caracteres).', 'error');
                if (nameField) nameField.focus();
                return;
            }

            if (!Security.validateEmail(email)) {
                showFormAlert('Por favor ingresa una dirección de correo electrónico válida.', 'error');
                if (emailField) emailField.focus();
                return;
            }

            if (!Security.validatePhone(phone)) {
                showFormAlert('Por favor ingresa un número telefónico válido.', 'error');
                if (phoneField) phoneField.focus();
                return;
            }

            if (consentCheckbox && !consentCheckbox.checked) {
                showFormAlert('Debes aceptar la política de privacidad y protección de datos médicos para continuar.', 'error');
                return;
            }

            // Registrar envío en Rate Limiter
            RateLimiter.recordSubmission();

            // Generación de Ticket Seguro
            const token = Security.generateReservationToken();

            // Modal de confirmación exitosa
            showConfirmationModal({
                token: token,
                name: name,
                email: email,
                phone: phone,
                service: serviceField && serviceField.options[serviceField.selectedIndex] ? serviceField.options[serviceField.selectedIndex].text : 'Consulta General',
                doctor: doctorField && doctorField.options[doctorField.selectedIndex] ? doctorField.options[doctorField.selectedIndex].text : 'Cualquier especialista disponible',
                date: date || 'A coordinar con recepción',
                notes: notes
            });

            form.reset();
        });

        function showFormAlert(message, type) {
            const alertBox = document.getElementById('formAlertBox');
            if (alertBox) {
                alertBox.textContent = message;
                alertBox.className = 'form-feedback ' + type;
                alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                alert(message);
            }
        }

        function showConfirmationModal(data) {
            const modalOverlay = document.getElementById('medicalModal');
            const modalBody = document.getElementById('modalContent');
            if (!modalBody || !modalOverlay) return;

            const safeToken = Security.escapeHTML(data.token);
            const safeName = Security.escapeHTML(data.name);
            const safeService = Security.escapeHTML(data.service);
            const safeDoctor = Security.escapeHTML(data.doctor);
            const safeDate = Security.escapeHTML(data.date);

            // Mensaje seguro para WhatsApp
            const waText = encodeURIComponent(`Hola Centro Quirúrgico Human. He generado mi solicitud de cita médica (Código: ${data.token}). Nombre: ${data.name}, Especialidad: ${data.service}, Doctor: ${data.doctor}, Fecha sugerida: ${data.date}.`);
            const waUrl = `https://wa.me/584141234567?text=${waText}`;

            modalBody.innerHTML = `
                <div style="text-align: center; padding: 1rem 0;">
                    <div style="width: 64px; height: 64px; background: rgba(16, 185, 129, 0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: var(--color-success); margin-bottom: 1rem;">
                        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <span class="badge-tag" style="display: inline-block; margin-bottom: 0.5rem; background: rgba(16, 185, 129, 0.1); color: var(--color-success); border-color: rgba(16, 185, 129, 0.3);">Pre-Reserva Confirmada</span>
                    <h3 style="color: var(--color-primary); font-size: 1.6rem; font-family: var(--font-heading); margin-bottom: 0.5rem;">¡Solicitud Recibida, ${safeName}!</h3>
                    <p style="color: var(--color-gray-dark); font-size: 0.95rem; margin-bottom: 1.5rem;">Tu código de seguridad y seguimiento clínico es:</p>
                    
                    <div style="background: var(--gradient-primary); color: #fff; padding: 1rem; border-radius: var(--border-radius-md); font-size: 1.4rem; font-family: var(--font-heading); letter-spacing: 0.1em; margin-bottom: 1.5rem; box-shadow: var(--shadow-md);">
                        ${safeToken}
                    </div>

                    <div style="background-color: var(--color-bg); padding: 1rem 1.25rem; border-radius: var(--border-radius-sm); text-align: left; font-size: 0.9rem; color: var(--color-black); margin-bottom: 1.5rem; border: 1px solid var(--color-gray-light);">
                        <p style="margin-bottom: 0.35rem;"><strong>Servicio:</strong> ${safeService}</p>
                        <p style="margin-bottom: 0.35rem;"><strong>Especialista:</strong> ${safeDoctor}</p>
                        <p style="margin-bottom: 0;"><strong>Fecha tentativa:</strong> ${safeDate}</p>
                    </div>

                    <p style="color: var(--color-gray-dark); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.5rem;">
                        Nuestro equipo de coordinación médica se pondrá en contacto contigo en un plazo menor a 2 horas para confirmar hora exacta y enviar las indicaciones previas.
                    </p>

                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-action" style="background: #25D366; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                            Confirmar vía WhatsApp
                        </a>
                        <button type="button" class="btn btn-outline" id="modalFinishBtn">Cerrar y Regresar</button>
                    </div>
                </div>
            `;

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            const finishBtn = document.getElementById('modalFinishBtn');
            if (finishBtn) {
                finishBtn.addEventListener('click', function () {
                    modalOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        }
    }

    /**
     * Efectos de Scroll y Botón Volver Arriba
     */
    function initScrollEffects() {
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        const header = document.querySelector('.main-header');

        window.addEventListener('scroll', function () {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTopBtn) {
                if (scrollY > 400) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            }

            if (header) {
                if (scrollY > 50) {
                    header.style.boxShadow = '0 6px 25px rgba(2, 33, 64, 0.12)';
                } else {
                    header.style.boxShadow = '0 4px 20px rgba(2, 33, 64, 0.06)';
                }
            }
        }, { passive: true });

        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    /**
     * Sello de Seguridad y Cifrado
     */
    function initSecurityStamp() {
        console.log('%c Centro Quirúrgico Human %c Sistema Seguro Blindado v2.0 ', 'background: #022140; color: #fff; font-weight: bold; padding: 4px;', 'background: #04BBBF; color: #022140; font-weight: bold; padding: 4px;');
    }

})();