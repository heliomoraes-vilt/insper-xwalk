import { fieldCells } from '../../scripts/block-fields.js';

/*
 * Aviso: um texto curto e destacado. A variante vem de um campo do model, não do nome do
 * bloco, para o autor escolher na UE em vez de digitar "Notice (warning)".
 */
export default function decorate(block) {
  const { text, variant } = fieldCells(block, ['text', 'variant']);
  const style = variant ? variant.textContent.trim() : '';
  if (variant) variant.remove();
  if (text) text.classList.add('notice-body');
  if (style) block.classList.add(style);
  block.setAttribute('role', 'note');
}
