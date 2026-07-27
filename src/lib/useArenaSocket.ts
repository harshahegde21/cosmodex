import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface QueueData {
  size: number;
}

interface MatchFoundData {
  roomId: string;
  opponentId: string;
  opponentUsername: string;
  mode: string;
}

interface SubmissionResultData {
  status: string;
  passedCount: number;
  totalCount: number;
  pointsAwarded: number;
  livesRemaining: number;
  testCases?: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    isPublic: boolean;
  }[];
}

interface RunResultData {
  stdout: string;
  stderr: string;
  timedOut: boolean;
}

interface GameStateData {
  currentStage: number;
  stageTimeRemaining: number;
  problems: string[];
  playerIds: string[];
  players: Record<
    string,
    {
      username: string;
      currentStage: number;
      status: string;
      lives: number;
      points: number;
      submissionsCount: number;
      stageTimeRemaining?: number;
      currentDraft?: string;
    }
  >;
}

interface StageAdvancedData {
  reason: string;
}

interface MatchEndedData {
  winnerId: string | null;
  reason: string;
}

interface SocketError {
  message: string;
}

export function useArenaSocket(token: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [queueState, setQueueState] = useState<{ status: string; size: number } | null>(null);
  const [matchData, setMatchData] = useState<MatchFoundData | null>(null);
  const [gameState, setGameState] = useState<GameStateData | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResultData | null>(null);
  const [runResult, setRunResult] = useState<RunResultData | null>(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState<{ time: number } | null>(null);
  const [opponentCompleted, setOpponentCompleted] = useState<{ time: number } | null>(null);
  const [matchEnded, setMatchEnded] = useState<MatchEndedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ msg: string; type: string } | null>(null);

  useEffect(() => {
    if (!token) return;

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    const newSocket = io(BACKEND_URL, { auth: { token } });
    socketRef.current = newSocket;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    newSocket.on("queue_joined", (d: QueueData) => {
      setQueueState({ status: "joined", size: d.size });
    });

    newSocket.on("queue_pulse", (d: QueueData) => {
      setQueueState((prev) => (prev ? { ...prev, size: d.size } : null));
    });

    newSocket.on("match_found", (d: MatchFoundData) => {
      setMatchData(d);
      setQueueState(null);
    });

    newSocket.on("room_state_update", (state: GameStateData) => {
      setGameState(state);
    });

    newSocket.on("submission_result", (r: SubmissionResultData) => {
      setSubmissionResult(r);
      if (r.status === "ACCEPTED") {
        setToastMessage({ msg: "You solved it! ✅ Waiting for opponent…", type: "ok" });
      } else {
        const livesLeft = r.livesRemaining;
        if (livesLeft === 0) {
          setToastMessage({ msg: "Eliminated! 💀", type: "err" });
        } else {
          setToastMessage({ msg: `Wrong — ${livesLeft} lives left`, type: "warn" });
        }
      }
    });

    newSocket.on("run_result", (r: RunResultData) => {
      setRunResult(r);
    });

    newSocket.on("waiting_for_opponent", (d: { decisionTimeRemaining?: number }) => {
      setWaitingForOpponent({ time: d.decisionTimeRemaining ?? 15 });
    });

    newSocket.on("opponent_completed_stage", (d: { decisionTimeRemaining?: number }) => {
      setOpponentCompleted({ time: d.decisionTimeRemaining ?? 15 });
      setToastMessage({ msg: "Opponent solved it — decide now!", type: "warn" });
    });

    newSocket.on("stage_advanced", (d: StageAdvancedData) => {
      setWaitingForOpponent(null);
      setOpponentCompleted(null);
      setToastMessage({
        msg:
          d.reason === "opponent_timed_out"
            ? "Opponent timed out — moving to next stage!"
            : d.reason === "opponent_skipped"
            ? "Opponent skipped — both advancing!"
            : "Opponent chose to stay — moving on!",
        type: "ok",
      });
    });

    newSocket.on("match_ended", (d: MatchEndedData) => {
      setWaitingForOpponent(null);
      setOpponentCompleted(null);
      setMatchEnded(d);
    });

    newSocket.on("error", (e: SocketError) => {
      setError(e.message);
      setToastMessage({ msg: e.message, type: "err" });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  return {
    socket,
    queueState,
    matchData,
    gameState,
    submissionResult,
    runResult,
    waitingForOpponent,
    opponentCompleted,
    matchEnded,
    error,
    toastMessage,
    clearToast: () => setToastMessage(null),
    clearSubmissionResult: () => setSubmissionResult(null),
    clearMatchEnded: () => setMatchEnded(null),
    setMatchData,
  };
}
