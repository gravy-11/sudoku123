import { Cell, X } from "./Cell";

export class Board {
  constructor(private cells: Cell[][]) {}

  static from(input: string) {
    if (!/^[0-9]{81}$/.test(input)) {
      throw new RangeError("Input must be 81-digit string");
    }

    const cells = [] as Cell[][];
    input.split("").forEach((s, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      if (col === 0) {
        cells.push([new Cell(+s as X)]);
        return;
      }
      cells[row].push(new Cell(+s as X));
    });
    return new Board(cells);
  }

  toString() {
    let result = "";
    for (let row = 0; row < 9; row++) {
      if (row === 0) result += ".-----.-----.-----.\n";
      if (row === 3 || row === 6) result += ":----- ----- -----:\n";
      result += this.getRowString(row);
    }
    result += ".-----.-----.-----.\n";
    return result;
  }

  private getRowString(row: number) {
    let result = "";
    for (let col = 0; col < 9; col++) {
      result += (col % 3 === 0 ? "|" : " ") + this.cells[row][col].toString();
    }
    result += "|\n";
    return result;
  }
}
