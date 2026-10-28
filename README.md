# LIVE Arcade Games

Jogos interativos originais para transmissões, escritos em português. Cada
jogo tem seu próprio módulo e commit. O catálogo foi estudado a partir de
comportamento público; este projeto não contém código ou assets do Livecade.

O código é MIT. O selo Premium identifica a distribuição comercial no Hub,
sem restringir os direitos concedidos pela MIT sobre este código público.
Credenciais e a verificação de licenças do Hub ficam fora deste repositório.

## Rodar

Requer Node 24. Não é necessário instalar dependências.

```sh
npm start
```

Abra `http://127.0.0.1:4417`. Escolha um jogo, use os botões ou escreva um
comando/resposta. Trocar o nome de teste cria outro participante. A tela de
captura usa 9:16. `npm test` valida as regras, cenas e rotas HTTP.
`npm run audit:secrets` verifica arquivos rastreados e histórico Git.
Nenhuma chave de API é necessária e a demonstração não conecta uma live.

As versões daqui usam regras, ilustrações e bancos de palavras próprios.
Não são os jogos originais da plataforma de referência, nem reproduções exatas.
O apresentador e as brincadeiras de previsão usam respostas locais; não há
serviço de IA, análise facial ou geração paga de voz automática.

## Arte revisada (1.1.0)

As 57 capas e as seis famílias de cenas usam nove arquivos de arte local: personagens, objetos, peças e quatro cenários. Cartas, moedas, diário, impressora, apresentador e reações usam os mesmos elementos da capa durante a partida. A direção, os prompts e as grades estão em [web/assets/ART-DIRECTION.md](web/assets/ART-DIRECTION.md). Não há serviço de geração de imagem em tempo de execução.

## Escopo desta versão

São 57 jogos leves em Canvas: 8 disputas individuais, 9 de equipes,
9 desafios do jogador contra o chat, 19 jogos de palavras/quiz e 12
brincadeiras sociais. Os mundos de blocos e os portais usam projeção em Canvas;
não são o Roblox ou motores 3D completos. O mapa de cidades é esquemático.
O banco de questões é pequeno e editável. Não há dinheiro, prêmios ou apostas
reais. Os retratos usam personagens e iniciais criados por este projeto.

Cada módulo em `games/` implementa suas regras. `core/` reúne simulação,
eventos, limites e aleatoriedade reproduzível; `web/` desenha seis famílias de
cenas com tratamentos próprios por jogo. O servidor calcula o estado a 20 Hz
e envia snapshots a 10 Hz por SSE. A captura não envia controles.

## Integrar ao Hub

Importe `createGame` de `runtime.mjs`, chame `tick(0.05)` no servidor e envie
`snapshot()` ao renderizador. `interactiveInput` em `core/commands.mjs`
adapta comandos em português e ignora entradas de espectadores. Eventos usam
`kind`, `text`, `action`, `count`, `coins` e `viewer: {id, name}`.
Comentários e presentes de uma transmissão real precisam de um conector
separado. Este repositório não recebe nem guarda chaves desse conector.

As licenças comerciais assinadas, contas online, modelo/voz do CJ e demais
assets de terceiros do Hub não fazem parte deste repositório MIT.

## Interações

Todos os 57 jogos têm comandos em português. `!comandos` mostra a lista da
rodada. `dispatchInput` retorna um recibo com `accepted`, `action`, `message`
e `queued`; `interactiveInput` mantém a interface booleana anterior.

`interactionProfile(game)` em `core/bindings.mjs` descreve o efeito de cada
faixa de presente (1–9, 10–99, 100+ moedas), seguidores e curtidas. Cada
participante acumula 10 curtidas para disparar um apoio. Presentes usam
`count` como unidades novas, não o total acumulado de um combo: o conector
deve normalizar esse total e deduplicar a confirmação final antes do envio.
A fila recebe até 1.000 unidades, preserva apoios entre rodadas e processa
um por vez. Recursos têm os limites de cada jogo; quizzes limitam o tempo
extra a 60 segundos por rodada e pistas não enviam a resposta automaticamente.

A prévia aceita clique/toque e teclado: direções para a cobrinha, esquerda e
direita para lenhador/escada, espaço para saltar ou soltar a torre. Cartas e
blocos aceitam seleção individual; nos tabuleiros de letras, arraste a palavra.
A captura permanece somente para visualização. Nenhuma interação chama TTS.
