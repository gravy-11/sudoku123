import produce from "immer";
import { difference } from "lodash-es";
import {
  Board,
  getCellAt,
  getRowValues,
  getColValues,
  getBoxValues,
  getUnsolvedCells,
} from "../models/board";
import { Digit, Cell, UnsolvedCell } from "../models/cell";
import { Position } from "../models/position";
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
  if (target.type !== "unsolved") {
    return;
  }

  const existingValues = getExistingValues(board, row, col);
  const initCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9] as Digit[];
  return initCandidates.filter((c) => !existingValues.includes(c));
};

export const getBoardWithCandidates = (board: Board): Board => {
  return produce(board, (draft) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const target = draft.cells[row * 9 + col];
        if (target.type !== "unsolved") {
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

type CandidateCheck = {
  missing: { position: Position; value: Digit }[];
  redundant: { position: Position; value: Digit }[];
};

export const checkFullCandidates = (board: Board): CandidateCheck => {
  const result = {
    missing: [],
    redundant: [],
  } as CandidateCheck;
  const fullCandidatesBoard = getBoardWithCandidates(board);
  const unsolvedCells = getUnsolvedCells(board);
  unsolvedCells.forEach((cell) => {
    const { row, col } = cell.position;
    const answerCell = getCellAt(fullCandidatesBoard, row, col) as UnsolvedCell;
    const userCandidates = cell.candidates;
    const answerCandidates = answerCell.candidates;
    const missingCandidates = difference(answerCandidates, userCandidates);
    missingCandidates.forEach((value) => {
      result.missing.push({ position: cell.position, value });
    });
    const redundantCandidates = difference(userCandidates, answerCandidates);
    redundantCandidates.forEach((value) => {
      result.redundant.push({ position: cell.position, value });
    });
  });
  return result;
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
