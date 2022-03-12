import produce from "immer";
import {
  Board,
  getCellAt,
  getRowValues,
  getColValues,
  getBoxValues,
} from "../models/board";
import { Candidate, Cell } from "../models/cell";
import { existsSameValue } from "./existsSameValue";

const getExistingValues = (board: Board, row: number, col: number) => {
  const rowValues = getRowValues(board, row);
  const colValues = getColValues(board, col);
  const boxValues = getBoxValues(board, row, col);
  return [...rowValues, ...colValues, ...boxValues];
};

export const getCellCandidates = (board: Board, cell: Cell) => {
  const { row, col } = cell.position;
  return getCandidatesAt(board, row, col);
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

export const getBoardWithCandidates = (board: Board): Board => {
  return produce(board, (draft) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const target = getCellAt(draft, row, col);
        if (!target.writable) {
          continue;
        }
        const candidates = getCandidatesAt(board, row, col);
        if (candidates == null) {
          continue;
        }
        target.candidates = candidates;
      }
    }
  });
};

export const checkAt = (board: Board, row: number, col: number) => {
  const rowValues = getRowValues(board, row);
  if (existsSameValue(rowValues)) {
    return false;
  }

  const colValues = getColValues(board, col);
  if (existsSameValue(colValues)) {
    return false;
  }

  const boxValues = getBoxValues(board, row, col);
  if (existsSameValue(boxValues)) {
    return false;
  }
  return true;
};
