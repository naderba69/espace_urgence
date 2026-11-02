/** Move a favorite by one position without mutation; return the original array at boundaries. */
export function moveFavoriteKey<T>(keys: T[], key: T, offset: -1 | 1): T[] {
  const from = keys.indexOf(key);
  const to = from + offset;
  if (from < 0 || to < 0 || to >= keys.length) return keys;

  const next = [...keys];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}
