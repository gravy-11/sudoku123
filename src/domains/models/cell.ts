export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Position = {
  row: number;
  col: number;
};

type BaseCell = {
  position: Readonly<Position>;
};

export type GivenCell = BaseCell &
  Readonly<{
    type: "given";
    value: Digit;
  }>;

export type UnsolvedCell = BaseCell &
  Readonly<{
    type: "unsolved";
    candidates: Digit[];
  }>;

export type SolvedCell = BaseCell &
  Readonly<{
    type: "solved";
    value: Digit;
  }>;

export type FilledCell = GivenCell | SolvedCell;
export type Cell = FilledCell | UnsolvedCell;

export const createCell = (
  position: Position,
  value: Digit | 0
): UnsolvedCell | GivenCell => {
  if (value === 0) {
    return { type: "unsolved", position, candidates: [] };
  }
  return { type: "given", position, value };
};

export const isInSameBox = (cell: Cell, another: Cell) => {
  const { row: row1, col: col1 } = cell.position;
  const { row: row2, col: col2 } = another.position;
  return row1 === row2 && col1 === col2;
};
