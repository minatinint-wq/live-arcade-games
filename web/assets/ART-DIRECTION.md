# Arte do LIVE Arcade — revisão 2

Criada em 27/10/2026 com geração de imagens integrada do Codex (`image_gen`), sem imagens, código ou capturas do Livecade. Ilustrações raster locais; nenhuma geração, API ou custo de imagem ocorre durante o jogo. O código permanece MIT. Os personagens GTA e seus direitos pertencem ao pacote separado do Hub, fora deste repositório.

## Direção e prompts de produção

Os prompts abaixo documentam a direção usada em cada geração. Todos solicitaram acabamento de arte de jogo, silhueta legível, iluminação coerente, sem palavras, marcas, números nem interfaces pintadas. Atlases solicitados com células regulares e margem interna, fundo transparente. Os quatro cenários foram solicitados verticais 9:16, com centro livre para peças e interfaces reais.

| Arquivo | Grade | Prompt / direção enviada |
| --- | --- | --- |
| actors-v2.png | 4 × 3 | Atlas de 12 personagens originais jovens adultos, corpo inteiro, fantasia e streetwear, ilustração 3D estilizada de qualidade de jogo, detalhes de roupa e cabelo, poses e silhuetas distintas; cada personagem inteiramente dentro da própria célula quadrada, margens regulares, sem texto. |
| host-v2.png | 3 × 2 | O mesmo apresentador guaxinim original com jaqueta laranja e fones em seis expressões: sorriso com mão aberta, risada, surpresa, vergonha/facepalm, vitória e ceticismo. Retrato até a cintura, anatomia e identidade consistentes, expressões naturais, sem texto. |
| objects-v2.png | 4 × 3 | Itens de jogo isolados: moedas cobre, prata e ouro; prensa industrial laranja; molduras colecionáveis comum prata, rara azul e épica roxo/dourado; impressora fotográfica; diário antigo aberto com páginas vazias; bola de cristal; boneco de treino e globo de discoteca. Mesma linguagem de render e luz, sem letras nas páginas ou molduras. |
| pieces-v2.png | 4 × 4 | Peças de jogo: dois tanques laterais azul/laranja, dois carros vistos de cima, dois cavalos de corrida com jóquei, monstro vermelho, slime azul, cabra, pássaro rosa, motosserra, cavaleiro azul, cavaleiro vermelho, mago dourado, zumbi verde e cabeça de cobra. Volumes bem definidos e materialidade de jogo, sem cenário nem texto. |
| arcade-v2.png | 4 × 4 | Props estilizados: maçã, laranja, melancia, bomba, porquinho alado, tronco modular, copa de árvore, janela, luva/pano de limpeza, cubos de grama, pedra e ouro, astronauta, meteoro, plataforma de madeira e portal. Separados, completos, sem sobreposição entre células, fundo transparente. |
| studio-v2.png | 1 | Estúdio mágico de game show, azul profundo e roxo, madeira e ouro, nichos com troféus e cristais nas laterais; palco central vazio, piso e profundidade, ilustração de ambiente de jogo vertical, sem personagem, texto ou interface. |
| arena-v2.png | 1 | Arena medieval de pedra vista de cima, piso central amplo e vazio, grama e muralhas nas bordas, detalhes bem acabados e contraste moderado para leitura das unidades, sem personagem ou interface. |
| quiz-v2.png | 1 | Estúdio de quiz vertical azul/navy, luz de palco, livros e globo discretos nas bordas, centro calmo e vazio para perguntas e respostas, sem texto pintado ou controles. |
| world-v2.png | 1 | Mundo de aventura com ilhas flutuantes, céu, vegetação e penhascos estilizados, composição vertical e centro livre para jogo, cores luminosas, sem personagens, texto ou controles. |

## Integração

`web/art.mjs` carrega nove imagens uma única vez por página e recorta os atlas no Canvas. `web/covers.mjs` compõe uma capa por jogo a partir dos mesmos elementos usados nas cenas. Títulos, respostas, nomes, placares e controles continuam sendo texto e geometria do aplicativo, para manter tradução, nitidez e interação. Os retratos são personagens fictícios, não fotos do espectador. O guaxinim usa painéis arredondados para suas expressões.

Os 57 módulos de regras continuam separados. Esta revisão substitui o tratamento visual compartilhado; não afirma que cada jogo ganhou um motor 3D ou animação esquelética. Animações do Canvas usam posição, escala, rotação e mudanças de expressão. O CJ não é alterado por esta revisão.
