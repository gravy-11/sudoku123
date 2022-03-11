export type Candidate = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Position = {
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

// export class Cell {
//   constructor(private position: Position, protected value: X) {}

//   static create(position: Position, value: X) {
//     if (value === 0) {
//       return new WritableCell(position, value);
//     }
//     return new Cell(position, value);
//   }

// toString(pencilMarks = false) {
//   if (pencilMarks) {
//     return this.value + "_" + " ".repeat(5);
//   }
//   return this.value === 0 ? "." : "" + this.value;
// }

//   getVal() {
//     return this.value;
//   }

//   getRow() {
//     return this.position[0];
//   }

//   getCol() {
//     return this.position[1];
//   }

//   getBox() {
//     return this.position.map((x) => Math.floor(x / 3)) as [number, number];
//   }

//   isInSameBox(cell: Cell) {
//     const [row1, col1] = this.getBox();
//     const [row2, col2] = cell.getBox();
//     return row1 === row2 && col1 === col2;
//   }

//   isWritable(this: Cell): this is WritableCell {
//     return this instanceof WritableCell;
//   }
// }

// export class WritableCell extends Cell {
//   private candidates: Set<X>;

//   constructor(position: Position, value: X) {
//     super(position, value);
//     this.candidates = new Set();
//   }

// toString(pencilMarks = false): string {
//   if (pencilMarks && this.value === 0) {
//     return (this.getCandidates().join("") + " ".repeat(7)).slice(0, 7);
//   }
//   return super.toString(pencilMarks);
// }

//   setVal(value: X) {
//     this.value = value;
//   }

//   addCandidate(value: X) {
//     this.candidates.add(value);
//   }

//   removeCandidate(value: X) {
//     this.candidates.delete(value);
//   }

//   getCandidates() {
//     return Array.from(this.candidates).sort();
//   }

//   setCandidates(values: X[]) {
//     values.forEach((val) => this.addCandidate(val));
//   }
// }
