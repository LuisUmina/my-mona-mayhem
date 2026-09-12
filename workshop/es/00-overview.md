<!-- l10n-sync: source-file="workshop/00-overview.md" -->
# 🎮 Mona Mayhem — Taller de GitHub Copilot

---

> **Duración:** ~1 hora  
> **Nivel:** Intermedio  
> **Stack:** Astro / Node.js / TypeScript

Construye una aplicación retro estilo arcade para comparar contribuciones de GitHub — **Mona Mayhem** — mientras aprendes todo el espectro de flujos de trabajo de GitHub Copilot. El taller soporta **dos pistas**: una experiencia en VS Code y una experiencia con GitHub Copilot CLI.

---

## 🎯 Elige Tu Pista

- **Pista VS Code** — quédate en el editor y practica Chat, Plan Mode, Agent Mode, agentes en segundo plano y el ciclo de revisión integrado.
- **Pista CLI** — quédate en la terminal y practica `copilot`, contexto con `@file`, `/plan`, ediciones autónomas, `/fleet`, `/delegate` y `/review`.

Sigue la pista que coincida con tu flujo de trabajo preferido.

---

## 📋 Lista de Verificación Rápida

Antes de empezar, verifica:

- [ ] GitHub Copilot está habilitado para tu cuenta
- [ ] Node.js instalado
- [ ] Git instalado y configurado
- [ ] Tu navegador y terminal están listos

<!-- track:vscode:start -->
- [ ] VS Code **v1.107+** (sin actualizaciones pendientes)
- [ ] Sesión iniciada en la extensión de **GitHub Copilot**
- [ ] Panel de Chat abierto y Agent listo
<!-- track:vscode:end -->

<!-- track:cli:start -->
- [ ] GitHub Copilot CLI instalado y disponible como `copilot`
- [ ] Autenticado en el CLI con `/login`
- [ ] Cómodo usando comandos slash como `/help`, `/plan` y `/review`
<!-- track:cli:end -->

> 💡 **Consejo:** Usa el DevContainer para un entorno preconfigurado si deseas un inicio rápido en VS Code.

---

## 🧠 Lo Que Aprenderás

| # | Habilidad | Descripción |
|---|-----------|-------------|
| 1 | **Context Engineering** | Enseña a Copilot sobre tu código base con instrucciones, referencias y restricciones claras |
| 2 | **Planificar Primero** | Diseña la arquitectura antes de la implementación |
| 3 | **Implementación Agéntica** | Deja que Copilot realice trabajo de codificación en múltiples pasos con tu supervisión |
| 4 | **Diseño Iterativo** | Usa Copilot para transformar visuales y refinar detalles de interacción |
| 5 | **Flujos de Trabajo Paralelos** | Divide el trabajo entre agentes, sesiones o tareas delegadas |

<!-- track:vscode:start -->
### Enfoque de Funcionalidades de VS Code

- **Chat + modo Ask** para exploración
- **Plan Mode** para prompts de arquitectura y diseño
- **Agent Mode** para implementación en múltiples archivos
- **Agentes en segundo plano y en la nube** para pulido en paralelo
<!-- track:vscode:end -->

<!-- track:cli:start -->
### Enfoque de Funcionalidades de Copilot CLI

- **Sesiones interactivas del CLI** con `copilot`
- **`/plan` y Shift+Tab** para planificación estructurada
- **Ediciones autónomas** con aprobaciones en línea y `/diff`
- **`/fleet`, `/delegate` y `/review`** para paralelismo y controles de calidad
<!-- track:cli:end -->

---

## 📚 Partes del Laboratorio

| Parte | Título | Descripción |
|-------|--------|-------------|
| [**01**](01-setup.md) | Configuración y Context Engineering | Crea tu repositorio, prepara tu entorno y dale a Copilot el contexto adecuado |
| [**02**](02-plan-and-scaffold.md) | Planificar y Estructurar | Diseña la API y la arquitectura de páginas antes de implementar |
| [**03**](03-agent-mode.md) | Construir el Juego | Conecta la página de batalla y los gráficos de contribuciones con ayuda agéntica |
| [**04**](04-design-vibes.md) | Diseño Visual Primero | Transforma la estructura base en una experiencia retro arcade |
| [**05**](05-polish.md) | Pulido y Trabajo Paralelo | Usa flujos de trabajo multi-agente para mejorar UX, resiliencia y calidad |
| [**06**](06-bonus.md) | Bonus y Extensiones | Explora funcionalidades abiertas, flujos de trabajo de compartición y experimentos extra |

---

## 💡 Consejos Pro

1. **Mantén el navegador abierto** — observa las actualizaciones en vivo mientras programas.
2. **Haz commits frecuentes** — guarda puntos de control limpios mientras iteras.
3. **Refina el plan antes de implementar** — mejores planes llevan a mejores resultados.
4. **Revisa los cambios de Copilot** — usa la vista de diferencias o las herramientas de revisión del CLI en lugar de aceptar a ciegas.

<!-- track:vscode:start -->
5. **Usa puntos de control y Deshacer** en el chat si una iteración se desvía.
<!-- track:vscode:end -->

<!-- track:cli:start -->
5. **Usa `/session`, `/context` y `/share file`** cuando quieras inspeccionar o preservar tu trabajo.
<!-- track:cli:end -->
