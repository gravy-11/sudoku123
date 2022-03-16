import { countBy } from "lodash-es";

export type Position = {
  row: number;
  col: number;
};

export const inSameRow = (p1: Position, p2: Position) => p1.row === p2.row;

export const inSameCol = (p1: Position, p2: Position) => p1.col === p2.col;

export const isSame = (p1: Position, p2: Position) => {
  return inSameRow(p1, p2) && inSameCol(p1, p2);
};

const chute = (num: number) => Math.floor(num / 3);
const floor = (position: Position) => chute(position.row);
const tower = (position: Position) => chute(position.col);
const box = (position: Position) => floor(position) * 3 + tower(position);

export const inSameFloor = (p1: Position, p2: Position) => {
  return floor(p1) === floor(p2);
};

export const inSameTower = (p1: Position, p2: Position) => {
  return tower(p1) === tower(p2);
};

export const inSameBox = (p1: Position, p2: Position) => {
  return inSameFloor(p1, p2) && inSameTower(p1, p2);
};

export const rowSingleDigit = (positions: Position[]) => {
  const rows = positions.map((p) => p.row);
  const table = countBy(rows);
  return positions.filter((p) => table[p.row] === 1);
};

export const colSingleDigit = (positions: Position[]) => {
  const cols = positions.map((p) => p.col);
  const table = countBy(cols);
  return positions.filter((p) => table[p.col] === 1);
};

export const boxSingleDigit = (positions: Position[]) => {
  const boxes = positions.map((p) => box(p));
  const table = countBy(boxes);
  return positions.filter((p) => table[box(p)] === 1);
};
