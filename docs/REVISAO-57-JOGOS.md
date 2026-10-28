# Revisão individual dos 57 jogos originais — 1.2.0

Revisão de comandos, limites, rodada e apresentação feita por três agentes, com revisão cruzada de código e inspeção das cenas no navegador. Os seis jogos recuperados do Hub foram verificados separadamente. Os 57 também foram abertos individualmente pelo servidor do Hub na auditoria integrada dos 63 jogos.

Correções compartilhadas: comando de equipe antes/depois da ação e feminino (`cabra pesada vermelha`), empate real ao expirar o tempo, finais sem vencedor com mensagem correta, recorte dos atlas sem vazamento de células, interpolação somente de objetos identificados e sem teletransportes, relógio contínuo, área de jogo limitada para proteger o HUD e banner de fim que não esconde os personagens.

Arte: 16 ambientes-base temáticos, tratamentos por jogo e sequências de poses para cabras, lutador e cavalo. Não são 57 cenários pintados individualmente. São jogos Canvas/sprites 2D; o CJ do Hub é uma cena 3D separada. Não houve conexão de live, geração de fala ou uso de credenciais reais na auditoria.


# Auditoria individual — 17 jogos de combate, equipes e corrida

Revisão de 27/10/2026. Escopo: oito jogos individuais e nove de equipes.
Não foi conectada live real, iniciada transmissão ou gerada voz nesta auditoria.

## Método e evidência

- `test/combat-v3.test.mjs`: 18 testes direcionados, todos passando; há um teste identificado para cada um dos 17 jogos e um segundo teste de equilíbrio das cabras.
- `artifacts/combat-v3-specific.log`: resultado dos testes direcionados.
- `artifacts/combat-v3-tests.log`: suíte completa com 209/209 testes passando no checkpoint final, incluindo trabalho paralelo dos outros agentes. O integrador executa novamente após consolidar.
- Servidor de demonstração isolado em `http://127.0.0.1:4463`, executando o código local sem contas reais. Os 17 jogos foram abertos e seus Canvas 9:16 inspecionados individualmente no IAB. Capturas de conferência durante as iterações em `artifacts/combat-v3-screens/<id>.png`; não são uma promessa de que todo quadro possível foi visto.
- A inspeção visual encontrou um bug compartilhado de interpolação de objetos sem `id`: todas as plataformas interpolavam a partir da última plataforma. O integrador corrigiu `web/motion.mjs`, e a segunda inspeção de Luta dos Palitos confirmou plataformas estáveis.
- Atlas de cabra e lutador fornecidos pelo integrador. Atlas adicional de cavalo gerado em modo integrado `image_gen`, persistido em `web/assets/horse-motion-v3.png`, grade 4×2. Prompt e proveniência em `artifacts/additional-art-horse-v3.md`.

## Resultado por jogo

| Jogo / módulo | Verificação de regra e entradas | Correções / animação visível |
| --- | --- | --- |
| Batalha de Tanques (`tank-battle`) | Melhorar, recuperar, ataque aéreo e buraco negro; explosão testada isoladamente sobre alvo de 200 HP. | Ataque aéreo passou a causar 40 de dano uma vez, não várias vezes nos últimos ticks. Marca autor para pontuação. Esteiras em movimento, clarão curto do canhão, trilha do projétil, alerta de bombardeio, detonação e espiral do buraco negro. |
| Disputa pela Coroa (`take-the-crown`) | Fila, desafio, proteção e avanço do tempo de posse. | Escudo respeita `maxHp`, sem HP acima da barra. Ataques têm timestamp para pose; coroa e posição do dono visíveis; trocas de dono continuam regidas pela simulação. |
| Corrida de Carros (`car-race`) | Turbo, troca de faixa e óleo, inclusive diferença de progresso atravessando volta. | Óleo não afeta o próprio autor e compara distância modular entre voltas. Óleo agora é visível. Carros orientados pela tangente, oscilação ao escorregar, chama e poeira no turbo. Subfaixas visuais evitam largada com todos os sprites sobrepostos; `progress` e `lane` autoritativos não recebem handicap. |
| Arena de Tapas (`slap-arena`) | Firmar reduz o impulso de contato; a queda continua por ultrapassar a arena. | Timestamp do tapa anima golpe; defesa, impacto e derrota usam quadros reais do lutador. Nome tem suporte escuro para leitura no cenário. |
| Evolução dos Monstros (`evo-monster`) | Orbes de experiência, evolução, nível, tamanho e máximo de HP. | Orbes pulsam, criatura respira e reage ao ataque, evolução mantém crescimento e efeitos próprios. |
| Luta dos Palitos (`stick-fighters`) | Aterrissagem, novo salto e retorno após cair fora das plataformas. | `openBounds` evita que o clamp global prenda o jogador no fundo sem deixá-lo reaparecer. Socos e corrida usam atlas com poses, dano/queda têm reação; plataformas ficam fixas após correção compartilhada da interpolação. |
| Batalha das Serras (`chainsaw-clash`) | Aumento de alcance, cura dentro do HP máximo e redução do anel. | Lutador caminha, serra orbita e gira, ataque tem pose, dano reage e derrota fica visível antes de sumir. |
| Guerra das Gosmas (`blob-battle`) | Comida aumenta disponibilidade de recursos; divisão gasta massa e gera impulso. | Deformação elástica e sombra dão volume; comida pulsa. Regras de absorção e progressão foram mantidas. |
| Sumô das Cabras (`goat-sumo`) | Apoio azul/vermelho, peso extra, avanço físico e apoios equilibrados. | Substituída a amarração `b.x = a.x + 160` por corpos independentes, massa temporária, esforço com decaimento, amortecimento e colisão ponderada. Uma cabra pesada não encerra a rodada instantaneamente. Cabeçada, passos, reação, queda e corpo derrotado usam atlas de 12 quadros. Efeito de peso tem duração e barra visível; limites condizem com o círculo. |
| Batalha da Ponte (`bridge-brawl`) | Arqueiro causa dano a inimigo vivo e cria evento de projétil. | Unidades mortas não atacam no mesmo ciclo; HP de torre não fica negativo. Vida máxima de arqueiro/gigante é representada corretamente. Flecha viaja, impacto pisca e personagens se movimentam. Pranchas desenhadas de cima seguem as rotas e não são uma escada de imagens inclinadas. |
| Corrida dos Pássaros (`flappy-battle`) | Impulso altera velocidade vertical; roubo transfere pontos sem criá-los. | Ave inclina conforme velocidade, tem variação de batida e sombra; obstáculos passam continuamente. Placar e equipe permanecem identificáveis. |
| Guerra de Territórios (`territory-war`) | Fortificação absorve uma conquista antes de trocar propriedade. | Cada casa conquistada registra instante e pulsa; escudos são visíveis, tabuleiro mantém coordenadas das regras. |
| Guerra das Torres (`tower-war`) | Construir, escudo e pedra; nenhum dano antes da chegada, um impacto após 0,75 s. | Dano e consumo do escudo acontecem na chegada da pedra, não no início da animação. Trajetória parabólica, impacto, construção e escudo animados. Barra de progresso acompanha andares/20. Correção do teste antigo para conferir pré-contato e pós-contato. |
| Corrida de Cavalos (`horse-race`) | Arrancada gasta fôlego, descanso recupera; cavalo exausto não ganha turbo gratuito. | Galope de oito quadros em 9 fps, 14 durante arrancada, fase própria por participante; direção, poeira e nomes acompanham. Subfaixas de representação preservam o progresso real. |
| Arena de Equipes (`battle-arena`) | Curandeiro se desloca até aliado e cura sem ultrapassar vida máxima. | Corrigido curandeiro parado na origem, cura acima do máximo e tropas passando sem procurar o inimigo próximo. Unidades perseguem alvos em x/y; magias, cura, ataque e impacto têm eventos visíveis. |
| Cabo de Guerra (`boys-vs-girls`) | Puxadas iguais se anulam; união desloca corda para o lado correto. | Lutadores olham para a corda e alternam quadros de braço durante a puxada; corda oscila, marcador central e aros de equipe permanecem visíveis. |
| Combate de MMA (`mma-clash`) | Defesa reduz dano, falta de fôlego impede ataque, descanso recupera e chute registra sua pose. | Golpe, chute, guarda, reação, vitória e queda usam quadros distintos. Avanço do corpo sincronizado ao golpe; pé plantado e sombra alinhados (corrigido deslocamento visual de 66 unidades). |

## Limites e integração

Esses jogos continuam em Canvas 2D; os atlas não representam uma animação esquelética 3D. O galope e as poses são quadros de imagem; cenários e efeitos usam o relógio visual contínuo do integrador. Os módulos de mecânica permanecem separados e as entradas do chat são validadas no servidor.

O integrador cuida de `core/*`, parser de comandos com cor antes/depois, `web/art.mjs`, `web/motion.mjs`, cenários, resumo dos 63 jogos e empacotamento do Hub. Foi sinalizado que empate no timeout de `core/teams.mjs` não deve escolher o azul por `>=`, e que o banner de fim de rodada não deve ocultar a animação de derrota. Esses pontos não foram silenciosamente marcados como cobertos pelo meu arquivo de renderização.


# Revisão individual — 9 jogos Arcade — 27/10/2026

Escopo: módulos próprios, renderizador Canvas e testes, sem live, TTS, dependências novas ou assets do Livecade. Os assets usados são os atlas locais do projeto. O relógio visual `visualTime` é separado do estado autoritativo pelo integrador principal. O novo atlas `fighter-motion` é usado na escada e no lenhador; o astronauta usa recortes articulados do próprio sprite para alternar as pernas.

| Jogo | Verificação individual | Defeito corrigido | Movimento / feedback implementado |
| --- | --- | --- | --- |
| Corte das Frutas / fruit-slice | Corte por coordenada e hit-test; explosão; três perdas; avanço das metades | Frutas perdidas não tinham consequência e não havia corte visual | Giro em voo, duas metades com gravidade, rastro da lâmina, faísca da bomba, explosão e combo |
| Mil Degraus / 1000-stairs | Lado correto/incorreto; impulso; chegada a 1000; sequência remanescente | Impulso não consumia os cinco degraus e não disparava vitória | Salto interpolado entre lados, frames de caminhada, degraus deslizando, reação ao erro e balanço físico da escada |
| Mundo de Blocos / voxel-craft | Hit-test isométrico; construir/quebrar; quatro rotações; altura máxima | Contador iniciava em zero; célula cheia ainda rendia pontos; clique mudava o foco automaticamente; topo visual estava ~7px acima do hit-test | Bloco novo cai no lugar, fragmentos de edição, destaque de seleção pulsante alinhado ao topo |
| Porquinho Voador / flappy-3d | Altura do portal no plano z=.7; passagem com margem do corpo; piso e teto; impulso | Altura visual da abertura diferia do teste de colisão; corpo não era levado em conta; teto não penalizava | Portais se aproximam em perspectiva, anel ilustrado gira/pulsa, inclinação do porco, reação à batida de asas, vento e comemoração da passagem |
| Desafio do Lenhador / log-rush | Corte seguro; choque com galho; energia; galho extra | Havia aceitação de ações irrelevantes; ferramenta flutuava sem responder à ação | Frames de golpe, machado preso à região da mão, lascas com gravidade, tronco/galhos deslizando a cada corte, copa com vento |
| Colina dos Zumbis / zombie-hill | Munição, dano, recuo, recarga, restrição durante recarga, morte e limpeza do cadáver | Recarga não tinha progresso visível; tiro vazio e sem alvo não davam feedback; mortes sumiam instantaneamente | Marcha, recuo, queda e fade, faísca do tiro, traçador curto, tambor de seis balas, barra de recarga, efeito de reparo |
| Limpa-Vidros / window-wipe | Limpeza de canto direito; sujeira e balde; vidro já limpo | Offset +1 limpava a primeira célula da próxima linha; vidro limpo permitia pontuar sem remover sujeira; armação duplicada confundia a área clicável | Rodo ilustrado acompanha a última posição, espuma, gotas de balde, nuvens refletidas; grade visual alinhada com as 80 células |
| Torre de Precisão / tower-stack | Sobreposição e descarte; colocação perfeita; limites dependentes da largura; vento e estabilização | Andar podia sair da tela; vento acumulado podia travá-lo na borda; estabilização chegava perto de velocidade zero | Blocos com profundidade, sobras despencam, vento visível, alvo de alinhamento e sequência de perfeitos |
| Corrida Lunar / lunar-dash | Salto/retorno ao solo; sem reset de impulso no ar; meteoro atingido vs evitado; duração da baixa gravidade | Meteoros que acertavam o jogador ainda rendiam pontos ao passar; limite de salto tolerava nova impulsão no começo da subida; colisão não correspondia ao corpo | Pernas do astronauta alternam, corpo acompanha o passo, meteoros giram, chão desliza, estrelas cintilam, propulsor na baixa gravidade |

## Evidência automatizada

`node --test test/arcade-v3.test.mjs`: 10/10 testes passaram. Nove casos verificam as mecânicas individuais acima e o décimo percorre os nove renderizadores com sprites carregados, exige coordenadas finitas e saída gráfica diferente entre dois instantes. `npm test` também é obrigatório para integração; o integrador principal realiza a revisão visual no navegador e a verificação do pacote final.

## Limites honestos

São jogos 2D em Canvas. Perspectiva e articulação por sprites não são um motor 3D nem animação esquelética. Os testes de desenho verificam operações, recortes e tempo; não substituem inspeção humana dos enquadramentos. O usuário pediu revisão dos 63 jogos; estes nove são a fatia Arcade e devem compor o registro geral, junto das outras duas revisões e dos seis jogos anteriores.

## Revisão no navegador

Os nove jogos foram abertos individualmente no servidor local 4427. Acionei seus botões e conferi suas cenas; capturas estão em `artifacts/qa-arcade-v3/`. A inspeção encontrou e corrigiu mais quatro problemas de apresentação: tronco parecia uma pilha de tocos, portal distante virava um retângulo verde, abrigo era uma casinha de polígonos em cima de triângulo verde e piso lunar era uma barra cinza com círculos. O tronco agora recorta somente a casca contínua; o portal usa o anel ilustrado; o abrigo é uma barricada texturizada e o solo lunar usa textura de rocha. Zumbis agora surgem abaixo do HUD, com fade curto, para não atravessarem os indicadores.

As capturas são evidência de enquadramento e ações locais; os testes de tempo comprovam alteração dos estados/frames, sem afirmar uma revisão humana de toda combinação possível de entradas.


# Revisão individual — 31 jogos de quiz e diversão

Data: 27/10/2026. Escopo: 19 jogos de palavras/quiz e 12 sociais. Código completo disponível, testes locais sem live, sem voz e sem dependência nova. Não foram importados assets nem código do Livecade. Testes reproduzíveis em `test/quiz-social-v3.test.mjs` (31 cenários individuais + verificação dos 31 renderizadores). Todos reiniciam a rodada e retornam a `playing`.

| Jogo | Verificação individual | Correção / resposta visual |
| --- | --- | --- |
| Você Prefere? | Votar 1, trocar por2, duplicatas não acumulam; término aos30s | Barras e brilho dos votos; timer proporcional aos30s |
| Palavra Secreta | Erro preserva rodada; palavra alvo encerra e pontua | Tentativas e proximidade legíveis; realce de entrada |
| Cinco Letras | Texto de3 letras rejeitado; repetição de letra usa contagem; acerto encerra | Cada letra vira com atraso próprio; rows têm timestamp |
| Que Lugar É Esse? | Seleção por número resolve a cidade correta | Seis opções preservam os hitboxes; mapa continua esquemático, limitação declarada |
| Verdadeiro ou Falso | Usuário erra uma vez e não pode refazer; outro usuário pode acertar | Opções com resposta de entrada; timer90s |
| Trilha de Letras | CASA usa quatro células vizinhas distintas; seis palavras resolvem | Último caminho realmente encontrado aparece sobre as letras |
| Hora do Quiz | Alternativa correta conclui e pontua | Destaque de entrada e tempo restante correto |
| Desafio da Memória | Espiar, reiniciar rodada, virar carta e resolver par | Corrigido peekAt antigo apagando cartas da nova rodada; flips e brilho de par |
| Conta Rápida | Resposta numérica correta conclui; prazo25s | Timer corrigido para25s e interrogação animada |
| Caça-Palavras | As quatro palavras geram quatro caminhos | Grade e linhas das palavras encontradas ficam marcadas; antes só havia texto |
| O Chat Responde | As cinco respostas completam painel | Revelação individual com timestamp e partículas |
| Palavras Cruzadas | Três respostas preenchem cruzamentos e concluem | Células solucionadas são realçadas; acerto pontua uma vez |
| Encontre a Palavra | Letras embaralhadas diferem do alvo; acerto conclui | Letras e pista preservadas; interface não substitui resposta por imagem |
| De Quem É a Bandeira? | Nome com normalização/acento resolve | Cores e proporções da bandeira permanecem dados do jogo |
| Associação de Palavras | Cinco associações distintas concluem | Linhas e nós suaves, sem deslocar respostas para fora do quadro |
| Adivinhe o Desenho | Progresso aumenta com tempo; resposta termina | Desenho se revela progressivamente em vez de aparecer inteiro |
| Adivinhe o Símbolo | Progresso aumenta e resposta correta termina | Recorte de revelação progressivo; símbolos próprios, sem logos externos |
| Adivinhe o Número | 0 rejeitado; acerto dentro1–100 termina | Intervalo e tentativas permanecem visíveis |
| Quiz do Milhão | 50/50 não apaga correta;15 etapas geram1milhão de pontos virtuais | Timer150s e alternância de perguntas preservados |
| Fábrica de Cartas | Três cartas impressas combinam em uma nível2 | Corrigido current permanecendo na carta velha; carta combinada/revelação/álbum com entrada |
| Fábrica de Moedas | Cunhar, polir três vezes, polir no teto | Corrigida pontuação grátis em coleção vazia/jápolida; prensa, ejeção e rotação da moeda |
| Diário do Chat | Assinar uma vez/página, decorar, avançar13 páginas | Corrigidos índices de stickers após retenção12páginas; assinatura aparece e página vira |
| Impressora do Chat | Imprimir e mudar moldura depois | Corrigido color não alterando retratos já impressos; papel sai da máquina e entra no mural |
| Apresentador Interativo | Piada produz expressão de risada e janela de fala | Expressão volta ao neutro depois de falar; luzes e indicador de fala local, sem TTS |
| Festa da Dança | 21 participantes retêm18 na pista; acelerar respeita180BPM | Passo lateral, salto, balanço e piso/luzes no mesmo beat; sem fingir rig esquelético |
| Boneco da Zoeira | Mola levanta boneco;30confetes desaparecem após3s | Movimento segue gravidade/rotação e sombra acompanha altura |
| Central de Reações | Vitória entra na fila, aparece e pontua | Expressão, entrada da reação, luzes e partículas; pronto usa neutro |
| Cobrinha do Chat | Passo guarda corpo anterior e avança | Interpolação entre células, cabeça orientada à direção; wrap não cruza tela inteira |
| Bola de Cristal | Entrar na fila resolve nome; embaralhar registra novo instante | Órbita de partículas e efeito específico de embaralhar, antes invisível |
| Zoeira do Chat | Elogio passa pela fila e identifica autor | Retrato tem entrada datada e partículas; não há análise de foto |
| Pista da Galera | Azul+sincronizado conquistam células e placar conta casas | Células têm timestamp, acendem ao conquistar e pulsam no ritmo |

## Arquivos permanentes

- `web/social-motion.mjs`: tempos de apresentação, partículas, luzes, dança e virada de página.
- `web/social.mjs` e `web/quiz.mjs`: processos animados e realces de estado.
- Módulos sociais/quiz afetados guardam timestamps no snapshot. O motor continua autoritativo; animação não muda regra nem concede ações.

## Limites

Estas versões são implementações próprias. A dança continua baseada em sprites 2D com movimento de corpo e efeitos, sem prometer animação esquelética completa. O quiz tem banco pequeno de perguntas, cidades e palavras, que continua editável. O apresentador usa frases locais, sem geração automática de áudio nesta revisão. A validação finita não comprova ausência universal de bugs. A integração/EXE e os outros32jogos são revisados pelo agente principal e pelos demais agentes.

## Conferência visual no navegador

Os31 jogos foram carregados em galeria local e inspecionados por grupos, mantendo título individual e snapshot próprio; conferidos nos cinco recortes do navegador. Prensa também aberta individualmente e acionada por botão. A inspeção encontrou dois problemas adicionais de atlas (fundos vazando célula vizinha e bola de cristal cortada), comunicados ao principal; ele corrigiu os recortes de art.mjs. A correção dos fundos foi recarregada e confirmada visualmente. Boneco com rotação saía da borda, corrigido por limites baseados na extensão rotacionada e teste. Evidência de parte da galeria: quiz-social-v3-browser.png. Os arquivos temporários QAhtml/css/mjs foram removidos; não entram na distribuição.

32 testes específicos passaram. Execução completa durante trabalho paralelo marcou201/202, única falha no timing de projétil de tower-war (escopo do agente de combate), reportada a ele para correção; não esconder esse resultado até a rodada final do agente principal.


## Revisão cruzada

# Revisão cruzada — motor visual e comandos

27/10/2026. Arquivos revisados: `web/motion.mjs`, `web/art.mjs`, `web/scenery.mjs`, `core/commands.mjs`, contratos de `core/game.mjs` e `core/quiz.mjs`. Revisão dos arquivos principais sem editá-los; correções aplicadas pelo principal após comunicação.

## Bugs reproduzidos e resolvidos

1. `motion.points` associava todos os objetos sem `id` à última posição do Map(undefined). As três plataformas de Luta dos Palitos podiam começar cada snapshot na posição da terceira plataforma; confetes também convergiam indevidamente. Agora objetos sem ID permanecem nas suas posições reais. Teste específico compara os três objetos no início e meio do intervalo.
2. Cópias imutáveis de um snapshot com mesmo `time` reiniciavam `arrived` em cada frame e congelavam o relógio visual. Agora o relógio só reinicia com tempo de simulação novo e os dados de controles do mesmo instante continuam visíveis. Teste reproduz 50%/80% da interpolação através de clones.
3. Fundos do atlas tinham células de alturas irregulares, causando faixa de outro cenário na parte inferior. Principal trocou os limites por posições medidas; confirmado no navegador após recarregar a galeria dos31.
4. Bola de cristal era cortada no topo pelo grid regular. Recorte específico restabelece a silhueta. Na revisão adicional, o recorte também incluía900pixels opacos do fecho do livro em x400..416,y840..902; principal avisado para iniciar em x420.
5. Timeout/empate podiam receber o sufixo "venceu!" e o Quiz.step sobrescrevia a mensagem final da votação. Corrigido no principal; testes dele e teste de comando após finish conferem comportamento neutro.

## Contratos conferidos

- IDs explícitos mantêm correspondência de posição independentemente da ordem do array, sem mutar snapshots e sem arrastar atores recém-criados.
- Nova rodada usa suas posições novas, sem interpolar da rodada anterior.
- `!CABRA PESADA VERMELHA!`, `cabra pesada, vermelha`, `Cabra pesada da vermelha` e `vermelha cabra pesada` escolhem equipe1 e aplicam `heavyUntil` de verdade. Comando inválido não troca time; comando durante tela final é rejeitado.
- Os64 recortes usados por objects/environments/goat-motion/fighter-motion/horse-motion ficam dentro das dimensões PNG reais. Esse teste detecta bounds, mas não substitui inspeção das silhuetas/bleed.

## Validação

`node --test test/review-cross-v3.test.mjs`: 5 testes, 5 aprovados. Sem dependências, live ou TTS. Arquivos principais não foram alterados por este revisor; apenas o teste e este relatório foram adicionados.

## Lacunas visuais reais

Há16 ambientes-base e57 pares de ambiente/tratamento, não57 fundos pintados distintos. A biblioteca se repete em Palavra Secreta, Cinco Letras, Caça-Palavras, Cruzadas e Desenho; alguns tratamentos consistem em painel, sombreamento e partículas, sem uma composição totalmente nova. A variedade está muito maior e os locais combinam com os temas, mas a repetição de família ainda existe e deve ser comunicada sem exagero.

As novas cabras, lutadores e cavalos usam frames de sprite; nem todos os personagens dos demais jogos possuem sequência de membros. A festa usa movimento do corpo, passos/salto/escala e luzes, não um rig esquelético completo. Quadros de quiz devem permanecer estáveis e legíveis, com animação de revelação e acerto; não são cenas de ação contínua.
