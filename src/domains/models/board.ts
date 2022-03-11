import { createCell, Cell, Candidate, isInSameBox } from "./cell";
// import { existsSameValue } from "../helpers/existsSameValue";

export type Board = {
  cells: Cell[];
};

export const createBoard = (input: string): Board => {
  if (!/^[0-9]{81}$/.test(input)) {
    throw new RangeError("Input must be 81-digit string");
  }

  const cells = input.split("").map((s, index) => {
    const position = {
      row: Math.floor(index / 9),
      col: index % 9,
    };
    return createCell(position, +s as Candidate | 0);
  });
  return { cells };
};

export const outputBoard = (board: Board): string => {
  return board.cells.map((c) => (c.value == null ? 0 : c.value)).join("");
};

export const getCellAt = (board: Board, row: number, col: number) => {
  return board.cells[row * 9 + col];
};

export const getRowValues = (board: Board, row: number) => {
  return board.cells
    .filter((cell) => cell.position.row === row && cell.value != null)
    .map((cell) => cell.value as Candidate);
};

export const getColValues = (board: Board, col: number) => {
  return board.cells
    .filter((cell) => cell.position.col === col && cell.value != null)
    .map((cell) => cell.value as Candidate);
};

export const getBoxValues = (board: Board, row: number, col: number) => {
  const target = getCellAt(board, row, col);
  return board.cells
    .filter((cell) => isInSameBox(cell, target) && cell.value != null)
    .map((cell) => cell.value as Candidate);
};

// export class Board {
//   constructor(private cells: Cell[]) {}

//   static from(input: string) {
//     if (!/^[0-9]{81}$/.test(input)) {
//       throw new RangeError("Input must be 81-digit string");
//     }

//     const cells = input.split("").map((s, index) => {
//       const row = Math.floor(index / 9);
//       const col = index % 9;
//       return Cell.create([row, col], +s as X);
//     });
//     return new Board(cells);
//   }

//   output() {
//     return this.cells.map((cell) => cell.getVal()).join("");
//   }

//   toString(pencilMarks = false) {
//     let result = "";
//     for (let row = 0; row < 9; row++) {
//       if (row === 0) result += this.getTopBorder(pencilMarks);
//       if (row === 3 || row === 6) result += this.getSeparator(pencilMarks);
//       result += this.getRowString(row, pencilMarks);
//     }
//     result += this.getBottomBorder(pencilMarks);
//     return result;
//   }

//   getCellAt(row: number, col: number) {
//     return this.cells[row * 9 + col];
//   }

//   setCellAt(row: number, col: number, value: X) {
//     const target = this.cells[row * 9 + col];
//     if (!target.isWritable()) {
//       return;
//     }
//     target.setVal(value);
//   }

//   getCells() {
//     return this.cells;
//   }

//   setCells(cells: Cell[]) {
//     this.cells = cells;
//   }

//   checkAt(row: number, col: number) {
//     const rowValues = this.getRowValues(row);
//     if (existsSameValue(rowValues)) {
//       return false;
//     }

//     const colValues = this.getColValues(col);
//     if (existsSameValue(colValues)) {
//       return false;
//     }

//     const boxValues = this.getBoxValues(row, col);
//     if (existsSameValue(boxValues)) {
//       return false;
//     }
//     return true;
//   }

//   getUnresolvedCells() {
//     return this.cells.filter((cell): cell is WritableCell => {
//       return cell.getVal() === 0;
//     });
//   }

//   getRowValues(row: number) {
//     return this.cells
//       .filter((c) => c.getRow() === row)
//       .map((c) => c.getVal())
//       .filter((v) => v !== 0);
//   }

//   getColValues(col: number) {
//     return this.cells
//       .filter((c) => c.getCol() === col)
//       .map((c) => c.getVal())
//       .filter((v) => v !== 0);
//   }

//   getBoxValues(row: number, col: number) {
//     const target = this.getCellAt(row, col);
//     return this.cells
//       .filter((cell) => cell.isInSameBox(target))
//       .map((c) => c.getVal())
//       .filter((v) => v !== 0);
//   }

//   setCandidatesAt(row: number, col: number) {
//     const target = this.getCellAt(row, col);
//     if (!target.isWritable() || target.getVal() !== 0) {
//       return;
//     }
//     const rowValues = this.getRowValues(row);
//     const colValues = this.getColValues(col);
//     const boxValues = this.getBoxValues(row, col);
//     const existingValues = [...rowValues, ...colValues, ...boxValues];
//     const initCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9] as X[];
//     const possibleCandidates = initCandidates.filter(
//       (c) => !existingValues.includes(c)
//     );
//     if (row === 0 && col === 3) {
//       console.log("rowVals", rowValues);
//       console.log("possible", possibleCandidates);
//     }
//     if (possibleCandidates.length === 0) {
//       throw new Error();
//     }
//     target.setCandidates(possibleCandidates);
//   }

//   setAllCandidates() {
//     console.log(this.toString());
//     for (let row = 0; row < 9; row++) {
//       for (let col = 0; col < 9; col++) {
//         this.setCandidatesAt(col, row);
//       }
//     }
//   }

//   private getRowString(row: number, pencilMarks = false) {
//     let result = "";
//     for (let col = 0; col < 9; col++) {
//       if (pencilMarks) {
//         const preposition = col % 3 === 0 ? "| " : " ";
//         result += preposition + this.getCellAt(row, col).toString(pencilMarks);
//       } else {
//         const preposition = col % 3 === 0 ? "|" : " ";
//         result += preposition + this.getCellAt(row, col).toString();
//       }
//     }
//     result += "|\n";
//     return result;
//   }

//   private getTopBorder(pencilMarks = false) {
//     return this.getLine(".", ".", pencilMarks);
//   }

//   private getSeparator(pencilMarks = false) {
//     return this.getLine(":", " ", pencilMarks);
//   }

//   private getBottomBorder(pencilMarks = false) {
//     return this.getLine("'", "'", pencilMarks);
//   }

//   private getLine(end: string, middle: string, pencilMarks = false) {
//     let barCount = 5;
//     if (pencilMarks) {
//       barCount = 24;
//     }
//     const line = "-".repeat(barCount);
//     return end + line + middle + line + middle + line + end + "\n";
//   }
// }
