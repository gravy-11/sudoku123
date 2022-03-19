import produce from "immer";
import { Board, getUnsolvedCells, setCellAt } from "../models/board";
import { Digit, UnsolvedCell } from "../models/cell";
import { getCandidatesAt, getCellCandidates } from "./solve";

type Log = {
  board: Board;
  candidateIdx: number;
  candidates: Digit[];
};

export class Backtracking {
  private logs: Log[];
  private answers: Board[];

  constructor() {
    this.logs = [];
    this.answers = [];
  }

  solve(board: Board, uniqueCheck?: false): Board;
  solve(board: Board, uniqueCheck: true): Board[];
  solve(board: Board, uniqueCheck = false): Board | Board[] {
    console.time("backtracking");
    let nextBoard = board;
    let nextCandidateIdx = 0;

    while (true) {
      const answer =
        this.answers.length === 0
          ? this.forward(nextBoard, nextCandidateIdx)
          : this.backward();
      if (answer == null) break;
      this.answers.push(answer);

      if (!uniqueCheck) {
        break;
      }
    }

    console.timeEnd("backtracking");
    if (uniqueCheck) {
      return this.answers;
    }
    return this.answers[0];
  }

  forward(board: Board, candidateIdx: number): Board | null {
    const sortedUnsolvedCells = this.getSortedUnsolvedCells(board);

    if (sortedUnsolvedCells.length === 0) {
      // board フルで埋まってる
      // candidateIdx 0
      // logsの最後は1つだけ空いているboard candidateIdx = 0
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

  backward(): Board | null {
    const log = this.logs.pop();
    if (log == null) return null;
    const { board, candidateIdx, candidates } = log;
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
