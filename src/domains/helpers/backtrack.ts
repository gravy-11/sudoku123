import produce from "immer";
import { Board, getUnresolvedCells, getCellAt } from "../models/board";
import { getCandidatesAt, getCellCandidates } from "./solve";

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
    const sortedUnresolvedCells = produce(unresolvedCells, (draft) => {
      draft.sort((c1, c2) => {
        const c1Candidates = getCellCandidates(board, c1);
        const c2Candidates = getCellCandidates(board, c2);
        if (c1Candidates == null || c2Candidates == null) {
          return 0;
        }
        return c1Candidates.length - c2Candidates.length;
      });
    });

    const firstUnresolvedCell = sortedUnresolvedCells[0];
    const { row, col } = firstUnresolvedCell.position;
    const candidates = getCandidatesAt(board, row, col)!;
    if (candidates.length === 0) {
      return this.backward();
    }

    const nextBoard = produce(board, (draft) => {
      const cell = getCellAt(draft, row, col);
      cell.value = candidates[candidateIdx];
    });

    return this.forward(nextBoard, 0);
  }

  backward(): Board {
    const { board, candidateIdx } = this.logs.pop()!;
    const nextCandidateIdx = candidateIdx + 1;
    const unresolvedCells = getUnresolvedCells(board);
    const sortedUnresolvedCells = produce(unresolvedCells, (draft) => {
      draft.sort((c1, c2) => {
        const c1Candidates = getCellCandidates(board, c1);
        const c2Candidates = getCellCandidates(board, c2);
        if (c1Candidates == null || c2Candidates == null) {
          return 0;
        }
        return c1Candidates.length - c2Candidates.length;
      });
    });
    const firstUnresolvedCell = sortedUnresolvedCells[0];
    const { row, col } = firstUnresolvedCell.position;
    const candidates = getCandidatesAt(board, row, col)!;
    if (nextCandidateIdx < candidates.length) {
      return this.forward(board, nextCandidateIdx);
    }
    return this.backward();
  }
}
