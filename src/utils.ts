export function randNumber(min: number, max: number): number {
  return min + (max - min) * Math.random();
}
