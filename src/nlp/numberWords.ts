const UNIT_WORDS: Record<string, number> = {
  zero: 0, um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5,
  seis: 6, sete: 7, oito: 8, nove: 9,
};

const TEEN_WORDS: Record<string, number> = {
  dez: 10, onze: 11, doze: 12, treze: 13, quatorze: 14, catorze: 14,
  quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18, dezenove: 19,
};

const TENS_WORDS: Record<string, number> = {
  vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, sessenta: 60,
  setenta: 70, oitenta: 80, noventa: 90,
};

const HUNDRED_WORDS: Record<string, number> = {
  cem: 100, cento: 100, duzentos: 200, duzentas: 200, trezentos: 300,
  trezentas: 300, quatrocentos: 400, quatrocentas: 400, quinhentos: 500,
  quinhentas: 500, seiscentos: 600, seiscentas: 600, setecentos: 700,
  setecentas: 700, oitocentos: 800, oitocentas: 800, novecentos: 900,
  novecentas: 900,
};

function isNumberWord(w: string): boolean {
  return w in UNIT_WORDS || w in TEEN_WORDS || w in TENS_WORDS || w in HUNDRED_WORDS;
}

function wordValue(w: string): number {
  return HUNDRED_WORDS[w] ?? TENS_WORDS[w] ?? TEEN_WORDS[w] ?? UNIT_WORDS[w] ?? 0;
}

/** Consumes a run of Portuguese number words starting at `start`. Returns null if none found. */
function parseRun(words: string[], start: number): { value: number; length: number } | null {
  let i = start;
  let value = 0;
  let matchedAny = false;
  while (i < words.length) {
    const w = words[i];
    if (w === "e") {
      const next = words[i + 1];
      if (matchedAny && next && isNumberWord(next)) {
        i++;
        continue;
      }
      break;
    }
    if (isNumberWord(w)) {
      value += wordValue(w);
      matchedAny = true;
      i++;
      continue;
    }
    break;
  }
  if (!matchedAny) return null;
  return { value, length: i - start };
}

/**
 * Replaces runs of spelled-out Portuguese numbers ("duzentos e cinquenta")
 * with digit tokens ("250") so downstream quantity parsing can treat typed
 * and voice-transcribed text the same way.
 */
export function digitizeNumberWords(text: string): string {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let i = 0;
  while (i < words.length) {
    const run = parseRun(words, i);
    if (run && run.length > 0) {
      out.push(String(run.value));
      i += run.length;
    } else {
      out.push(words[i]);
      i++;
    }
  }
  return out.join(" ");
}
