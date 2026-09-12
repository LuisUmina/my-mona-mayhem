<!-- l10n-sync: source-file="workshop/06-bonus.md" -->
# 🎉 Bonus y Extensiones

---

¡Has construido una aplicación de GitHub Battle completamente funcional! Ahora es momento de ir más allá con **desafíos abiertos**.

<!-- track:vscode:start -->
Usa **Agent Mode** para todos estos — describe lo que quieres y deja que Copilot te ayude a construirlo.
<!-- track:vscode:end -->

<!-- track:cli:start -->
Usa Copilot CLI para todos estos — combina contexto con `@file`, `/plan`, modo normal y `/review` según sea necesario.
<!-- track:cli:end -->

---

## 🏆 Desafío 1: Banner de Ganador

Después de que ambos gráficos de contribuciones carguen, compara los totales y muestra un anuncio dinámico del ganador.

**Qué construir:**
- Compara las contribuciones totales de ambos usuarios
- Muestra **"🏆 {username} WINS! 🏆"** con un estilo de celebración si hay un ganador claro
- Muestra **"🤝 IT'S A TIE! 🤝"** si las contribuciones son iguales
- Agrega animación o confeti para más efecto

**Sugerencia de prompt:**
> After both users' contribution data loads, compare total contributions and display a winner banner. Show "🏆 {username} WINS! 🏆" if one user has more contributions, or "🤝 IT'S A TIE! 🤝" if equal. Make it visually exciting with CSS animations.

---

## 🏆 Desafío 2: Contador de Racha

Calcula y muestra la racha de contribuciones consecutivas más larga de cada usuario.

**Qué construir:**
- Analiza los datos de contribuciones día por día
- Encuentra la serie más larga de días consecutivos con al menos una contribución
- Muestra el conteo de la racha de forma prominente para cada usuario
- Resalta quién tiene la racha más larga

**Sugerencia de prompt:**
> Add a streak counter feature that analyzes each user's contribution data to find their longest consecutive contribution streak. Display "🔥 Longest Streak: X days" for each user below their contribution graph.

---

## 🏆 Desafío 3: Historial de Batallas

Persiste los resultados de las batallas para que los usuarios puedan ver sus enfrentamientos anteriores.

**Qué construir:**
- Guarda cada resultado de batalla en `localStorage` (nombres de usuario, totales, ganador, marca de tiempo)
- Agrega una sección **"Recent Battles"** debajo del área principal de batalla
- Muestra las últimas 5–10 batallas con resultados
- Agrega un botón "Clear History"

**Sugerencia de prompt:**
> Save battle results to localStorage after each comparison. Add a "Recent Battles" section that displays the last 10 battles with usernames, contribution totals, the winner, and when the battle happened. Include a "Clear History" button.

---

## 🏆 Desafío 4: Efectos de Sonido

Agrega efectos de sonido retro arcade usando la Web Audio API — sin necesidad de archivos externos.

**Qué construir:**
- Sonido de **insertar moneda** cuando se hace clic en el botón "Battle!"
- Sonido de **power up** cuando los resultados cargan exitosamente
- Sonido de **explosión** cuando ocurre un error (usuario no encontrado, fallo de API)
- Un botón de alternancia para silenciar/activar sonido

**Sugerencia de prompt:**
> Add retro arcade sound effects using the Web Audio API (no audio files). Play a coin insert sound on battle start, a power-up sound when results load, and an explosion sound on errors. Generate the sounds programmatically with oscillators and gain nodes. Include a mute toggle.

---

## 🏆 Desafío 5: Secuencia de Batalla Animada

Crea suspenso con una cuenta regresiva dramática antes de revelar los resultados.

**Qué construir:**
- Cuando se haga clic en "Battle!", muestra una superposición a pantalla completa
- Anima: **"3..."** → **"2..."** → **"1..."** → **"⚡ FIGHT! ⚡"**
- Luego revela los gráficos de contribuciones con una entrada dramática
- Usa animaciones CSS o temporización con JavaScript

**Sugerencia de prompt:**
> Add an animated battle sequence when the user clicks "Battle!". Show a countdown overlay: "3..." then "2..." then "1..." then "⚡ FIGHT! ⚡" with each step lasting about 1 second. After the countdown, reveal the results with a slide-in animation.

---

## 🏆 Desafío 6: Leyenda de Contribuciones

Agrega una leyenda de escala de colores que coincida con la paleta de colores del gráfico de contribuciones.

**Qué construir:**
- Una leyenda horizontal mostrando los niveles de intensidad de contribuciones
- Etiquetas desde **"Less"** hasta **"More"**
- Usa la paleta de colores real de la respuesta de la API de contribuciones de GitHub
- Posiciónala cerca de los gráficos de contribuciones

**Sugerencia de prompt:**
> Add a contribution legend below the graphs showing the color scale from the API's color palette. Display a row of colored squares ranging from "Less" (lightest) to "More" (darkest), matching the actual contribution level colors returned by the API.

---

## 🏆 Desafío 7: Compartir Resultados

Permite que los usuarios compartan sus resultados de batalla con un solo clic.

**Qué construir:**
- Un botón **"📋 Share Results"** que aparece después de una batalla
- Copia un resumen de texto formateado al portapapeles
- Incluye nombres de usuario, totales de contribuciones y el ganador
- Muestra un breve mensaje de confirmación "Copied!"

**Sugerencia de prompt:**
> Add a "📋 Share Results" button that copies a formatted battle summary to the clipboard. The summary should include both usernames, their contribution totals, and who won. Use the Clipboard API and show a brief "Copied to clipboard!" confirmation.

---

<!-- track:cli:start -->
## 💻 Extras del CLI

Si quieres explorar más funcionalidades de Copilot CLI después del taller principal:

- Usa `copilot -p "Write a conventional commit message for the current git diff"` para generar una respuesta rápida de un solo disparo que puedes pegar en Git.
- Ejecuta `/share file` para guardar tu sesión como Markdown para referencia futura.
- Usa `/session` y `/session plan` para inspeccionar cómo el CLI está rastreando tu trabajo actual.
<!-- track:cli:end -->

## �� ¡Felicitaciones!

¡Has completado el taller **Mona Mayhem: GitHub Battle**! Esto es lo que lograste:

### Lo Que Construiste

- ✅ Una **aplicación web completa de múltiples páginas** a partir de una especificación de diseño
- ✅ Una **página de inicio** con temática retro arcade y diseño responsivo
- ✅ Una **arena de batalla** que obtiene y compara datos reales de contribuciones de GitHub
- ✅ **Gráficos de contribuciones interactivos** con niveles de actividad codificados por colores
- ✅ **Manejo de errores, estados de carga y mejoras de accesibilidad**
- ✅ **Diseño responsivo** que funciona en todos los dispositivos

### Lo Que Practicaste

| Habilidad | Lo Que Practicaste |
|-----------|-------------------|
| **Context Engineering** | Darle a Copilot los archivos, instrucciones y restricciones correctas |
| **Planificación** | Generar y refinar planes de implementación antes de programar |
| **Codificación Agéntica** | Delegar trabajo en múltiples archivos y múltiples pasos a Copilot |
| **Iteración de Diseño** | Comenzar desde una dirección visual y refinar hacia un resultado pulido |
| **Disciplina de Revisión** | Inspeccionar cambios generados por IA antes de hacer commit |

### 🚀 Sigue Adelante

- 📺 [Canal de YouTube de VS Code](https://www.youtube.com/@code) — Tips, tutoriales y novedades
- 📖 [Documentación de GitHub Copilot](https://docs.github.com/en/copilot) — Documentación oficial y guías
- 💻 [Documentación de GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli) — Instalación, comandos slash y mejores prácticas
- 🌟 [Awesome GitHub Copilot](https://github.com/stefanprodan/awesome-github-copilot) — Recursos y ejemplos de la comunidad
- 🛠️ [Talleres de Copilot Dev Days](https://github.com/github/copilot-dev-days) — Más talleres prácticos como este

---

## 🙏 ¡Gracias!

¡Gracias por unirte a este taller! Has experimentado cómo GitHub Copilot puede acelerar cada fase del desarrollo — desde la planificación y el diseño hasta la implementación y el pulido. Las técnicas que practicaste aquí se aplican a cualquier proyecto, cualquier framework y cualquier escala. ¡Ahora ve y construye algo increíble! 🚀
