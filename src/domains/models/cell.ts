export type Candidate = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Position = {
  row: number;
  col: number;
};

type BaseCell = {
  position: Readonly<Position>;
};

export type DefaultCell = BaseCell & {
  writable: false;
  value: Candidate;
};

export type WritableCell = BaseCell & {
  writable: true;
  value?: Candidate;
  candidates: Candidate[];
};

export type Cell = DefaultCell | WritableCell;

export const createCell = (position: Position, value: Candidate | 0) => {
  if (value === 0) {
    return { writable: true, position, candidates: [] } as WritableCell;
  }
  return { writable: false, position, value } as DefaultCell;
};

export const isInSameBox = (cell: Cell, another: Cell) => {
  const { row: row1, col: col1 } = cell.position;
  const { row: row2, col: col2 } = another.position;
  return row1 === row2 && col1 === col2;
};
