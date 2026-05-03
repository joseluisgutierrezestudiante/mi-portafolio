# Mi Portafolio — Desarrollador

Portafolio personal con proyectos y casos de estudio. Diseño limpio, mobile-first y con un pequeño gestor de proyectos como demo.

## Contenido
- `index.html` — página principal
- `css/styles.css` — estilos (responsive, modo oscuro)
- `js/main.js` — interacciones: tema, filtros, CRUD demo, validación de formulario

## Características
- Diseño mobile-first y responsive
- Modo oscuro con persistencia en `localStorage`
- Sección de proyectos con filtro por categoría
- CRUD simple para proyectos (guardado en `localStorage`) — útil como demo
- Formulario de contacto con validación cliente

## Ejecutar localmente
La forma más simple es abrir `index.html` en el navegador. Para un entorno más realista, sirve los archivos con un servidor HTTP local.

Ejemplo (Python 3):
```bash
python -m http.server 8000
# luego abrir http://localhost:8000
```

## Cómo añadir/gestionar proyectos (demo)
1. Haz clic en **Gestionar proyectos**.
2. Usa el formulario para crear, editar o eliminar proyectos. Los cambios se guardan en `localStorage` del navegador.

## Deploy sugerido
- GitHub Pages: publica la rama `main` (o `gh-pages`) y habilita Pages en el repo.
- Netlify / Vercel: arrastra la carpeta o conecta el repo para deploy automático.

## Buenas prácticas
- Mantén cada proyecto en su propio repositorio cuando tenga entidad propia.
- Incluye README, demo (GitHub Pages / Vercel), screenshots y una lista de tecnologías.
- Usa nombres descriptivos para commits y ramas (p.ej. `feat/add-auth`, `fix/responsive-card`).

## Contacto
Puedes editar la sección de contacto en `index.html` para poner tu correo y enlaces a GitHub/LinkedIn.

---
Actualizado: 2026
