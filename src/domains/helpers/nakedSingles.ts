import { Board, getUnsolvedCells } from "../models/board";
import { Digit } from "../models/cell";
import { Position } from "../models/position";

type NakedSingle = {
  position: Position;
  digit: Digit;
};

export const getHint = (board: Board): NakedSingle[] => {
  const unsolvedCells = getUnsolvedCells(board);
  const singleCandidateCells = unsolvedCells.filter((cell) => {
    return cell.candidates.length === 1;
  });
  return singleCandidateCells.map((cell) => {
    return {
      position: cell.position,
      digit: cell.candidates[0],
    };
  });
};
