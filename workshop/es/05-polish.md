<!-- l10n-sync: source-file="workshop/05-polish.md" -->
# Parte 5: Pulido y Trabajo Paralelo

---

Ahora que la aplicación funciona y se ve genial, es hora de pulir. Esta parte trata sobre dividir el trabajo para que puedas mejorar la responsividad, el manejo de errores y la calidad sin hacer todo en un solo bucle serial.

<!-- track:vscode:start -->
## Tarea 1: Agente en Segundo Plano para Diseño Responsivo

1. En el panel de Chat, haz clic en **+** → **New background agent**.
2. Ingresa este prompt:

   ```
   Add responsive CSS media queries: at 1024px switch comparison to single column,
   at 768px reduce font sizes, stack inputs vertically, and make the layout
   mobile-friendly. Also improve keyboard accessibility — ensure tab order works,
   Enter triggers battle, and focus states are visible.
   ```

3. Déjalo ejecutarse de forma independiente — no necesitas observarlo.
4. Cuando termine, **Revisa** los cambios y haz clic en **Apply**.

## Tarea 2: Agente en Segundo Plano para UX de Errores

1. Inicia otro agente en segundo plano.
2. Ingresa este prompt:

   ```
   Improve the error experience: add a shake animation for errors, styled error
   messages with red (#ff3366) neon glow effects matching the arcade theme, and
   better input validation feedback. Show clear error messages when usernames are
   empty or invalid.
   ```

3. Revisa los cambios cuando el agente termine y haz clic en **Apply**.

## Tarea 3: Agente en la Nube para Variaciones (Opcional)

1. Haz clic en **+** → **New cloud agent**.
2. Ingresa este prompt:

   ```
   Create an alternative color theme for the battle page — keep the retro arcade
   style but use blue (#00f5ff) and orange (#ff6b35) instead of green and purple.
   Create it as a CSS custom property theme that could be toggled.
   ```

3. Revisa las **sesiones de agentes** para monitorear el progreso.
4. Revisa la variación de diseño en el PR que el agente en la nube crea.

## Tarea 4: Verifica Todo
<!-- track:vscode:end -->

<!-- track:cli:start -->
## Tarea 1: Divide el Trabajo con `/fleet`

En Copilot CLI, usa `/fleet` para dividir el trabajo entre subagentes paralelos, luego revisa el resultado combinado:

```text
/fleet Improve the app in parallel:
1. Add responsive CSS media queries so the comparison collapses to one column at 1024px and the inputs stack on small screens.
2. Improve keyboard accessibility and focus visibility.
3. Improve the error experience with stronger validation feedback and arcade-style neon error states.
```

Deja que el CLI orqueste el trabajo, luego inspecciona el resultado combinado con `/diff` antes de aprobar cualquier cosa.

## Tarea 2: Delega una Variación (Opcional)

Si quieres probar un flujo de trabajo asíncrono en la nube, delega una variación de diseño:

```text
/delegate Create an alternative color theme for the battle page that keeps the retro arcade look but swaps in blue (#00f5ff) and orange (#ff6b35). Make it easy to toggle.
```

Esa tarea delegada debería crear un pull request que puedes revisar por separado mientras sigues trabajando localmente.

## Tarea 3: Ejecuta una Revisión Agéntica

Antes de terminar, pide a Copilot CLI una pasada de revisión:

```text
/review Focus on potential bugs, accessibility issues, and UX regressions in the current branch.
```

Revisa los hallazgos, corrige lo que consideres necesario, luego ejecuta `/diff` nuevamente para tener claro qué cambió.

## Tarea 4: Verifica Todo
<!-- track:cli:end -->

> **⚠️ ¿No ves los cambios?** Si alguna de las actualizaciones de pulido no aparece, detén el servidor de desarrollo (`Ctrl+C`) y reinicia con `npm run dev`, luego haz una recarga forzada (`Ctrl+Shift+R`) en tu navegador.

Ejecuta estos escenarios de prueba para asegurarte de que todo funciona:

| Prueba | Resultado Esperado |
|--------|-------------------|
| Campos vacíos, clic en Battle | Error con estilo y animación de sacudida |
| Nombres de usuario válidos | Gráficos de contribuciones mostrados |
| Nombre de usuario inválido | Error de la API con estilo retro |
| Tecla Enter en el input | Activa la batalla |
| Ancho móvil | Diseño responsivo de una sola columna |
| Pasar el cursor sobre cuadros de contribución | Tooltip con fecha y cantidad |

Compila para producción y confirma que no hay errores:

```bash
npm run build && npm run preview
```

Una vez que todo se vea bien, haz commit de tu código funcional.

---

## ✅ ¡Parte 5 Completa!

**Lo que aprendiste:**

- Dividir el trabajo de pulido en **tareas paralelas más pequeñas**
- Revisar los cambios generados antes de fusionarlos en tu rama principal
- Usar Copilot para **pasadas de calidad y exploraciones opcionales**, no solo implementación
