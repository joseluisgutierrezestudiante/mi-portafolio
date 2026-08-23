# Guía breve: Organizar repositorios para un portafolio profesional

Esta guía resume buenas prácticas para que tus proyectos luzcan profesionales y sean fáciles de revisar por reclutadores o colaboradores.

1) Estructura del repositorio
   - `README.md` claro y conciso con: descripción, demo, cómo ejecutar, tecnologías y capturas (screenshots).
   - `LICENSE` (MIT es una opción común para proyectos personales).
   - `docs/` (opcional) para documentación adicional o casos de estudio.
   - `src/`, `public/` o estructura propia del framework que uses.

2) Nombres y descripciones
   - Nombre corto y descriptivo (p.ej. `todo-js`, `landing-responsive`).
   - Añade una breve descripción (1-2 líneas) en la cabecera del `README`.

3) Demo y screenshots
   - Incluye un enlace a la demo (GitHub Pages, Netlify, Vercel) y 2-3 imágenes en `assets/screenshots/`.
   - Si no hay deploy, incluye un GIF corto mostrando la interacción.

4) README template mínimo
   - Título
   - Descripción
   - Demo (enlace)
   - Tecnologías usadas
   - Cómo ejecutar localmente
   - Capturas / GIF
   - Estado (Ej: prototipo, terminado)

5) Branches y commits
   - Usa `main` o `master` para la versión estable.
   - Crea ramas de feature: `feat/<nombre>`, `fix/<issue>`.
   - Commits cortos y descriptivos: `feat: añadir formulario de login`.

6) Issues y Pull Requests
   - Usa issues para tareas y bugs aunque trabajes solo (ayuda a documentar decisiones).
   - Describe PRs brevemente: qué cambia y por qué.

7) Tests y CI (opcional)
   - Añade tests simples si aplica (p.ej. unitarios) y un workflow de CI que ejecute linters/tests.

8) Etiquetas y palabras clave
   - Usa `topics` en GitHub (p.ej. `javascript`, `portfolio`, `html-css`) para mejorar descubrimiento.

9) Documenta decisiones
   - En el `README` o `docs/` explica por qué elegiste la tecnología y qué aprendiste.

10) Presentación profesional
   - Mantén el código limpio y organizado.
   - Incluye `CONTRIBUTING.md` si quieres colaboraciones.

Con esto, tus repositorios serán claros, fáciles de probar y listos para mostrar a empleadores.
