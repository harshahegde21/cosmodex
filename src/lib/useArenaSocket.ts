import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useArenaSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [queueState, setQueueState] = useState<{ status: string; size: number } | null>(null);
  const [matchData, setMatchData] = useState<any>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [runResult, setRunResult] = useState<any>(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState<{ time: number } | null>(null);
  const [opponentCompleted, setOpponentCompleted] = useState<{ time: number } | null>(null);
  const [matchEnded, setMatchEnded] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ msg: string; type: string } | null>(null);

  useEffect(() => {
    if (!token) return;

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    const newSocket = io(BACKEND_URL, { auth: { token } });
    setSocket(newSocket);

    newSocket.on("queue_joined", (d: any) => {
      setQueueState({ status: "joined", size: d.size });
    });

    newSocket.on("queue_pulse", (d: any) => {
      setQueueState((prev) => (prev ? { ...prev, size: d.size } : null));
    });

    newSocket.on("match_found", (d: any) => {
      setMatchData(d);
      setQueueState(null);
    });

    newSocket.on("room_state_update", (state: any) => {
      setGameState(state);
    });

    newSocket.on("submission_result", (r: any) => {
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

    newSocket.on("run_result", (r: any) => {
      setRunResult(r);
    });

    newSocket.on("waiting_for_opponent", (d: any) => {
      setWaitingForOpponent({ time: d.decisionTimeRemaining ?? 15 });
    });

    newSocket.on("opponent_completed_stage", (d: any) => {
      setOpponentCompleted({ time: d.decisionTimeRemaining ?? 15 });
      setToastMessage({ msg: "Opponent solved it — decide now!", type: "warn" });
    });

    newSocket.on("stage_advanced", (d: any) => {
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

    newSocket.on("match_ended", (d: any) => {
      setWaitingForOpponent(null);
      setOpponentCompleted(null);
      setMatchEnded(d);
    });

    newSocket.on("error", (e: any) => {
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
