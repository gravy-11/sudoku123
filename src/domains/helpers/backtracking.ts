import produce from "immer";
import { Board, getUnsolvedCells, getCellAt } from "../models/board";
import { getCandidatesAt, getCellCandidates } from "./solve";

export class Backtracking {
  logs: { board: Board; candidateIdx: number }[];

  constructor() {
    this.logs = [];
  }

  solve(board: Board): Board {
    console.time("backtracking");
    const answer = this.forward(board, 0);
    console.timeEnd("backtracking");
    return answer;
  }

  forward(board: Board, candidateIdx: number): Board {
    this.logs.push({ board, candidateIdx });
    const sortedUnsolvedCells = this.getSortedUnsolvedCells(board);
    if (sortedUnsolvedCells.length === 0) {
      return board;
    }

    const firstUnsolvedCell = sortedUnsolvedCells[0];
    const { row, col } = firstUnsolvedCell.position;
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
    const firstUnsolvedCell = this.getSortedUnsolvedCells(board)[0];
    const { row, col } = firstUnsolvedCell.position;
    const candidates = getCandidatesAt(board, row, col)!;
    if (nextCandidateIdx < candidates.length) {
      return this.forward(board, nextCandidateIdx);
    }
    return this.backward();
  }

  getSortedUnsolvedCells(board: Board) {
    const unsolvedCells = getUnsolvedCells(board);
    return produce(unsolvedCells, (draft) => {
      draft.sort((c1, c2) => {
        const c1Candidates = getCellCandidates(board, c1);
        const c2Candidates = getCellCandidates(board, c2);
        if (c1Candidates == null || c2Candidates == null) {
          return 0;
        }
        return c1Candidates.length - c2Candidates.length;
      });
    });
  }
}
