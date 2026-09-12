<!-- l10n-sync: source-file="02-plan-and-scaffold.md" -->
# Parte 2: Planejamento e Scaffold

---

Antes de escrever qualquer código, vamos usar o **Plan Mode** para pensar na arquitetura. Planejar primeiro ajuda a projetar sistemas melhores e dá ao Copilot o contexto necessário para gerar código de maior qualidade.

## Tarefa 1: Planeje a Arquitetura da API

1. Mude para o modo **Plan** no Copilot Chat (clique no seletor de modo na parte inferior do painel do chat)

2. Insira este prompt:

   ```
   I need to build a server-side API proxy that fetches GitHub contribution data
   for any username. The endpoint is https://github.com/{username}.contribs which
   returns JSON. We need to bypass CORS restrictions. Plan the implementation
   including the route structure, error handling, and caching strategy.
   ```

3. **Revise o plano** — é aqui que o Plan Mode brilha. Não aceite a primeira resposta sem pensar:
   - Peça esclarecimentos sobre qualquer coisa que não esteja clara
   - Sugira mudanças se algo não parecer correto
   - Itere até estar satisfeito com a abordagem

4. Quando estiver satisfeito com o plano, peça ao Copilot para implementá-lo — mude para o modo **Agent** e diga para ele prosseguir

5. **Resultado:** Agora você deve ter uma rota de API criada em:
   ```
   src/pages/api/contributions/[username].ts
   ```

## Tarefa 2: Teste a API

1. Certifique-se de que o servidor de desenvolvimento está rodando e teste o endpoint:

   ```bash
   curl http://localhost:4321/api/contributions/octocat
   ```

2. Você deve ver um JSON com os dados de contribuições retornados

3. Teste o caso de erro também — tente um nome de usuário inválido e confirme que retorna uma resposta de erro apropriada

## Tarefa 3: Planeje a Página de Batalha

1. Continue no modo **Plan** e insira este prompt:

   ```
   Now I need the main page. Plan a battle page for "Mona Mayhem - GitHub
   Contribution Battle Arena" with: two username inputs (Player 1 and Player 2),
   a battle button, and a results area. Use a dark theme with the Press Start 2P
   retro gaming font from Google Fonts. Plan the HTML structure, basic styling,
   and how the battle interaction will work.
   ```

2. **Revise e itere** no plano — faça perguntas, sugira mudanças, refine a abordagem

3. Quando estiver satisfeito, mude para o modo **Agent** e deixe o Copilot construir a página

## Tarefa 4: Verifique o Scaffold

1. Abra http://localhost:4321 no seu navegador

2. Você deve ver:
   - O título do jogo
   - Dois campos de entrada de nome de usuário (Player 1 e Player 2)
   - Um botão de batalha

3. O botão ainda não vai funcionar — isso é esperado! Ainda não conectamos a lógica JavaScript. Isso vem a seguir.

---

## ✅ Parte 2 Concluída!

Você aprendeu a:

- **Usar o Plan Mode** para projetar a arquitetura antes de escrever código
- **Iterar nos planos** — fazer perguntas e refinar antes de implementar
- **Alternar entre Plan e Agent Mode** para ir do design à implementação
