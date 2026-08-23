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
            const targetId = e.target.getAttribute('href');
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
        { id: Date.now() + 1, title: 'Landing que convierte', desc: 'Sistema visual responsive para presentar un servicio sin ruido y con una jerarquía clara.', categories: ['frontend','javascript'], tech: ['HTML','CSS','JavaScript'] },
        { id: Date.now() + 2, title: 'Panel de tareas', desc: 'Herramienta de foco con persistencia local y estados diseñados para avanzar.', categories: ['frontend','javascript'], tech: ['JavaScript','LocalStorage'] },
        { id: Date.now() + 3, title: 'Sistema de inventario', desc: 'Aplicación sencilla para registrar productos, controlar stock y organizar categorías con Python y SQL.', categories: ['backend','python'], tech: ['Python','Flask','SQL'] }
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
                if (project.title === 'API de recursos' || project.title === 'API en Python con SQL') {
                    return Object.assign({}, project, {
                        title: 'Sistema de inventario',
                        desc: 'Aplicación sencilla para registrar productos, controlar stock y organizar categorías con Python y SQL.',
                        tech: project.tech.includes('SQL') ? project.tech : [...project.tech, 'SQL']
                    });
                }
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

    const createCard = (proj) => {
        const el = document.createElement('article');
        el.className = 'project-card';
        el.setAttribute('data-categories', proj.categories.join(','));
        el.dataset.id = proj.id;
        el.innerHTML = `
            <div class="project-meta"><span>${String(proj.categories[0] || 'proyecto').toUpperCase()}</span><span>↗</span></div>
            <h3>${escapeHtml(proj.title)}</h3>
            <p>${escapeHtml(proj.desc)}</p>
            <div class="tech-stack">${proj.tech.map(t=>escapeHtml(t)).join(' • ')}</div>
            ${adminMode ? `<div class="card-actions">
                <button class="edit-btn" data-id="${proj.id}">Editar</button>
                <button class="delete-btn" data-id="${proj.id}">Eliminar</button>
            </div>` : ''}
        `;
        return el;
    };

    const renderProjects = (filter = 'all') => {
        projectsGrid.innerHTML = '';
        const list = projects.filter(p => {
            if (filter === 'all') return true;
            return p.categories.map(c=>c.toLowerCase()).includes(filter.toLowerCase());
        });
        if (list.length === 0) {
            projectsGrid.innerHTML = '<p>No hay proyectos para esta categoría.</p>';
            return;
        }
        list.forEach(p => projectsGrid.appendChild(createCard(p)));
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

            // Simular envío: aquí podrías integrar un servicio real (Formspree, Netlify Forms, email API)
            contactErrors.style.color = 'green';
            contactErrors.textContent = 'Mensaje enviado. Gracias — responderé pronto.';
            contactForm.reset();
            setTimeout(()=>{ contactErrors.textContent=''; contactErrors.style.color = 'var(--accent)'; }, 4000);
        });
    }
});