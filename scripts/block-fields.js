/*
 * Leitura dos campos de um bloco autorado no Universal Editor.
 *
 * Na autoria por documento, a configuração vinha em linhas `chave | valor` e era lida com
 * readBlockConfig(). Aqui não: o AEM renderiza um bloco com `model` como UMA linha, com UMA
 * célula por campo, na ordem em que o campo aparece no model. Este módulo faz essa ponte —
 * os nomes passados têm de seguir exatamente a ordem dos campos no `_<bloco>.json`.
 */

/**
 * Mapeia as células da primeira linha do bloco para nomes de campo.
 * @param {Element} block elemento do bloco
 * @param {string[]} names nomes dos campos, na ordem do model
 * @returns {Object<string, Element|undefined>} campo para a célula correspondente
 */
export function fieldCells(block, names) {
  const row = block.querySelector(':scope > div');
  const cells = row ? [...row.children] : [];
  const out = {};
  names.forEach((name, i) => {
    out[name] = cells[i];
  });
  return out;
}

/**
 * Os mesmos campos já convertidos em texto simples, para configuração.
 * @param {Element} block elemento do bloco
 * @param {string[]} names nomes dos campos, na ordem do model
 * @returns {Object<string, string>} campo para o texto da célula, sem espaços nas pontas
 */
export function fieldValues(block, names) {
  const cells = fieldCells(block, names);
  const out = {};
  names.forEach((name) => {
    const cell = cells[name];
    const link = cell && cell.querySelector('a[href]');
    out[name] = link ? link.getAttribute('href') : ((cell && cell.textContent.trim()) || '');
  });
  return out;
}
