import {
  createCell,
  Cell,
  UnsolvedCell,
  Digit,
  isInSameBox,
  FilledCell,
} from "./cell";
import { Position } from "./position";

export type Board = {
  readonly cells: Cell[];
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
    return createCell(position, +s as Digit | 0);
  });
  return { cells };
};

export const outputBoard = (board: Board): string => {
  return board.cells.map((c) => (c.type === "unsolved" ? 0 : c.value)).join("");
};

export const getCellAt = (board: Board, row: number, col: number) => {
  return board.cells[row * 9 + col];
};

export const setCellAt = (
  board: Board,
  row: number,
  col: number,
  value: Digit
) => {
  board.cells[row * 9 + col] = {
    type: "solved",
    position: { row, col },
    value,
  };
};

const cellIsFilled = (cell: Cell): cell is FilledCell => {
  return cell.type !== "unsolved";
};

export const getRowValues = (board: Board, row: number) => {
  return board.cells
    .filter((cell) => cell.position.row === row)
    .filter(cellIsFilled)
    .map((cell) => cell.value);
};

export const getColValues = (board: Board, col: number) => {
  return board.cells
    .filter((cell) => cell.position.col === col)
    .filter(cellIsFilled)
    .map((cell) => cell.value);
};

export const getBoxValues = (board: Board, row: number, col: number) => {
  const target = getCellAt(board, row, col);
  return board.cells
    .filter((cell) => isInSameBox(cell, target))
    .filter(cellIsFilled)
    .map((cell) => cell.value);
};

export const digitCount = (houseDigit: Digit[]) => {};

const cellIsUnsolved = (cell: Cell): cell is UnsolvedCell => {
  return cell.type === "unsolved";
};

export const getUnsolvedCells = (board: Board) => {
  return board.cells.filter(cellIsUnsolved);
};

export const getCandidatePositions = (
  board: Board,
  digit: Digit
): Position[] => {
  const unsolvedCells = getUnsolvedCells(board);
  return unsolvedCells
    .filter((cell) => cell.candidates.includes(digit))
    .map((cell) => cell.position);
};
