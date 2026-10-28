# Atlas de galope — revisão 3

Arquivo: `web/assets/horse-motion-v3.png`, grade regular **4 × 2**, oito quadros.
Ferramenta: `image_gen`, modo integrado, fundo transparente preservado.
Fonte gerada: imagem original local do `image_gen`, copiada para o arquivo do projeto acima.

## Prompt enviado

Production game sprite animation atlas, one original brown racehorse with a small blue-clad adult jockey, entire horse and jockey fully visible in every frame, STRICTLY side profile facing RIGHT. Exactly 8 successive poses of one believable gallop cycle: row 1 columns 1-4 contact, compression, push off, gathered suspension; row 2 columns 1-4 landing reach, extended, forefoot contact, recovery. STRICT regular 4 columns by 2 rows grid, equal square cells, same camera, same horse identity, same rider outfit, identical horse body scale and ground baseline, each pose centered with 8 percent inner transparent margin and no pixel crossing into an adjacent cell. Consistent polished stylized 3D game art, readable anatomy, anatomically coherent four legs and hoof positions, jockey crouching forward and reins held consistently, soft warm key light. Fully transparent background alpha, no floor, no shadow, no scenery, no grid lines, no borders, no words, no numbers, no logos, no cropped limbs, no extra horses. This is a single sprite sheet asset to be sliced into 8 frames in a local browser racing game.

## Uso

`web/arena.mjs` anima os oito quadros em 9 fps, ou 14 fps durante arrancada, com fase por participante, orientação pelo percurso e poeira. O retrato do jóquei identifica sua equipe pelo aro e nome, sem alterar a cor da pele via filtro. A animação não faz chamadas remotas em tempo de execução.
