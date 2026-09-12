<!-- l10n-sync: source-file="workshop/01-setup.md" -->
# Parte 1: Configuración y Context Engineering

---

En esta parte configurarás tu entorno de desarrollo **y** enseñarás a Copilot sobre el código base — para que cada prompt futuro comience con el contexto adecuado.

## Sección 1: Configuración Inicial

### Paso 1: Crea Tu Repositorio

1. Abre [github.com/copilot-dev-days/mona-mayhem](https://github.com/copilot-dev-days/mona-mayhem)
2. Crea tu propio repositorio mediante una de estas opciones:
   - haciendo clic en **Use this template** → **Create a new repository**, o
   - haciendo un fork del repositorio.
3. Nómbralo `my-mona-mayhem` y establece la visibilidad como **Public** (si lo creaste desde la plantilla)

<!-- track:vscode:start -->
### Paso 2: Elige Tu Entorno de Desarrollo

#### Opción A: VS Code Local

1. Abre VS Code y ejecuta **Git: Clone** → **Clone from GitHub**
2. Selecciona tu repositorio `my-mona-mayhem`
3. Cuando se te solicite, instala las **extensiones recomendadas**

#### Opción B: GitHub Codespaces

1. Abre tu repositorio en GitHub
2. Haz clic en **Code** → **Codespaces** → **Create codespace on main**
3. Espera a que el entorno inicie y las dependencias se instalen

### Paso 3: Instala las Dependencias e Inicia la Aplicación

1. Abre la terminal integrada en tu repositorio.
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia la aplicación:

   ```bash
   npm run dev
   ```

> ✅ **¡La aplicación está ejecutándose en tu navegador!**
<!-- track:vscode:end -->

<!-- track:cli:start -->
### Paso 2: Instala GitHub Copilot CLI

Usa la ruta de instalación que corresponda a tu máquina:

- **npm (multiplataforma, requiere Node.js 22+)**

  ```bash
  npm install -g @github/copilot
  ```

- **Homebrew (macOS/Linux)**

  ```bash
  brew install copilot-cli
  ```

- **WinGet (Windows)**

  ```bash
  winget install GitHub.Copilot
  ```

### Paso 3: Inicia la Aplicación y Autentica el CLI

1. Clona tu repositorio localmente y abre una terminal en la raíz del proyecto.
2. Instala las dependencias e inicia la aplicación:

   ```bash
   npm install
   npm run dev
   ```

3. Abre una **segunda terminal** en el mismo repositorio e inicia Copilot CLI:

   ```bash
   copilot
   ```

4. En la sesión interactiva, ingresa:

   ```
   /login
   ```

5. Sigue las indicaciones del flujo de autenticación del dispositivo, luego confirma que confías en el repositorio cuando el CLI solicite aprobación.

> ✅ **Ahora tienes la vista previa de la aplicación en una terminal y Copilot CLI listo en otra.**
<!-- track:cli:end -->

## Sección 2: Context Engineering

Context Engineering es cómo enseñas a la IA sobre tu código base. Cuanto mejor sea el contexto, mejor será cada respuesta futura.

<!-- track:vscode:start -->
### Tarea 1: Genera Instrucciones del Workspace con /init

Usemos el comando integrado `/init` para generar un archivo de instrucciones del workspace para Copilot:

1. Abre **Copilot Chat** y escribe:

   ```
   /init simple instructions with a project overview, build/dev commands, and Astro best practices, (ignore the workshop).
   ```

2. Revisa el archivo generado — Copilot analizará tu proyecto y creará un `.github/copilot-instructions.md`.
3. Acepta los cambios, luego **haz commit** del archivo de instrucciones.

> **Resultado:** Todas las futuras solicitudes a Copilot ahora tienen un mapa de tu workspace incorporado.

### Tarea 2: Agentes en Segundo Plano

**Agente en segundo plano local:**

1. En el panel de Chat, haz clic en **+** → **New background agent**
2. Ingresa el prompt:

   > "Add linting rules for unused vars and improve code style; fix any errors"

3. Cuando termine, **Revisa y Aplica** los cambios, luego elimina la sesión.

**Agente en la nube:**

1. Inicia otro agente en segundo plano con:

   > "Make the README more engaging as a landing page"

> **Resultado:** Reglas de linting agregadas, errores corregidos, README mejorado — todo sin salir de tu editor.

### Tarea 3: Explora el Proyecto

Abre **Copilot Chat** en **modo Ask** y prueba estos prompts:

- `"Explain the architecture of this project"`
- `"What files are in the src directory and what do they do?"`
- `"What would I need to build to make the Battle button work?"`

> 💡 Usa **@workspace** para darle a Copilot contexto de todo el proyecto para respuestas más precisas.
<!-- track:vscode:end -->

<!-- track:cli:start -->
### Tarea 1: Genera Instrucciones del Repositorio con /init

Usemos `/init` para generar un archivo de instrucciones del workspace para Copilot:

1. En Copilot CLI, escribe:

   ```
   /init simple instructions with a project overview, build/dev commands, and Astro best practices, (ignore the workshop).
   ```

2. Revisa el archivo generado — Copilot analizará tu proyecto y creará un `.github/copilot-instructions.md`.
3. Haz commit del archivo de instrucciones.

> **Resultado:** Las sesiones futuras del CLI heredan automáticamente las instrucciones específicas del repositorio desde `.github/copilot-instructions.md`.

### Tarea 2: Configura Tu Entorno CLI

Practica los controles del CLI que facilitarán los pasos posteriores:

1. Ejecuta `/help` para revisar los comandos slash disponibles.
2. Usa `/model` para inspeccionar los modelos disponibles para ti.
3. Si Copilot ha aprendido demasiadas aprobaciones durante la experimentación, reinícialas con:

   ```
   /reset-allowed-tools
   ```

4. Si tu repositorio está dentro de un directorio padre más grande, usa `/add-dir PATH` para ampliar explícitamente el workspace permitido.

> 💡 La documentación del CLI recomienda instrucciones personalizadas concisas más permisos de herramientas explícitos para que Copilot se mantenga rápido y predecible.

### Tarea 3: Explora el Proyecto desde la Terminal

Prueba estos prompts dentro de Copilot CLI:

- `Give me an overview of this project.`
- `@src/pages/api/contributions/[username].ts What is this file for and what needs to be built here?`
- `@src/pages/index.astro What exists here and what would I need to add to build the battle page?`

Si quieres una respuesta rápida de un solo disparo fuera de la sesión interactiva, prueba:

```bash
copilot -p "Summarize the architecture of this repo in 5 bullet points"
```

> **Resultado:** Ahora tienes instrucciones, conocimiento de comandos y una idea de cómo alimentar archivos al contexto de Copilot CLI.
<!-- track:cli:end -->

## ✅ Parte 1 Completa

Has aprendido cómo:

- **Configurar** el repositorio y el entorno de desarrollo local
- **Generar instrucciones** con `/init` para que Copilot entienda tu proyecto y la dirección de diseño
- **Establecer un hábito de revisión** antes de aplicar cambios generados
- **Explorar el código base** con prompts ricos en contexto
