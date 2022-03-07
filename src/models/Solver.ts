import { Board } from "./Board";
import { X } from "./Cell";

export class Solver {
  constructor(private board: Board) {}

  setCandidatesAt(row: number, col: number) {
    const target = this.board.getCell(row, col);
    if (!target.isWritable()) {
      return;
    }
    const rowCells = this.board.getRowCells(row);
    const colCells = this.board.getColCells(col);
    const boxCells = this.board.getBoxCells(row, col);
    const existingValues = [...rowCells, ...colCells, ...boxCells].map((cell) =>
      cell.getVal()
    );
    const initCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9] as X[];
    const possibleCandidates = initCandidates.filter(
      (c) => !existingValues.includes(c)
    );
    target.setCandidates(possibleCandidates);
  }

  setAllCandidates() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        this.setCandidatesAt(col, row);
      }
    }
  }
}
