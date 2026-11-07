# Fontes dos dados de `marmitas-detalhes.json`

Dados preenchidos a partir de busca na internet, **sem validação da nutricionista**. Devem ser
substituídos/conferidos antes de qualquer uso real. Nas marmitas 1 a 6, `valorEnergeticoKcal` foi
**substituído** pelo valor calculado da fonte (coluna "kcal da fonte", arredondado), para ficar
coerente com os demais nutrientes; o `db.json` **não** foi alterado e segue com 300 kcal nesses
pratos. Nos itens 7 a 11, `valorEnergeticoKcal` continua vindo do `db.json`.

## Marmitas (ids 1 a 6)

Receitas do Receiteria. A tabela nutricional da página é **por 100 g** (calculada pelo site com TACO/TBCA,
valores aproximados); os valores do JSON são esse valor × (quantidade do prato no `db.json` / 100).
As quantidades dos ingredientes são as da receita original, que rende o nº de porções indicado.

| id | Prato | Fonte | Rendimento da receita | Escala aplicada | kcal da fonte p/ a porção | kcal no db.json |
|----|-------|-------|-----------------------|-----------------|---------------------------|-----------------|
| 1 | Abobrinha Recheada | https://www.receiteria.com.br/receita/abobrinha-recheada-facil/ | 4 porções | 101 kcal/100 g × 2,5 (250 g) | ≈ 252 | 300 |
| 2 | Lasanha Berinjela | https://www.receiteria.com.br/receita/lasanha-de-berinjela/ | 8 porções | 126 kcal/100 g × 2,5 (250 g) | ≈ 315 | 300 |
| 3 | Arroz de Forno | https://www.receiteria.com.br/receita/arroz-de-forno/ | 8 porções | 159 kcal/100 g × 2,5 (250 g) | ≈ 398 | 300 |
| 4 | Arroz Carreteiro | https://www.receiteria.com.br/receita/arroz-carreteiro/ | 5 porções | 172 kcal/100 g × 2 (200 g) | ≈ 344 | 300 |
| 5 | Batata Recheada | https://www.receiteria.com.br/receita/batata-recheada/ | 4 unidades | 338 kcal/100 g × 2,54 (254 g) | ≈ 858 | 300 |
| 6 | Tomate Recheado | https://www.receiteria.com.br/receita/tomates-recheados-com-creme-de-queijo/ | 2 porções | 81 kcal/100 g × 2,54 (254 g) | ≈ 206 | 300 |

Açúcares: nenhuma das páginas informa; ficou `null`.

## Alimentos (ids 7 a 11), valores por 100 g

- 7 Acelga crua: https://www.tabelatacoonline.com.br/tabela-nutricional/ibge/acelga-crua (19 kcal; proteína 1,8 g; carboidrato 3,74 g; lipídeos 0,2 g)
- 8 Champignon em conserva: https://www.tabelatacoonline.com.br/tabela-nutricional/ibge/champignon-em-conserva (50,74 kcal; proteína 1,87 g; carboidrato 5,09 g; lipídeos 3,2 g)
- 9 Cenoura crua: https://www.tabelatacoonline.com.br/tabela-nutricional/taco/cenoura-crua (34 kcal; proteína 1,3 g; carboidrato 7,7 g; lipídeos 0,2 g). Valores lidos no resultado de busca, a página não carregou a tabela na leitura direta.
- 10 Alface americana crua: https://www.tabelatacoonline.com.br/tabela-nutricional/taco/alface-americana-crua (9 kcal; proteína 0,6 g; carboidrato 1,7 g; lipídeos 0,1 g). Mesma observação da cenoura.
- 11 Café: nenhuma tabela obtida; nutrientes ficaram `null`.

Sódio e açúcares dos itens 7 a 11 não foram obtidos; ficaram `null`.

## Congelamento e aquecimento (ids 1 a 6)

Orientação genérica para marmitas caseiras, encontrada em resultados de busca (não é específica de cada prato):

- Até 30 dias a -18 °C: https://dol.com.br/carajas/noticias/gastronomia/915849/marmitas-congeladas-duram-ate-30-dias-com-esses-cuidados
- Descongelar na geladeira ou no micro-ondas (nunca em temperatura ambiente), não recongelar, aquecer com tampa entreaberta e mexendo: https://cursa.app/pt/pagina/descongelamento-reaquecimento-e-transporte-seguro-das-marmitas

Os resultados de busca citam a Anvisa para o descongelamento, mas não encontrei uma norma oficial com o prazo de 30 dias. Tempo de aquecimento em minutos não foi encontrado, por isso o campo descreve o critério (bem quente por inteiro, mexendo na metade).
