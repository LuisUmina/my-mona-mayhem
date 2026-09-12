<!-- l10n-sync: source-file="workshop/06-bonus.md" -->
# 🎉 Bônus e Extensões

---

Você construiu um aplicativo de GitHub Battle totalmente funcional! Agora é hora de ir além com **desafios abertos**.

<!-- track:vscode:start -->
Use **Agent Mode** para todos estes — descreva o que você quer e deixe o Copilot te ajudar a construir.
<!-- track:vscode:end -->

<!-- track:cli:start -->
Use o Copilot CLI para todos estes — combine contexto com `@file`, `/plan`, modo normal e `/review` conforme necessário.
<!-- track:cli:end -->

---

## 🏆 Desafio 1: Banner de Vencedor

Depois que ambos os gráficos de contribuições carregarem, compare os totais e exiba um anúncio dinâmico do vencedor.

**O que construir:**
- Compare as contribuições totais de ambos os usuários
- Mostre **"🏆 {username} WINS! 🏆"** com um estilo comemorativo se houver um vencedor claro
- Mostre **"🤝 IT'S A TIE! 🤝"** se as contribuições forem iguais
- Adicione animação ou confete para mais efeito

**Sugestão de prompt:**
> After both users' contribution data loads, compare total contributions and display a winner banner. Show "🏆 {username} WINS! 🏆" if one user has more contributions, or "🤝 IT'S A TIE! 🤝" if equal. Make it visually exciting with CSS animations.

---

## 🏆 Desafio 2: Contador de Sequência

Calcule e exiba a sequência de contribuições consecutivas mais longa de cada usuário.

**O que construir:**
- Analise os dados de contribuições dia a dia
- Encontre a série mais longa de dias consecutivos com pelo menos uma contribuição
- Exiba a contagem da sequência de forma proeminente para cada usuário
- Destaque quem tem a sequência mais longa

**Sugestão de prompt:**
> Add a streak counter feature that analyzes each user's contribution data to find their longest consecutive contribution streak. Display "🔥 Longest Streak: X days" for each user below their contribution graph.

---

## 🏆 Desafio 3: Histórico de Batalhas

Persista os resultados das batalhas para que os usuários possam ver seus confrontos anteriores.

**O que construir:**
- Salve cada resultado de batalha no `localStorage` (nomes de usuário, totais, vencedor, timestamp)
- Adicione uma seção **"Recent Battles"** abaixo da área principal de batalha
- Mostre as últimas 5–10 batalhas com resultados
- Adicione um botão "Clear History"

**Sugestão de prompt:**
> Save battle results to localStorage after each comparison. Add a "Recent Battles" section that displays the last 10 battles with usernames, contribution totals, the winner, and when the battle happened. Include a "Clear History" button.

---

## 🏆 Desafio 4: Efeitos Sonoros

Adicione efeitos sonoros retro arcade usando a Web Audio API — sem necessidade de arquivos externos.

**O que construir:**
- Som de **inserir moeda** quando o botão "Battle!" for clicado
- Som de **power up** quando os resultados carregarem com sucesso
- Som de **explosão** quando ocorrer um erro (usuário não encontrado, falha na API)
- Um botão de alternância para mutar/ativar som

**Sugestão de prompt:**
> Add retro arcade sound effects using the Web Audio API (no audio files). Play a coin insert sound on battle start, a power-up sound when results load, and an explosion sound on errors. Generate the sounds programmatically with oscillators and gain nodes. Include a mute toggle.

---

## 🏆 Desafio 5: Sequência de Batalha Animada

Crie suspense com uma contagem regressiva dramática antes de revelar os resultados.

**O que construir:**
- Quando "Battle!" for clicado, mostre uma sobreposição em tela cheia
- Anime: **"3..."** → **"2..."** → **"1..."** → **"⚡ FIGHT! ⚡"**
- Depois revele os gráficos de contribuições com uma entrada dramática
- Use animações CSS ou temporização com JavaScript

**Sugestão de prompt:**
> Add an animated battle sequence when the user clicks "Battle!". Show a countdown overlay: "3..." then "2..." then "1..." then "⚡ FIGHT! ⚡" with each step lasting about 1 second. After the countdown, reveal the results with a slide-in animation.

---

## 🏆 Desafio 6: Legenda de Contribuições

Adicione uma legenda de escala de cores que corresponda à paleta de cores do gráfico de contribuições.

**O que construir:**
- Uma legenda horizontal mostrando os níveis de intensidade de contribuições
- Rótulos de **"Less"** a **"More"**
- Use a paleta de cores real da resposta da API de contribuições do GitHub
- Posicione-a perto dos gráficos de contribuições

**Sugestão de prompt:**
> Add a contribution legend below the graphs showing the color scale from the API's color palette. Display a row of colored squares ranging from "Less" (lightest) to "More" (darkest), matching the actual contribution level colors returned by the API.

---

## 🏆 Desafio 7: Compartilhar Resultados

Permita que os usuários compartilhem seus resultados de batalha com um único clique.

**O que construir:**
- Um botão **"📋 Share Results"** que aparece após uma batalha
- Copia um resumo formatado em texto para a área de transferência
- Inclua nomes de usuário, totais de contribuições e o vencedor
- Mostre uma breve mensagem de confirmação "Copied!"

**Sugestão de prompt:**
> Add a "📋 Share Results" button that copies a formatted battle summary to the clipboard. The summary should include both usernames, their contribution totals, and who won. Use the Clipboard API and show a brief "Copied to clipboard!" confirmation.

---

<!-- track:cli:start -->
## 💻 Extras do CLI

Se quiser explorar mais funcionalidades do Copilot CLI após o workshop principal:

- Use `copilot -p "Write a conventional commit message for the current git diff"` para gerar uma resposta rápida de disparo único que pode colar no Git.
- Execute `/share file` para salvar sua sessão como Markdown para referência futura.
- Use `/session` e `/session plan` para inspecionar como o CLI está rastreando seu trabalho atual.
<!-- track:cli:end -->

## 🎊 Parabéns!

Você completou o workshop **Mona Mayhem: GitHub Battle**! Aqui está o que você realizou:

### O Que Você Construiu

- ✅ Um **aplicativo web completo de múltiplas páginas** a partir de uma especificação de design
- ✅ Uma **página inicial** com temática retro arcade e layout responsivo
- ✅ Uma **arena de batalha** que busca e compara dados reais de contribuições do GitHub
- ✅ **Gráficos de contribuições interativos** com níveis de atividade codificados por cores
- ✅ **Tratamento de erros, estados de carregamento e melhorias de acessibilidade**
- ✅ **Design responsivo** que funciona em todos os dispositivos

### O Que Você Praticou

| Habilidade | O Que Você Praticou |
|------------|---------------------|
| **Context Engineering** | Dar ao Copilot os arquivos, instruções e restrições corretas |
| **Planejamento** | Gerar e refinar planos de implementação antes de programar |
| **Codificação Agêntica** | Delegar trabalho em múltiplos arquivos e múltiplas etapas ao Copilot |
| **Iteração de Design** | Começar de uma direção visual e refinar até um resultado polido |
| **Disciplina de Revisão** | Inspecionar alterações geradas por IA antes de fazer commit |

### 🚀 Continue Avançando

- 📺 [Canal do YouTube do VS Code](https://www.youtube.com/@code) — Dicas, tutoriais e novidades
- 📖 [Documentação do GitHub Copilot](https://docs.github.com/en/copilot) — Documentação oficial e guias
- 💻 [Documentação do GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli) — Instalação, comandos slash e melhores práticas
- 🌟 [Awesome GitHub Copilot](https://github.com/stefanprodan/awesome-github-copilot) — Recursos e exemplos da comunidade
- 🛠️ [Workshops de Copilot Dev Days](https://github.com/github/copilot-dev-days) — Mais workshops práticos como este

---

## 🙏 Obrigado!

Obrigado por participar deste workshop! Você experimentou como o GitHub Copilot pode acelerar cada fase do desenvolvimento — do planejamento e design à implementação e polimento. As técnicas que você praticou aqui se aplicam a qualquer projeto, qualquer framework e qualquer escala. Agora vá e construa algo incrível! 🚀
