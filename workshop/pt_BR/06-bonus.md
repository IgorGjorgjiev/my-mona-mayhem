<!-- l10n-sync: source-file="workshop/06-bonus.md" -->
# 🎉 Bônus e extensões

---

Você criou um app de batalhas do GitHub totalmente funcional! Agora é hora de ir além com estes **desafios abertos**.

<!-- track:vscode:start -->
Use o **Agent Mode** em todos os desafios: descreva o que você quer e deixe o Copilot ajudar a criar.
<!-- track:vscode:end -->

<!-- track:cli:start -->
Use o Copilot CLI em todos os desafios: combine o contexto de `@file`, `/plan`, o modo normal e `/review` conforme necessário.
<!-- track:cli:end -->

---

## 🏆 Desafio 1: Anúncio do vencedor

Depois que os dois gráficos de contribuições carregarem, compare os totais e exiba um anúncio dinâmico do vencedor.

**O que criar:**
- Compare o total de contribuições dos dois usuários.
- Se houver um vencedor claro, exiba **“🏆 {username} VENCE! 🏆”** com um estilo comemorativo.
- Se as contribuições forem iguais, exiba **“🤝 EMPATE! 🤝”**.
- Adicione animação ou confete para dar mais destaque.

**Sugestão de prompt:**
> Depois que os dados de contribuições dos dois usuários forem carregados, compare os totais e exiba um anúncio do vencedor. Mostre “🏆 {username} VENCE! 🏆” se um usuário tiver mais contribuições, ou “🤝 EMPATE! 🤝” se os totais forem iguais. Deixe o visual empolgante com animações CSS.

---

## 🏆 Desafio 2: Contador de sequência

Calcule e exiba a maior sequência de contribuições consecutivas de cada usuário.

**O que criar:**
- Analise os dados de contribuições dia a dia.
- Encontre a sequência mais longa de dias consecutivos com pelo menos uma contribuição.
- Exiba com destaque a duração da sequência de cada usuário.
- Destaque quem tem a sequência mais longa.

**Sugestão de prompt:**
> Adicione um contador de sequência que analise os dados de contribuições de cada usuário e encontre sua maior sequência de contribuições consecutivas. Exiba “🔥 Maior sequência: X dias” abaixo do gráfico de contribuições de cada usuário.

---

## 🏆 Desafio 3: Histórico de batalhas

Persista os resultados das batalhas para que os usuários possam ver confrontos anteriores.

**O que criar:**
- Salve cada resultado de batalha no `localStorage` (nomes de usuário, totais, vencedor e data e hora).
- Adicione uma seção **“Batalhas recentes”** abaixo da área principal da batalha.
- Exiba as últimas 5–10 batalhas com os resultados.
- Adicione um botão “Limpar histórico”.

**Sugestão de prompt:**
> Salve os resultados de cada batalha no localStorage após cada comparação. Adicione uma seção “Batalhas recentes” que exiba as últimas 10 batalhas, com nomes de usuário, total de contribuições, vencedor e data e hora. Inclua um botão “Limpar histórico”.

---

## 🏆 Desafio 4: Efeitos sonoros

Adicione efeitos sonoros de fliperama retrô usando a Web Audio API — sem precisar de arquivos externos.

**O que criar:**
- Som de **moeda inserida** quando o botão “Battle!” for clicado.
- Som de **power-up** quando os resultados forem carregados com sucesso.
- Som de **explosão** quando ocorrer um erro (usuário não encontrado, falha na API).
- Um botão para alternar entre som ativado e mudo.

**Sugestão de prompt:**
> Adicione efeitos sonoros de fliperama retrô usando a Web Audio API, sem arquivos de áudio. Toque um som de moeda ao iniciar a batalha, um som de power-up quando os resultados forem carregados e um som de explosão quando ocorrer um erro. Gere os sons programaticamente com osciladores e nós de ganho. Inclua um botão para silenciar.

---

## 🏆 Desafio 5: Sequência de batalha animada

Crie suspense com uma contagem regressiva dramática antes de revelar os resultados.

**O que criar:**
- Quando “Battle!” for clicado, exiba uma sobreposição em tela cheia.
- Anime: **“3...” → “2...” → “1...” → “⚡ LUTEM! ⚡”**.
- Em seguida, revele os gráficos de contribuições com uma entrada dramática.
- Use animações CSS ou temporização em JavaScript.

**Sugestão de prompt:**
> Adicione uma sequência de batalha animada quando o usuário clicar em “Battle!”. Exiba uma sobreposição com a contagem regressiva: “3...”, “2...”, “1...” e “⚡ LUTEM! ⚡”, com cada etapa durando cerca de 1 segundo. Depois da contagem, revele os resultados com uma animação de entrada lateral.

---

## 🏆 Desafio 6: Legenda de contribuições

Adicione uma legenda de escala de cores que corresponda à paleta do gráfico de contribuições.

**O que criar:**
- Uma legenda horizontal com os níveis de intensidade das contribuições.
- Rótulos de **“Menos”** a **“Mais”**.
- Use a paleta real da resposta da API de contribuições do GitHub.
- Posicione a legenda perto dos gráficos de contribuições.

**Sugestão de prompt:**
> Adicione uma legenda de contribuições abaixo dos gráficos, mostrando a escala de cores da API. Exiba uma linha de quadrados coloridos, de “Menos” (tom mais claro) a “Mais” (tom mais escuro), correspondentes aos níveis de cor retornados pela API.

---

## 🏆 Desafio 7: Compartilhe os resultados

Permita que os usuários compartilhem os resultados da batalha com um só clique.

**O que criar:**
- Um botão **“📋 Compartilhar resultados”** que apareça após uma batalha.
- Copie um resumo formatado em texto para a área de transferência.
- Inclua os nomes de usuário, o total de contribuições e o vencedor.
- Exiba brevemente uma confirmação como “Copiado!”.

**Sugestão de prompt:**
> Adicione um botão “📋 Compartilhar resultados” que copie um resumo formatado da batalha para a área de transferência. O resumo deve incluir os dois nomes de usuário, os totais de contribuições e o vencedor. Use a Clipboard API e exiba brevemente a mensagem “Copiado para a área de transferência!”.

---

<!-- track:cli:start -->
## 💻 Extras da CLI

Se quiser explorar mais recursos do Copilot CLI depois do workshop principal:

- Use `copilot -p "Write a conventional commit message for the current git diff"` para gerar uma resposta única que você pode colar no Git.
- Execute `/share file` para salvar sua sessão em Markdown e consultar depois.
- Use `/session` e `/session plan` para inspecionar como a CLI está acompanhando seu trabalho atual.
<!-- track:cli:end -->

## 🎊 Parabéns!

Você concluiu o workshop **Mona Mayhem: GitHub Battle**. Veja o que você realizou:

### O que você criou

- ✅ Um **aplicativo web completo com várias páginas** a partir de uma especificação de design
- ✅ Uma **página inicial** com tema de fliperama retrô e layout responsivo
- ✅ Uma **arena de batalha** que busca e compara dados reais de contribuições do GitHub
- ✅ **Gráficos de contribuições interativos** com níveis de atividade diferenciados por cores
- ✅ **Tratamento de erros, estados de carregamento e melhorias de acessibilidade**
- ✅ **Design responsivo** para diferentes dispositivos

### O que você praticou

| Habilidade | O que você praticou |
|---|---|
| **Engenharia de contexto** | Fornecer ao Copilot os arquivos, as instruções e as restrições adequadas |
| **Planejamento** | Gerar e refinar planos de implementação antes de programar |
| **Programação agêntica** | Delegar ao Copilot trabalho em várias etapas e arquivos |
| **Iteração de design** | Partir de uma direção visual e refiná-la até chegar a um resultado polido |
| **Disciplina de revisão** | Inspecionar alterações geradas por IA antes de fazer commit |

### 🚀 Continue aprendendo

- 📺 [Canal do YouTube do VS Code](https://www.youtube.com/@code) — Dicas, tutoriais e novidades
- 📖 [Documentação do GitHub Copilot](https://docs.github.com/en/copilot) — Documentação e guias oficiais
- 💻 [Documentação do GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli) — Instalação, comandos slash e práticas recomendadas
- 🌟 [Awesome GitHub Copilot](https://github.com/stefanprodan/awesome-github-copilot) — Recursos e exemplos da comunidade
- 🛠️ [Workshops do Copilot Dev Days](https://github.com/github/copilot-dev-days) — Mais workshops práticos

---

## 🙏 Obrigado!

Obrigado por participar deste workshop! Você viu como o GitHub Copilot pode acelerar todas as etapas do desenvolvimento — do planejamento e design à implementação e ao polimento. As técnicas praticadas aqui servem para qualquer projeto, framework e escala. Agora vá criar algo incrível! 🚀
