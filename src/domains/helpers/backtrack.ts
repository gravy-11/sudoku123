import produce from "immer";
import { Board, getUnresolvedCells, getCellAt } from "../models/board";
import { Candidate } from "../models/cell";
import { checkAt, getCandidatesAt } from "./solve";
import { printBoard } from "./printer";

export class Backtrack {
  static count = 0;
  logs: { board: Board; candidateIdx: number }[];

  constructor() {
    this.logs = [];
  }

  solve(board: Board): Board {
    return this.forward(board, 0);
  }

  forward(board: Board, candidateIdx: number): Board {
    Backtrack.count++;
    this.logs.push({ board, candidateIdx });
    const unresolvedCells = getUnresolvedCells(board);
    if (unresolvedCells.length === 0) {
      return board;
    }

    const firstUnresolvedCell = unresolvedCells[0];
    const { row, col } = firstUnresolvedCell.position;
    const candidates = getCandidatesAt(board, row, col)!;
    if (candidates.length === 0) {
      return this.backward();
    }

    const nextBoard = produce(board, (draft) => {
      const cell = getCellAt(draft, row, col);
      cell.value = candidates[candidateIdx];
    });
    // console.log(Backtrack.count, candidateIdx);
    // printBoard(nextBoard);
    // if (Backtrack.count > 3400) {
    //   return board;
    // }

    return this.forward(nextBoard, 0);
  }

  backward(): Board {
    const { board, candidateIdx } = this.logs.pop()!;
    const nextCandidateIdx = candidateIdx + 1;
    const unresolvedCells = getUnresolvedCells(board);
    const firstUnresolvedCell = unresolvedCells[0];
    const { row, col } = firstUnresolvedCell.position;
    const candidates = getCandidatesAt(board, row, col)!;
    if (nextCandidateIdx < candidates.length) {
      return this.forward(board, nextCandidateIdx);
    }
    return this.backward();
  }
}
