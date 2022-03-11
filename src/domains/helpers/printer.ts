import { Board, getCellAt } from "../models/board";
import { Cell } from "../models/cell";

const getLine = (end: string, middle: string, pencilMarks = false) => {
  let barCount = 5;
  if (pencilMarks) {
    barCount = 24;
  }
  const line = "-".repeat(barCount);
  return end + line + middle + line + middle + line + end + "\n";
};

const getTopBorder = (pencilMarks = false) => {
  return getLine(".", ".", pencilMarks);
};

const getSeparator = (pencilMarks = false) => {
  return getLine(":", " ", pencilMarks);
};

const getBottomBorder = (pencilMarks = false) => {
  return getLine("'", "'", pencilMarks);
};

const getCellString = (cell: Cell, pencilMarks = false) => {
  if (!pencilMarks) {
    return cell.value == null ? "." : "" + cell.value;
  }

  if (cell.writable) {
    return (cell.candidates.join("") + " ".repeat(7)).slice(0, 7);
  }
  return cell.value + "_" + " ".repeat(5);
};

const getRowString = (board: Board, row: number, pencilMarks = false) => {
  let result = "";
  for (let col = 0; col < 9; col++) {
    let preposition = col % 3 === 0 ? "|" : " ";
    if (pencilMarks) {
      preposition = col % 3 === 0 ? "| " : " ";
    }
    const cell = getCellAt(board, row, col);
    result += preposition + getCellString(cell, pencilMarks);
  }
  result += "|\n";
  return result;
};

export const printBoard = (board: Board, pencilMarks = false): void => {
  let result = "";
  for (let row = 0; row < 9; row++) {
    if (row === 0) result += getTopBorder(pencilMarks);
    if (row === 3 || row === 6) result += getSeparator(pencilMarks);
    result += getRowString(board, row, pencilMarks);
  }
  result += getBottomBorder(pencilMarks);
  console.log(result);
};
