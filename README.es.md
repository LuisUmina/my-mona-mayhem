<!-- l10n-sync: source-file="README.md" -->
# 🎮 Mona Mayhem

**Taller VS Code GitHub Copilot** — Construye una Arena de Batalla de Contribuciones GitHub

Aplicación Astro de estilo arcade para comparar las contribuciones GitHub de dos usuarios. Incluye API, totales, ganador o empate y calendarios diarios interactivos, con diseño adaptable, navegación por teclado y movimiento reducido. Consulta el [funcionamiento de la comparación](docs/battle.md) y el [contrato de la API](docs/api-contributions.md).

![Mona Mayhem Screenshot](https://github.com/user-attachments/assets/5eca79e2-cb9f-4e93-aa0d-23666ebde3b7)

## 📚 Taller

| Parte | Título | Característica de Copilot |
|-------|--------|--------------------------|
| [00](workshop/es/00-overview.md) | Visión General | Lo que aprenderás |
| [01](workshop/es/01-setup.md) | Configuración e Ingeniería de Contexto | Instrucciones de workspace, background agents |
| [02](workshop/es/02-plan-and-scaffold.md) | Planificar y Estructurar | Plan Mode |
| [03](workshop/es/03-agent-mode.md) | Agent Mode: Construir el Juego | Agent Mode |
| [04](workshop/es/04-design-vibes.md) | Temas Design-First | Plan + Agent Mode |
| [05](workshop/es/05-polish.md) | Pulido & Multi-Agent | Background & cloud agents |
| [06](workshop/es/06-bonus.md) | Bonus y Extensiones | Desafíos abiertos |

## 🚀 Inicio Rápido

1. **Usa esta plantilla** → Crea un nuevo repositorio
2. Clona y abre en VS Code
3. Instala las dependencias con `npm ci` e inicia la aplicación con `npm run dev`
4. Sigue la [guía del taller](workshop/es/00-overview.md)

## Requisitos Previos

- VS Code v1.107+
- GitHub Copilot (Pro, Business o Enterprise)
- Node.js >=22.12.0
- Git

Se requiere npm >=9.6.5. `.nvmrc` fija la versión mínima de Node compatible.

## Verificación y portal del taller

```sh
npm ci
npm run verify
```

`npm run verify` ejecuta las pruebas unitarias, comprueba los tipos TypeScript y Astro, compila la aplicación, prueba el flujo del formulario con la API local y genera el portal. `npm run build` comprueba automáticamente los tipos antes de compilar. Consulta [verificación y CI](docs/verification.md) para ver los comandos y el alcance de las pruebas. `npm run dev` permite comparar dos usuarios en http://localhost:4321. La aplicación y su API requieren el servidor Astro Node; GitHub Pages publica la guía del taller.

`npm run docs:build` genera `_site/` con el portal y las lecciones en los tres idiomas. Sirve esa carpeta con un servidor HTTP estático para previsualizar el despliegue. Si sirves la raíz del repositorio en localhost, también puedes abrir `/docs/` para leer las lecciones de `/workshop/`.

El portal usa por defecto el contenido incluido en el despliegue, por lo que cada fork muestra sus propias lecciones. Para cambiar el origen, configura `contentBase` en `docs/workshop-config.js`: debe apuntar a un directorio con los Markdown en inglés y las subcarpetas `es/` y `pt_BR/`. Las rutas relativas parten de la raíz del portal; un origen externo debe permitir CORS. El valor `null` usa el contenido incluido.

El workflow de GitHub Pages instala dependencias, ejecuta las pruebas y compila Astro para validar el proyecto. Publica únicamente `_site/`; la aplicación de servidor requiere un alojamiento Node.

## Stack Tecnológico

- **Framework**: [Astro](https://astro.build/) v6
- **Runtime**: Node.js con adaptador [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/)
- **Fuente**: Press Start 2P (fuente de juegos retro)
- **API**: API de gráfico de contribuciones de GitHub

## Licencia

MIT
