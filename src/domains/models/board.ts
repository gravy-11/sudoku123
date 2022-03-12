import { createCell, Cell, WritableCell, Candidate, isInSameBox } from "./cell";

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

export const getUnresolvedCells = (board: Board) => {
  return board.cells.filter(
    (cell): cell is WritableCell => cell.writable && cell.value == null
  );
};
