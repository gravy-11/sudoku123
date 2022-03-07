import { Cell, X } from "./Cell";

export class Board {
  constructor(private cells: Cell[]) {}

  static from(input: string) {
    if (!/^[0-9]{81}$/.test(input)) {
      throw new RangeError("Input must be 81-digit string");
    }

    const cells = input.split("").map((s, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      return Cell.create([row, col], +s as X);
    });
    return new Board(cells);
  }

  toString(pencilMarks = false) {
    let result = "";
    for (let row = 0; row < 9; row++) {
      if (row === 0) result += this.getTopBorder(pencilMarks);
      if (row === 3 || row === 6) result += this.getSeparator(pencilMarks);
      result += this.getRowString(row, pencilMarks);
    }
    result += this.getBottomBorder(pencilMarks);
    return result;
  }

  getCell(row: number, col: number) {
    return this.cells[row * 9 + col];
  }

  getRowCells(row: number) {
    return this.cells.filter((cell) => cell.getRow() === row);
  }

  getColCells(col: number) {
    return this.cells.filter((cell) => col === cell.getCol());
  }

  getBoxCells(row: number, col: number) {
    const target = this.getCell(row, col);
    return this.cells.filter((cell) => cell.isInSameBox(target));
  }

  private getRowString(row: number, pencilMarks = false) {
    let result = "";
    for (let col = 0; col < 9; col++) {
      if (pencilMarks) {
        const preposition = col % 3 === 0 ? "| " : " ";
        result += preposition + this.getCell(row, col).toString(pencilMarks);
      } else {
        const preposition = col % 3 === 0 ? "|" : " ";
        result += preposition + this.getCell(row, col).toString();
      }
    }
    result += "|\n";
    return result;
  }

  private getTopBorder(pencilMarks = false) {
    return this.getLine(".", ".", pencilMarks);
  }

  private getSeparator(pencilMarks = false) {
    return this.getLine(":", " ", pencilMarks);
  }

  private getBottomBorder(pencilMarks = false) {
    return this.getLine("'", "'", pencilMarks);
  }

  private getLine(end: string, middle: string, pencilMarks = false) {
    let barCount = 5;
    if (pencilMarks) {
      barCount = 24;
    }
    const line = "-".repeat(barCount);
    return end + line + middle + line + middle + line + end + "\n";
  }
}
