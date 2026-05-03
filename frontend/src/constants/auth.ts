export const ADJECTIVES = [
  'Silent',
  'Blue',
  'Gentle',
  'Brave',
  'Kind',
  'Wise',
  'Calm',
  'Quiet',
];

export const NOUNS = [
  'Wave',
  'Soul',
  'Heart',
  'Mind',
  'Spirit',
  'Dream',
  'Star',
  'Moon',
];

export const getRandomInt = (min: number, max: number): number => {
  const [a, b] = min <= max ? [min, max] : [max, min];
  return Math.floor(Math.random() * (b - a + 1)) + a;
};

export const generateAnonymousUsername = (): string => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = getRandomInt(100, 999);
  return `${adjective}${noun}${number}`;
};

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** Generates a random alphanumeric username (e.g. Xk7mNp2qL) */
export const generateRandomLettersUsername = (length = 10): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
};
