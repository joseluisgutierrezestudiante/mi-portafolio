// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log("Portafolio cargado correctamente 🚀");

    const navLinks = document.querySelectorAll('.nav-links a');
    const themeButton = document.getElementById('toggle-theme');
    const adminToggle = document.getElementById('toggle-admin');
    const adminPanel = document.getElementById('admin-panel');
    const adminForm = document.getElementById('admin-form');
    const projectsGrid = document.getElementById('projects-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const contactForm = document.getElementById('contact-form');
    const contactErrors = document.getElementById('contact-errors');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (!targetSection) return;

            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });

    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    const applyTheme = (theme) => {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        if (themeButton) {
            const isDark = theme === 'dark';
            themeButton.textContent = isDark ? '☼' : '◐';
            themeButton.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
            themeButton.setAttribute('aria-pressed', String(isDark));
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    // Paleta (selector de colores)
    const savedPalette = localStorage.getItem('palette');
    const applyPalette = (name) => {
        if (!name) {
            document.documentElement.removeAttribute('data-theme');
            return;
        }
        document.documentElement.setAttribute('data-theme', name);
        document.querySelectorAll('.swatch').forEach(s => s.setAttribute('aria-pressed', String(s.dataset.palette === name)));
        localStorage.setItem('palette', name);
    };
    if (savedPalette) applyPalette(savedPalette);

    // swatches UI
    document.querySelectorAll('.swatch').forEach(btn => {
        btn.addEventListener('click', () => {
            const p = btn.dataset.palette;
            applyPalette(p);
        });
    });

    if (themeButton) {
        themeButton.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            const theme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            themeButton.textContent = isDark ? '☼' : '◐';
            themeButton.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
            themeButton.setAttribute('aria-pressed', String(isDark));
        });
    }

    // --- Toast notification system ---
    const toastEl = document.getElementById('toast');
    let toastTimer = null;
    const showToast = (message) => {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 3000);
    };

    // --- Hero code window tabs & Terminal ---
    const windowTabs = document.querySelectorAll('.window-tab');
    const windowLang = document.getElementById('window-lang');
    windowTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            windowTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const targetTab = tab.dataset.tab;
            if (windowLang) {
                if (targetTab === 'profile') windowLang.textContent = 'ES6+';
                else if (targetTab === 'method') windowLang.textContent = 'MD';
                else if (targetTab === 'terminal') {
                    windowLang.textContent = 'BASH';
                    setTimeout(() => {
                        const input = document.getElementById('terminal-input');
                        if (input) input.focus();
                    }, 50);
                }
            }

            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            const activePane = document.getElementById(`tab-${targetTab}`);
            if (activePane) activePane.classList.add('active');
        });
    });

    // --- Motor de la Terminal Interactiva ---
    const terminalForm = document.getElementById('terminal-form');
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');
    const commandHistoryList = [];
    let historyIndex = -1;

    const printToTerminal = (cmd, outputHtml) => {
        if (!terminalHistory) return;
        const entry = document.createElement('div');
        entry.className = 'terminal-entry';
        entry.innerHTML = `
            <div class="term-line-user">
                <span class="term-user">visitor@joseluis</span><span class="term-dollar">:~$</span>
                <span class="term-line-cmd">${escapeHtml(cmd)}</span>
            </div>
            <div class="term-line-output">${outputHtml}</div>
        `;
        terminalHistory.appendChild(entry);
        terminalHistory.scrollTop = terminalHistory.scrollHeight;
    };

    const executeCommand = (rawCmd) => {
        const cmd = rawCmd.trim();
        if (!cmd) return;

        commandHistoryList.push(cmd);
        historyIndex = commandHistoryList.length;

        const lower = cmd.toLowerCase();
        const parts = lower.split(' ').filter(Boolean);
        const mainCmd = parts[0];

        if (mainCmd === 'clear' || mainCmd === 'cls') {
            if (terminalHistory) terminalHistory.innerHTML = '';
            return;
        }

        if (mainCmd === 'help') {
            printToTerminal(cmd, `
<span class="term-highlight">// COMANDOS DISPONIBLES</span>
  • <span class="term-cmd">skills</span>        : Stack técnico clasificado
  • <span class="term-cmd">proyectos</span>     : Catálogo de proyectos y demos
  • <span class="term-cmd">python app.py</span> : Simula el microservicio Flask & SQLite
  • <span class="term-cmd">contacto</span>      : Canales de contacto directo
  • <span class="term-cmd">theme &lt;tono&gt;</span>  : Cambia el tono (cobalt, terracotta, olive, graphite)
  • <span class="term-cmd">whoami</span>        : Contexto de la sesión
  • <span class="term-cmd">clear</span>         : Limpia la pantalla
`);
            return;
        }

        if (mainCmd === 'skills' || mainCmd === 'stack') {
            printToTerminal(cmd, `
<span class="term-highlight">// STACK TÉCNICO</span>
  [01] Frontend : HTML5 Semántico, CSS3 Flex/Grid, JavaScript (ES6+), React
  [02] Backend  : Python 3, Flask REST APIs, Node.js
  [03] Datos    : SQL Relacional, SQLite, Operaciones CRUD, Consultas JOIN
  [04] Entorno  : Git/GitHub, Linux/Bash, LocalStorage, Clean Code
`);
            return;
        }

        if (mainCmd === 'proyectos' || mainCmd === 'projects') {
            printToTerminal(cmd, `
<span class="term-highlight">// PROYECTOS DESTACADOS</span>
  1. <span class="term-success">Sistema de inventario</span> [Python + Flask + SQLite]
     Demo: api-mascotas/dashboard.html
  2. <span class="term-success">Landing que convierte</span> [HTML5 + CSS3 + JS]
  3. <span class="term-success">Panel de tareas</span> [JavaScript + LocalStorage]
  
  Tip: Ejecuta <span class="term-cmd">python app.py</span> para simular el inicio del backend.
`);
            return;
        }

        if (lower === 'python app.py' || lower === 'python' || lower === 'flask run') {
            printToTerminal(cmd, `
<span class="term-success">* Iniciando microservicio: api-mascotas</span>
* Entorno: produccion
* Base de datos: inventario.db conectada (SQLite 3.x)
* Modelos relacionales validados: 'productos', 'categorias' [OK]
* Endpoints REST activos:
    - GET    /api/productos (200 OK)
    - GET    /api/productos/stock-bajo (200 OK)
    - POST   /api/productos (201 Created)
* Servicio activo en http://127.0.0.1:5000/
<span class="term-highlight">[OK] API lista para recibir peticiones HTTP.</span>
`);
            return;
        }

        if (mainCmd === 'contacto' || mainCmd === 'contact' || mainCmd === 'email') {
            printToTerminal(cmd, `
<span class="term-highlight">// CANALES DIRECTOS</span>
  [EMAIL]    <a href="mailto:joseluismachado09@gmail.com" class="term-highlight">joseluismachado09@gmail.com</a>
  [LINKEDIN] <a href="https://www.linkedin.com/in/jose-luis-guti%C3%A9rrez-machado-391619217/" target="_blank" class="term-highlight">Jose Luis Gutierrez Machado</a>
  [GITHUB]   <a href="https://github.com/joseluisgutierrezestudiante" target="_blank" class="term-highlight">@joseluisgutierrezestudiante</a>
`);
            return;
        }

        if (mainCmd === 'theme') {
            const chosen = parts[1];
            const aliases = { blue: 'cobalt', coral: 'terracotta', teal: 'olive', purple: 'cobalt' };
            const normalized = aliases[chosen] || chosen;
            if (['cobalt', 'terracotta', 'olive', 'graphite'].includes(normalized)) {
                applyPalette(normalized);
                printToTerminal(cmd, `<span class="term-success">✓ Paleta aplicada: ${normalized}</span>`);
            } else {
                printToTerminal(cmd, `<span class="term-warn">Tono no reconocido. Opciones: cobalt, terracotta, olive, graphite</span>`);
            }
            return;
        }

        if (mainCmd === 'whoami') {
            printToTerminal(cmd, `Sesión de visitante en el portafolio de Jose Luis Gutierrez Machado. Modo lectura activo.`);
            return;
        }

        if (mainCmd === 'sudo') {
            printToTerminal(cmd, `<span class="term-warn">sudo: permiso denegado. Acceso restringido al autor.</span>`);
            return;
        }

        printToTerminal(cmd, `<span class="term-warn">Comando no reconocido: "${escapeHtml(cmd)}". Escribe <span class="term-cmd">help</span> para ver la lista.</span>`);
    };

    if (terminalForm) {
        terminalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!terminalInput) return;
            const cmd = terminalInput.value;
            terminalInput.value = '';
            executeCommand(cmd);
        });
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistoryList[historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistoryList.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistoryList[historyIndex] || '';
                } else {
                    historyIndex = commandHistoryList.length;
                    terminalInput.value = '';
                }
            }
        });
    }

    document.querySelectorAll('.term-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.dataset.cmd;
            if (cmd) {
                if (terminalInput) terminalInput.value = cmd;
                executeCommand(cmd);
                if (terminalInput) terminalInput.value = '';
            }
        });
    });

    // --- Quick copy email in hero ---
    const copyEmailBtn = document.getElementById('copy-email-hero');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = copyEmailBtn.dataset.email || 'joseluismachado09@gmail.com';
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(email);
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = email;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }
                showToast('¡Correo copiado al portapapeles! 📬');
            } catch (err) {
                showToast('Email: joseluismachado09@gmail.com');
            }
        });
    }

    // Admin panel toggle (demo CRUD)
    if (adminToggle && adminPanel) {
        adminToggle.addEventListener('click', () => {
            const showing = !adminPanel.classList.toggle('hidden');
            adminMode = showing;
            adminPanel.setAttribute('aria-hidden', String(!showing));
            adminToggle.textContent = showing ? 'Cerrar gestor' : 'Gestionar proyectos';
            renderProjects(getActiveFilter());
        });
    }

    // --- Simple CRUD for projects (stored in localStorage) ---
    const STORAGE_KEY = 'mi_portafolio_projects_v1';

    const sampleProjects = [
        { 
            id: 101, 
            title: 'Landing que convierte', 
            desc: 'Sistema visual responsive y minimalista para presentar productos digitales sin ruido, con jerarquía limpia y alto impacto.', 
            categories: ['frontend', 'javascript'], 
            tech: ['HTML5', 'CSS3 Moderno', 'JavaScript'],
            icon: '💻',
            demo: '#hero',
            repo: 'https://github.com/joseluisgutierrezestudiante/POO-actividad-perro.git'
        },
        { 
            id: 102, 
            title: 'Panel de tareas & productividad', 
            desc: 'Herramienta de organización con persistencia local en tiempo real, filtros dinámicos y estados de progreso fluidos.', 
            categories: ['frontend', 'javascript'], 
            tech: ['JavaScript ES6+', 'LocalStorage', 'CSS Grid'],
            icon: '⚡',
            demo: '#proyectos',
            repo: 'https://github.com/joseluisgutierrezestudiante/POO-actividad-perro.git'
        },
        { 
            id: 103, 
            title: 'Sistema de inventario & Stock', 
            desc: 'API REST y panel administrativo con control de existencias, alerta de stock bajo y operaciones CRUD en Python y SQLite.', 
            categories: ['backend', 'python'], 
            tech: ['Python 3', 'Flask', 'SQLite', 'REST API'],
            icon: '📦',
            demo: 'api-mascotas/dashboard.html',
            repo: 'https://github.com/joseluisgutierrezestudiante/POO-actividad-perro.git'
        }
    ];

    const loadProjects = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProjects));
                return sampleProjects.slice();
            }
            const storedProjects = JSON.parse(raw);
            return storedProjects.map(project => {
                if (!project.icon) {
                    if (project.title.toLowerCase().includes('inventario') || (project.categories && project.categories.includes('backend'))) {
                        project.icon = '📦';
                        project.demo = 'api-mascotas/dashboard.html';
                    } else if (project.title.toLowerCase().includes('panel')) {
                        project.icon = '⚡';
                    } else {
                        project.icon = '💻';
                    }
                }
                if (!project.repo) project.repo = 'https://github.com/joseluisgutierrezestudiante';
                return project;
            });
        } catch (e) {
            console.error('Error cargando proyectos:', e);
            return sampleProjects.slice();
        }
    };

    const saveProjects = (arr) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    };

    let projects = loadProjects();
    saveProjects(projects);
    let adminMode = false;

    // Efecto de spotlight interactivo en las tarjetas
    const initSpotlight = () => {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    };

    const getBlueprintHtml = (title, categories) => {
        const t = (title || '').toLowerCase();
        const cats = (categories || []).map(c => c.toLowerCase());
        if (t.includes('inventario') || cats.includes('backend') || cats.includes('python')) {
            return `
                <div class="bp-window bp-db">
                    <div class="bp-db-header"><span>sqlite://inventario.db</span><span class="bp-db-status">LIVE</span></div>
                    <div class="bp-table">
                        <div class="bp-tr bp-th"><span>COD</span><span>PRODUCTO</span><span>STOCK</span></div>
                        <div class="bp-tr"><span>#101</span><span>Teclado Mecánico</span><span class="bp-tag ok">10 ud</span></div>
                        <div class="bp-tr"><span>#102</span><span>Mouse Sensor</span><span class="bp-tag warn">3 ud</span></div>
                    </div>
                </div>
            `;
        }
        if (t.includes('panel') || t.includes('tarea') || t.includes('productividad')) {
            return `
                <div class="bp-window bp-tasks">
                    <div class="bp-task-bar"><span class="bp-dot active"></span><span>Tablero de Enfoque</span></div>
                    <div class="bp-checklist">
                        <div class="bp-item checked"><span class="check">✓</span><span>Persistencia con LocalStorage</span></div>
                        <div class="bp-item checked"><span class="check">✓</span><span>Filtro dinámico de tareas</span></div>
                        <div class="bp-item"><span class="check">○</span><span>Transiciones de estado fluidas</span></div>
                    </div>
                </div>
            `;
        }
        return `
            <div class="bp-window bp-layout">
                <div class="bp-wire-nav"><span></span><span></span></div>
                <div class="bp-wire-hero">
                    <div class="bp-wire-h1"></div>
                    <div class="bp-wire-btn"></div>
                </div>
                <div class="bp-wire-grid"><span></span><span></span><span></span></div>
            </div>
        `;
    };

    const createCard = (proj) => {
        const el = document.createElement('article');
        el.className = 'project-card';
        el.setAttribute('data-categories', (proj.categories || []).join(','));
        el.dataset.id = proj.id;

        const mainCat = String((proj.categories && proj.categories[0]) || 'proyecto').toUpperCase();
        const demoUrl = proj.demo || (proj.title.toLowerCase().includes('inventario') ? 'api-mascotas/dashboard.html' : '#');
        const repoUrl = proj.repo || 'https://github.com/joseluisgutierrezestudiante';

        el.innerHTML = `
            <div class="card-preview">
                <div class="card-preview-bar">
                    <div class="card-preview-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <span class="card-tag">${escapeHtml(mainCat)}</span>
                </div>
                <div class="card-schematic">${getBlueprintHtml(proj.title, proj.categories)}</div>
            </div>
            <div class="card-body">
                <div class="project-meta">
                    <span class="project-cat-badge">// ${escapeHtml(mainCat)}</span>
                </div>
                <h3>${escapeHtml(proj.title)}</h3>
                <p>${escapeHtml(proj.desc)}</p>
                <div class="tech-pills">
                    ${(proj.tech || []).map(t => `<span class="tech-pill">${escapeHtml(t)}</span>`).join('')}
                </div>
                <div class="card-actions-bar">
                    <a href="${demoUrl}" class="btn-card-primary" ${demoUrl.startsWith('http') || demoUrl.includes('.html') ? 'target="_blank" rel="noopener"' : ''}>Ver demo ↗</a>
                    <a href="${repoUrl}" target="_blank" rel="noopener" class="btn-card-ghost">Código ↗</a>
                    ${adminMode ? `
                    <div class="admin-card-tools">
                        <button class="edit-btn" data-id="${proj.id}">Editar</button>
                        <button class="delete-btn" data-id="${proj.id}">Borrar</button>
                    </div>` : ''}
                </div>
            </div>
        `;
        return el;
    };

    const renderProjects = (filter = 'all') => {
        projectsGrid.innerHTML = '';
        const list = projects.filter(p => {
            if (filter === 'all') return true;
            return (p.categories || []).map(c=>c.toLowerCase()).includes(filter.toLowerCase());
        });
        if (list.length === 0) {
            projectsGrid.innerHTML = '<p style="grid-column: 1/-1; padding: 30px; text-align: center; color: var(--muted);">No hay proyectos para esta categoría.</p>';
            return;
        }
        list.forEach(p => projectsGrid.appendChild(createCard(p)));
        initSpotlight();
    };

    const addProject = (proj) => {
        projects.unshift(proj);
        saveProjects(projects);
        renderProjects(getActiveFilter());
    };

    const updateProject = (id, data) => {
        projects = projects.map(p => p.id === id ? Object.assign({}, p, data) : p);
        saveProjects(projects);
        renderProjects(getActiveFilter());
    };

    const deleteProject = (id) => {
        projects = projects.filter(p => p.id !== id);
        saveProjects(projects);
        renderProjects(getActiveFilter());
    };

    const escapeHtml = (str) => String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]);

    // Attach filter buttons
    const getActiveFilter = () => document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });

    // Admin form handling (crear/editar)
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const idField = document.getElementById('project-id');
            const title = document.getElementById('project-title').value.trim();
            const desc = document.getElementById('project-desc').value.trim();
            const cats = document.getElementById('project-cats').value.split(',').map(s=>s.trim()).filter(Boolean);
            const tech = document.getElementById('project-tech').value.split(',').map(s=>s.trim()).filter(Boolean);

            if (!title || !desc) return;

            if (idField.value) {
                updateProject(Number(idField.value), { title, desc, categories: cats, tech });
            } else {
                addProject({ id: Date.now(), title, desc, categories: cats, tech });
            }

            adminForm.reset();
            idField.value = '';
        });

        document.getElementById('admin-cancel')?.addEventListener('click', () => {
            adminForm.reset();
            document.getElementById('project-id').value = '';
        });

        // Delegación para editar/eliminar
        projectsGrid.addEventListener('click', (e) => {
            const edit = e.target.closest('.edit-btn');
            const del = e.target.closest('.delete-btn');
            if (edit) {
                const id = Number(edit.dataset.id);
                const p = projects.find(x=>x.id===id);
                if (!p) return;
                document.getElementById('project-id').value = p.id;
                document.getElementById('project-title').value = p.title;
                document.getElementById('project-desc').value = p.desc;
                document.getElementById('project-cats').value = p.categories.join(', ');
                document.getElementById('project-tech').value = p.tech.join(', ');
                adminPanel.classList.remove('hidden');
                adminPanel.setAttribute('aria-hidden', 'false');
            }
            if (del) {
                const id = Number(del.dataset.id);
                if (confirm('Eliminar proyecto?')) deleteProject(id);
            }
        });
    }

    // Inicializar proyectos
    renderProjects();

    // --- Contact form validation (cliente) ---
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactErrors.textContent = '';
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            const errors = [];
            if (name.length < 2) errors.push('Nombre demasiado corto.');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Correo inválido.');
            if (message.length < 10) errors.push('Mensaje demasiado corto (mín 10 caracteres).');

            if (errors.length) {
                contactErrors.textContent = errors.join(' ');
                return;
            }

            // Simular envío
            contactErrors.style.color = '#10b981';
            contactErrors.textContent = 'Mensaje enviado correctamente. ¡Gracias!';
            showToast('¡Mensaje enviado! 🚀 Responderé a la brevedad.');
            contactForm.reset();
            setTimeout(() => {
                contactErrors.textContent = '';
            }, 5000);
        });
    }

    // --- Mobile menu toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksList = document.querySelector('.nav-links');
    if (mobileToggle && navLinksList) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinksList.classList.toggle('open');
            mobileToggle.classList.toggle('open', isOpen);
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Cerrar menú al hacer clic en cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksList.classList.remove('open');
                mobileToggle.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Copy channel text buttons (email en sección contacto) ---
    document.querySelectorAll('.btn-copy-channel').forEach(btn => {
        btn.addEventListener('click', async () => {
            const text = btn.dataset.copy;
            if (!text) return;
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                } else {
                    const temp = document.createElement('input');
                    temp.value = text;
                    document.body.appendChild(temp);
                    temp.select();
                    document.execCommand('copy');
                    document.body.removeChild(temp);
                }
                showToast(`¡Copiado al portapapeles: ${text}! 📋`);
            } catch (e) {
                showToast(text);
            }
        });
    });
});