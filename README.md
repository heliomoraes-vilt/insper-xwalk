# Parcerias globais — Insper

Catálogo de universidades parceiras do Insper em Edge Delivery Services, com autoria no AEM
pelo Universal Editor.

Projeto baseado no [aem-boilerplate-xwalk](https://github.com/adobe-rnd/aem-boilerplate-xwalk).
Os blocos vieram de um protótipo em autoria por documento e foram adaptados ao contrato do
xwalk — ver [Blocos](#blocos).

## Ambientes

- Preview: https://main--insper-xwalk--heliomoraes-vilt.aem.page/
- Live: https://main--insper-xwalk--heliomoraes-vilt.aem.live/
- Author: https://author-p34812-e1712500.adobeaemcloud.com/

O `fstab.yaml` monta `/` em `/bin/franklin.delivery/heliomoraes-vilt/insper-xwalk/main` no
author. O conteúdo das páginas vem de lá; os dados do catálogo vêm de uma planilha publicada.

## Pré-requisitos ainda pendentes

Sem estes dois passos o preview responde 404:

1. Instalar o GitHub App **AEM Code Sync** neste repositório.
2. Configurar o projeto em **tools.aem.live**.

E, para a UE abrir as páginas, o site precisa existir no author acima.

## Blocos

| Bloco | O que faz | Autoria |
| --- | --- | --- |
| `hero` | Capa em duas colunas | 4 campos + itens "Hero — botão" |
| `notice` | Aviso destacado | texto + variante |
| `partner-catalog` | Busca, filtros, indicadores, grade e detalhe | 4 campos de configuração |
| `network-insights` | Três painéis de barras que filtram o catálogo | fonte + título de cada painel |
| `world-map` | Mapa com drill-down Mundo → país → cidade | fonte, geometria, título, subtítulo |

Os três últimos desenham a si mesmos a partir dos dados: o autor define configuração, não
conteúdo.

### Duas regras do xwalk que moldaram o código

**Um bloco com `model` vira uma linha com uma célula por campo**, na ordem declarada — não
existem linhas `chave | valor`. Por isso `scripts/block-fields.js` (`fieldCells` e
`fieldValues`) substitui o `readBlockConfig()` do boilerplate de documento.

**No máximo 4 células por bloco**, regra do `eslint-plugin-xwalk`. É o que levou os botões do
hero a serem itens (`hero-cta`) em vez de campos, no mesmo padrão do bloco `cards`.

Blocos que reconstroem o DOM devem levar a instrumentação junto, com `moveInstrumentation`,
ou o autor perde a ligação entre o que vê na página e o campo que edita.

## Models da UE

Cada bloco carrega seu próprio `blocks/<bloco>/_<bloco>.json` com `definitions`, `models` e
`filters`. Os três arquivos da raiz são **gerados**:

```bash
npm run build:json
```

Um hook de pre-commit (husky) roda isso automaticamente. Nunca edite `component-definition.json`,
`component-models.json` ou `component-filters.json` à mão.

Para um bloco novo aparecer na UE, ele também precisa ser listado em
`models/_section.json`, no filtro `section`.

## Estado compartilhado

`scripts/catalog-state.js` guarda busca, filtros, ordenação e seleção, com publish/subscribe,
e carrega a planilha uma vez compartilhando a promessa entre os blocos. É assim que clicar
num país do mapa filtra o catálogo e os gráficos sem que um bloco importe o outro — o projeto
só admite import cruzado de `fragment.js`.

## Dados

Os blocos leem um índice JSON publicado (padrão `/parcerias.json`) com três abas:

| Aba | Conteúdo |
| --- | --- |
| `parceiros` | 138 instituições, 23 colunas |
| `taxonomia` | rótulos PT/EN de cursos, oportunidades, continentes, países e acreditações |
| `cidades` | coordenadas das 111 cidades, para os marcadores do mapa |

As imagens ficam em `/assets/parcerias/<slug>.webp` e `<slug>-logo.webp`, servidas pela fonte
de conteúdo — **não** neste repositório.

O pacote pronto para publicar (planilhas e imagens) está em
`../insper-parcerias-conteudo`, com instruções no `LEIA-ME.md` de lá.

## Desenvolvimento local

```bash
npm install
npm run lint
```

`test/xwalk.html` é uma página de preview com a marcação que o AEM gera para blocos com
`model`. Sirva a raiz do projeto em HTTP e abra `/test/xwalk.html` — ela não depende do
ambiente de autoria. A pasta `test/` está no `.hlxignore` e não vai ao ar.

Sem a planilha publicada, o catálogo e o mapa mostram a mensagem de erro; o `test/parcerias.json`
serve como fonte local para esse preview.

## Preferências do leitor

`scripts/prefs.js` monta os controles de idioma, tema e tamanho de texto na área de
ferramentas do header. As preferências são aplicadas em `scripts.js` antes do primeiro paint,
para a página não piscar. A escala de texto depende de toda a tipografia estar em `rem`.

## Convenções

- `.gitattributes` fixa LF. Sem isso, um checkout no Windows com `core.autocrlf=true` quebra
  a regra `linebreak-style` do eslint.
- CSS sempre escopado em `.nome-do-bloco`; `-wrapper` e `-container` são classes de seção.
- `scripts/aem.js` é vendorizado — não editar.

## Documentação

- [Universal Editor blocks](https://www.aem.live/developer/universal-editor-blocks)
- [Markup, sections, blocks e auto blocking](https://www.aem.live/developer/markup-sections-blocks)
- [Web performance](https://www.aem.live/developer/keeping-it-100)
