import {parseCsv} from '../../triple-triad/scripts/update-data.mjs';

// Recent datamining exports include a numeric header and a type row.
export function parseGameCsv(text,required){
  const csv=text.replace(/^\uFEFF/,'').replace(/^key,[^\r\n]*\r?\n/,'');
  const rows=parseCsv(csv).filter(row=>/^\d+$/.test(row['#']));
  if(!rows.length||required.some(key=>!Object.hasOwn(rows[0],key)))throw Error('Invalid game CSV: missing rows or columns '+required.join(', '));
  return rows;
}
