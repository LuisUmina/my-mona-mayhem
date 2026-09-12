<!-- l10n-sync: source-file="02-plan-and-scaffold.md" -->
# Parte 2: Planificar y Estructurar

---

Antes de escribir código, usemos **Plan Mode** para pensar en la arquitectura. Planificar primero te ayuda a diseñar mejores sistemas y le da a Copilot el contexto que necesita para generar código de mayor calidad.

## Tarea 1: Planifica la Arquitectura de la API

1. Cambia a modo **Plan** en Copilot Chat (haz clic en el selector de modo en la parte inferior del panel de chat)

2. Ingresa este prompt:

   ```
   I need to build a server-side API proxy that fetches GitHub contribution data
   for any username. The endpoint is https://github.com/{username}.contribs which
   returns JSON. We need to bypass CORS restrictions. Plan the implementation
   including the route structure, error handling, and caching strategy.
   ```

3. **Revisa el plan** — aquí es donde Plan Mode brilla. No aceptes la primera respuesta sin más:
   - Pide aclaraciones sobre cualquier cosa que no esté clara
   - Sugiere cambios si algo no te convence
   - Itera hasta que estés satisfecho con el enfoque

4. Una vez que estés conforme con el plan, pide a Copilot que lo implemente — cambia a modo **Agent** y dile que proceda

5. **Resultado:** Ahora deberías tener una ruta de API creada en:
   ```
   src/pages/api/contributions/[username].ts
   ```

## Tarea 2: Prueba la API

1. Asegúrate de que tu servidor de desarrollo esté en ejecución, luego prueba el endpoint:

   ```bash
   curl http://localhost:4321/api/contributions/octocat
   ```

2. Deberías ver datos de contribuciones en formato JSON

3. Prueba también el caso de error — intenta con un nombre de usuario inválido y confirma que devuelve una respuesta de error apropiada

## Tarea 3: Planifica la Página de Batalla

1. Mantente en modo **Plan** e ingresa este prompt:

   ```
   Now I need the main page. Plan a battle page for "Mona Mayhem - GitHub
   Contribution Battle Arena" with: two username inputs (Player 1 and Player 2),
   a battle button, and a results area. Use a dark theme with the Press Start 2P
   retro gaming font from Google Fonts. Plan the HTML structure, basic styling,
   and how the battle interaction will work.
   ```

2. **Revisa e itera** sobre el plan — haz preguntas, sugiere cambios, refina el enfoque

3. Cuando estés satisfecho, cambia a modo **Agent** y deja que Copilot construya la página

## Tarea 4: Verifica la Estructura

1. Abre http://localhost:4321 en tu navegador

2. Deberías ver:
   - El título del juego
   - Dos campos de entrada para nombres de usuario (Player 1 y Player 2)
   - Un botón de batalla

3. El botón aún no funcionará — ¡es esperado! No hemos conectado la lógica de JavaScript todavía. Eso viene después.

---

## ✅ ¡Parte 2 Completa!

Has aprendido a:

- **Usar Plan Mode** para diseñar la arquitectura antes de escribir código
- **Iterar sobre los planes** — hacer preguntas y refinar antes de implementar
- **Alternar entre Plan Mode y Agent Mode** para pasar del diseño a la implementación
