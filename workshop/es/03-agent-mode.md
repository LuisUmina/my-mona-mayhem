<!-- l10n-sync: source-file="03-agent-mode.md" -->
# Parte 3: Agent Mode — Construir el Juego

---

Agent Mode permite a Copilot planificar e implementar cambios de forma autónoma en múltiples archivos. En lugar de escribir código línea por línea, describes lo que quieres y Copilot determina qué archivos crear o modificar, luego implementa todo de principio a fin.

## Tarea 1: Conecta la Batalla

1. Cambia a modo **Agent** en Copilot Chat (selecciona "Agent" en el menú desplegable de modo).

2. Ingresa este prompt:

   > Add client-side JavaScript to the battle page that:
   > 1. When the Battle button is clicked, gets both usernames from the inputs
   > 2. Validates both are filled (show error if not)
   > 3. Fetches both users' contribution data in parallel from our API
   > 4. Renders contribution graphs as colored grids — each day is a colored square using GitHub's color palette
   > 5. Shows a VS badge between the two users
   > 6. Displays username, total contributions, and date range for each user
   > 7. Handles loading states and errors
   > 8. Also triggers on Enter key in input fields.
   >
   > Use TypeScript interfaces for the contribution data structure.

3. Deja que Agent Mode trabaje en la implementación a través de `index.astro`. Observa cómo planifica su enfoque, identifica los archivos que necesita modificar y escribe el código.

4. Revisa los cambios propuestos en la vista de diferencias antes de aceptarlos.

## Tarea 2: Prueba la Batalla

1. Ingresa `octocat` y `torvalds` como los dos nombres de usuario, luego haz clic en **Battle**.
2. Deberías ver ambos gráficos de contribuciones renderizados lado a lado con cuadrículas de colores.
3. Prueba los casos de error:
   - Deja uno o ambos campos vacíos y haz clic en Battle — deberías ver un error de validación.
   - Ingresa un nombre de usuario inválido — la app debería mostrar un error de la API.
4. Prueba presionar **Enter** en cualquier campo de entrada — debería activar la batalla igual que al hacer clic en el botón.

## Tarea 3: Itera con Agent

Si algo no está del todo bien, dale retroalimentación a Agent directamente en el chat. Por ejemplo:

- *"The contribution squares are too large, make them 12x12px"*
- *"Add a hover tooltip showing the date and contribution count"*
- *"The loading state needs a pulse animation"*

Agent Mode maneja cambios en múltiples archivos e iteraciones de forma natural. Cada prompt de seguimiento se basa en el contexto previo, por lo que puedes refinar la implementación de forma incremental sin empezar de cero.

## Consejos para Agent Mode

- **Sé específico sobre lo que quieres** — requisitos claros producen mejores resultados.
- **Divide tareas grandes en prompts más pequeños** si Agent se desvía.
- **Revisa los cambios antes de aceptar** — usa la vista de diferencias para entender qué se modificó.
- **Si los resultados no son perfectos, da retroalimentación e itera** — Agent aprende de tus correcciones dentro de la conversación.

## ✅ Parte 3 Completa

Has aprendido a:

- Usar **Agent Mode** para implementaciones complejas en múltiples archivos
- **Iterar sobre los resultados** con retroalimentación dirigida
- Manejar el **ciclo de vida completo de una funcionalidad** — desde la implementación hasta las pruebas y el refinamiento — en una sola conversación
