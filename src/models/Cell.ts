export type X = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export class Cell {
  constructor(private value: X) {}

  toString() {
    return this.value === 0 ? "." : "" + this.value;
  }
}
