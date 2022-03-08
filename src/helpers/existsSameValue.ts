export function existsSameValue<T>(arr: T[]): boolean {
  const set = new Set(arr);
  return set.size !== arr.length;
}
