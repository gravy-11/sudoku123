import {
  Board,
  getCellAt,
  getRowValues,
  getColValues,
  getBoxValues,
} from "../models/board";
import { Candidate } from "../models/cell";
// import { Backtrack } from "../models/Backtrack";

// export function solve(input: string): string {
//   const board = Board.from(input);
//   const solver = new Backtrack(board);
//   return solver.solve();
// }

const getExistingValues = (board: Board, row: number, col: number) => {
  const rowValues = getRowValues(board, row);
  const colValues = getColValues(board, col);
  const boxValues = getBoxValues(board, row, col);
  return [...rowValues, ...colValues, ...boxValues];
};

export const getCandidatesAt = (board: Board, row: number, col: number) => {
  const target = getCellAt(board, row, col);
  if (!target.writable || target.value != null) {
    return;
  }

  const existingValues = getExistingValues(board, row, col);
  const initCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9] as Candidate[];
  return initCandidates.filter((c) => !existingValues.includes(c));
};

// export const getAllCandidates(board) {
//   let result = []
//   for (let row = 0; row < 9; row++) {
//     for (let col = 0; col < 9; col++) {
//       this.setCandidatesAt(col, row);
//     }
//   }
// }
