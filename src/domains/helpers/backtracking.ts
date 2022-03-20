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

  constructor() {
    this.logs = [];
  }

  solve(board: Board): Board {
    console.time("backtracking");
    const answer = this.forward(board, 0);
    if (answer == null) {
      throw new Error("This problem has no solutions.");
    }

    console.timeEnd("backtracking");
    return answer;
  }

  hasUniqueSolution(board: Board) {
    console.time("backtracking");
    const answers: Board[] = [];
    let nextBoard = board;
    let nextCandidateIdx = 0;

    while (true) {
      const answer =
        answers.length === 0
          ? this.forward(nextBoard, nextCandidateIdx)
          : this.backward();
      if (answer == null) break;
      answers.push(answer);

      if (answers.length > 1) break;
    }

    console.timeEnd("backtracking");
    return answers.length === 1;
  }

  forward(board: Board, candidateIdx: number): Board | null {
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
    // 効率化のために、手前にあるものをいくつか取ってソートする
    const unsolvedCells = getUnsolvedCells(board).slice(0, 27);
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
