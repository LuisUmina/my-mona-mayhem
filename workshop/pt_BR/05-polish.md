<!-- l10n-sync: source-file="workshop/05-polish.md" -->
# Parte 5: Polimento e Trabalho Paralelo

---

Agora que o aplicativo funciona e está com boa aparência, é hora de polir. Esta parte é sobre dividir o trabalho para que você possa melhorar a responsividade, o tratamento de erros e a qualidade sem fazer tudo em um único loop serial.

<!-- track:vscode:start -->
## Tarefa 1: Agente em Segundo Plano para Design Responsivo

1. No painel de Chat, clique em **+** → **New background agent**.
2. Digite este prompt:

   ```
   Add responsive CSS media queries: at 1024px switch comparison to single column,
   at 768px reduce font sizes, stack inputs vertically, and make the layout
   mobile-friendly. Also improve keyboard accessibility — ensure tab order works,
   Enter triggers battle, and focus states are visible.
   ```

3. Deixe-o executar de forma independente — você não precisa ficar observando.
4. Quando terminar, **Revise** as alterações e clique em **Apply**.

## Tarefa 2: Agente em Segundo Plano para UX de Erros

1. Inicie outro agente em segundo plano.
2. Digite este prompt:

   ```
   Improve the error experience: add a shake animation for errors, styled error
   messages with red (#ff3366) neon glow effects matching the arcade theme, and
   better input validation feedback. Show clear error messages when usernames are
   empty or invalid.
   ```

3. Revise as alterações quando o agente terminar e clique em **Apply**.

## Tarefa 3: Agente na Nuvem para Variações (Opcional)

1. Clique em **+** → **New cloud agent**.
2. Digite este prompt:

   ```
   Create an alternative color theme for the battle page — keep the retro arcade
   style but use blue (#00f5ff) and orange (#ff6b35) instead of green and purple.
   Create it as a CSS custom property theme that could be toggled.
   ```

3. Verifique as **sessões de agentes** para monitorar o progresso.
4. Revise a variação de design no PR que o agente na nuvem cria.

## Tarefa 4: Verifique Tudo
<!-- track:vscode:end -->

<!-- track:cli:start -->
## Tarefa 1: Divida o Trabalho com `/fleet`

No Copilot CLI, use `/fleet` para dividir o trabalho entre subagentes paralelos, depois revise o resultado combinado:

```text
/fleet Improve the app in parallel:
1. Add responsive CSS media queries so the comparison collapses to one column at 1024px and the inputs stack on small screens.
2. Improve keyboard accessibility and focus visibility.
3. Improve the error experience with stronger validation feedback and arcade-style neon error states.
```

Deixe o CLI orquestrar o trabalho, depois inspecione o resultado combinado com `/diff` antes de aprovar qualquer coisa.

## Tarefa 2: Delegue uma Variação (Opcional)

Se quiser experimentar um fluxo de trabalho assíncrono na nuvem, delegue uma variação de design:

```text
/delegate Create an alternative color theme for the battle page that keeps the retro arcade look but swaps in blue (#00f5ff) and orange (#ff6b35). Make it easy to toggle.
```

Essa tarefa delegada deve criar um pull request que você pode revisar separadamente enquanto continua trabalhando localmente.

## Tarefa 3: Execute uma Revisão Agêntica

Antes de encerrar, peça ao Copilot CLI uma passada de revisão:

```text
/review Focus on potential bugs, accessibility issues, and UX regressions in the current branch.
```

Revise as descobertas, corrija o que concordar, depois execute `/diff` novamente para ter clareza sobre o que mudou.

## Tarefa 4: Verifique Tudo
<!-- track:cli:end -->

> **⚠️ Não está vendo as mudanças?** Se alguma das atualizações de polimento não estiver aparecendo, pare o servidor de desenvolvimento (`Ctrl+C`) e reinicie com `npm run dev`, depois faça uma atualização forçada (`Ctrl+Shift+R`) no seu navegador.

Execute estes cenários de teste para garantir que tudo funciona:

| Teste | Resultado Esperado |
|-------|-------------------|
| Campos vazios, clicar em Battle | Erro estilizado com animação de tremor |
| Nomes de usuário válidos | Gráficos de contribuições exibidos |
| Nome de usuário inválido | Erro da API com estilo retro |
| Tecla Enter no input | Dispara a batalha |
| Largura móvel | Layout responsivo de coluna única |
| Passar o cursor sobre quadrados de contribuição | Tooltip com data e contagem |

Compile para produção e confirme que não há erros:

```bash
npm run build && npm run preview
```

Uma vez que tudo esteja bem, faça commit do seu código funcional.

---

## ✅ Parte 5 Completa!

**O que você aprendeu:**

- Dividir o trabalho de polimento em **tarefas paralelas menores**
- Revisar as alterações geradas antes de mesclá-las na sua branch principal
- Usar o Copilot para **passadas de qualidade e explorações opcionais**, não apenas implementação
