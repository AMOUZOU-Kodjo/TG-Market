// Filtre de contenu interdit par les CGU — mots codés en dur (pas d'admin).
// Bloque les messages (API + socket) et les titres/descriptions d'annonces.

const FORBIDDEN_WORDS = [
  // Stupéfiants & drogues
  'drogue', 'cannabis', 'cocaine', 'crack', 'heroine', 'mdma', 'ecstasy',
  'lsd', 'meth', 'methamphetamine', 'marijuana', 'weed', 'kush', 'beuh',
  'hashish', 'haschich', 'haschisch', 'joint', 'fentanyl', 'tramadol',
  'subutex', 'oxycodone', 'amphetamine', 'stupéfiant', 'psychotrope',
  'zamal',
  // Armes & explosifs
  'kalachnikov', 'ak47', 'glock', 'revolver', 'mitrailleuse', 'bazooka',
  'munition', 'explosif', 'dynamite',
  // Documents & produits frauduleux
  'faux billet', 'faux documents', 'faux papiers', 'fausse carte',
];

// Substitution leet appliquée au texte ET aux mots (minimise les faux positifs)
const LEET_MAP = {
  0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', 6: 'g', 9: 'g',
};

const SEP = '[\\s._\\-*]*';

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[0-9]/g, (digit) => LEET_MAP[digit] ?? digit);
}

function escapeRegexChar(ch) {
  return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPattern(word) {
  const parts = normalizeText(word)
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => {
      const letters = part.split('').map(escapeRegexChar).join(SEP);
      return `\\b${letters}s?\\b`;
    });
  return new RegExp(parts.join(SEP), 'i');
}

const PATTERNS = FORBIDDEN_WORDS.map(toPattern);

export function findForbiddenWords(text) {
  if (!text || typeof text !== 'string') return [];
  const normalized = normalizeText(text);
  const found = [];
  PATTERNS.forEach((pattern, index) => {
    if (pattern.test(normalized)) found.push(FORBIDDEN_WORDS[index]);
  });
  return found;
}

export function containsForbiddenContent(text) {
  return findForbiddenWords(text).length > 0;
}
