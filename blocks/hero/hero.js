import { moveInstrumentation } from '../../scripts/scripts.js';
import { fieldCells } from '../../scripts/block-fields.js';

/*
 * Hero em duas colunas: rótulo, título e texto de apoio à esquerda; nota e botões à direita.
 *
 * A primeira linha traz os quatro campos do bloco, na ordem declarada em _hero.json. Cada
 * linha seguinte é um item "Hero — botão" (destino, texto, estilo). O limite de quatro
 * células por bloco é o que obriga os botões a serem itens em vez de campos.
 *
 * A instrumentação da UE viaja junto com cada elemento (moveInstrumentation), para o autor
 * clicar no texto na página e cair no campo certo.
 */

const FIELDS = ['eyebrow', 'title', 'lead', 'note'];

const el = (tag, className) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
};

/** Destino de um campo de link: o href do <a> renderizado, ou o próprio texto. */
function hrefOf(cell) {
  if (!cell) return '';
  const link = cell.querySelector('a[href]');
  return link ? link.getAttribute('href') : cell.textContent.trim();
}

/** Move o conteúdo de uma célula de richtext para dentro de um container. */
function appendRichText(cell, target, className) {
  if (!cell || !cell.textContent.trim()) return;
  const wrapper = el('div', className);
  moveInstrumentation(cell, wrapper);
  while (cell.firstChild) wrapper.append(cell.firstChild);
  target.append(wrapper);
}

/** Converte uma linha de item em um botão do hero. */
function ctaFromRow(row) {
  const [linkCell, labelCell, typeCell] = [...row.children];
  const href = hrefOf(linkCell);
  const label = labelCell ? labelCell.textContent.trim() : '';
  if (!href || !label) return null;

  const variant = typeCell && typeCell.textContent.trim() === 'secondary' ? 'secondary' : 'primary';
  const wrapper = el('p', 'button-wrapper');
  moveInstrumentation(row, wrapper);

  const link = el('a', `button ${variant}`);
  link.href = href;
  link.textContent = label;
  link.title = label;
  if (/^https?:/i.test(href)) {
    link.target = '_blank';
    link.rel = 'noopener';
  }
  wrapper.append(link);
  return wrapper;
}

export default function decorate(block) {
  const rows = [...block.children];
  const cells = fieldCells(block, FIELDS);

  const content = el('div', 'hero-content');
  const aside = el('div', 'hero-aside');

  if (cells.eyebrow && cells.eyebrow.textContent.trim()) {
    const eyebrow = el('p', 'hero-eyebrow');
    moveInstrumentation(cells.eyebrow, eyebrow);
    eyebrow.textContent = cells.eyebrow.textContent.trim();
    content.append(eyebrow);
  }

  if (cells.title && cells.title.textContent.trim()) {
    const heading = el('h1');
    moveInstrumentation(cells.title, heading);
    heading.textContent = cells.title.textContent.trim();
    content.append(heading);
  }

  appendRichText(cells.lead, content, 'hero-lead');
  appendRichText(cells.note, aside, 'hero-note');

  rows.slice(1).forEach((row) => {
    const cta = ctaFromRow(row);
    if (cta) aside.append(cta);
  });

  const layout = el('div');
  layout.append(content);
  if (aside.childElementCount) {
    layout.append(aside);
    block.classList.add('hero-split');
  }
  block.replaceChildren(layout);
}
