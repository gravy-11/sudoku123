import produce from "immer";
import { Board, getUnsolvedCells, setCellAt } from "../models/board";
import { Digit, UnsolvedCell } from "../models/cell";
import { getCandidatesAt, getCellCandidates } from "./solve";

export class Backtracking {
  logs: {
    board: Board;
    candidateIdx: number;
    candidates: Digit[];
  }[];

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
    const sortedUnsolvedCells = this.getSortedUnsolvedCells(board);
    if (sortedUnsolvedCells.length === 0) {
      return board;
    }

    const firstUnsolvedCell = sortedUnsolvedCells[0];
    const { row, col } = firstUnsolvedCell.position;
    const candidates = getCandidatesAt(board, row, col)!;
    this.logs.push({ board, candidateIdx, candidates });
    if (candidates.length === 0) {
      return this.backward();
    }

    const nextBoard = produce(board, (draft) => {
      setCellAt(draft, row, col, candidates[candidateIdx]);
    });

    return this.forward(nextBoard, 0);
  }

  backward(): Board {
    const { board, candidateIdx, candidates } = this.logs.pop()!;
    const nextCandidateIdx = candidateIdx + 1;
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
