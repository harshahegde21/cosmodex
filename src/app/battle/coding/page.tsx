"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import { useArenaSocket } from "@/lib/useArenaSocket";

const STARTERS: Record<string, string> = {
  python: "# Write your solution here\n",
  javascript:
    'const lines = require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");\n\n// Write your solution here\n',
  java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // Write your solution here\n  }\n}',
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  // Write your solution here\n  return 0;\n}",
};

const AVATARS = ["🥷", "🧙", "🧑‍💻", "👾", "🤖", "🦸", "⚡", "🔥", "🐉", "🦊"];
function getAvatar(name: string) {
  return AVATARS[(name || "?").charCodeAt(0) % AVATARS.length];
}

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  basePoints: number;
  testCases: { id: string; input: string; expected: string; isPublic: boolean }[];
}

interface UserData {
  id: string;
  username: string;
  eloRating: number;
  token: string;
}


export default function BattleCodingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-base flex items-center justify-center">
          <div className="text-text-muted text-sm font-mono">Loading arena…</div>
        </div>
      }
    >
      <BattleCodingContent />
    </Suspense>
  );
}


function BattleCodingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [user, setUser] = useState<UserData | null>(null);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [curProblem, setCurProblem] = useState<Problem | null>(null);

  const [code, setCode] = useState("");
  const [lang, setLang] = useState("python");
  const [customStdin, setCustomStdin] = useState("");
  const [showStdin, setShowStdin] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [decTimer, setDecTimer] = useState(0);
  const [waitTimer, setWaitTimer] = useState(0);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  const [leftWidth, setLeftWidth] = useState(40);
  const isDragging = useRef(false);

  const {
    socket,
    gameState,
    submissionResult,
    runResult,
    waitingForOpponent,
    opponentCompleted,
    matchEnded,
    toastMessage,
    clearToast,
    clearSubmissionResult,
    clearMatchEnded,
  } = useArenaSocket(user?.token || null);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("cosmodex_token");
      const savedUser = JSON.parse(localStorage.getItem("cosmodex_user") || "null");

      if (!savedToken || !savedUser) {
        router.replace("/");
        return;
      }

      setUser({ ...savedUser, token: savedToken });

      fetch("/api/users/me", { headers: { Authorization: `Bearer ${savedToken}` } })
        .then((r) => {
          if (!r.ok) throw new Error();
        })
        .catch(() => {
          localStorage.removeItem("cosmodex_token");
          localStorage.removeItem("cosmodex_user");
          router.replace("/");
        });
    } catch {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (!roomId) {
      router.replace("/");
    }
  }, [roomId, router]);

  useEffect(() => {
    fetch("/api/problems")
      .then((r) => r.json())
      .then((d) => setAllProblems(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (socket && user && roomId) {
      socket.emit("join_room", { roomId, userId: user.id });
    }
  }, [socket, user, roomId]);

  useEffect(() => {
    if (gameState && allProblems.length > 0 && user) {
      const me = gameState.players[user.id];
      const myStage = me?.currentStage ?? gameState.currentStage;
      const pid = gameState.problems?.[myStage - 1];
      const prob = allProblems.find((p: Problem) => p.id === pid);

      if (prob && prob.id !== curProblem?.id) {
        setCurProblem(prob);
        clearSubmissionResult();
      }
    }
  }, [gameState, allProblems, user, curProblem, clearSubmissionResult]);

  useEffect(() => {
    if (curProblem && !code) {
      setCode(STARTERS[lang] || "");
    }
  }, [curProblem, lang, code]);

  useEffect(() => {
    if (submissionResult) setSubmitting(false);
  }, [submissionResult]);

  useEffect(() => {
    if (runResult) setRunning(false);
  }, [runResult]);

  useEffect(() => {
    if (toastMessage) {
      setToast(toastMessage);
      const id = setTimeout(() => {
        setToast(null);
        clearToast();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [toastMessage, clearToast]);

  useEffect(() => {
    if (waitingForOpponent) {
      setWaitTimer(waitingForOpponent.time);
      const iv = setInterval(() => {
        setWaitTimer((t: number) => {
          if (t <= 1) {
            clearInterval(iv);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(iv);
    }
  }, [waitingForOpponent]);

  useEffect(() => {
    if (opponentCompleted) {
      setDecTimer(opponentCompleted.time);
      const iv = setInterval(() => {
        setDecTimer((t: number) => {
          if (t <= 1) {
            clearInterval(iv);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(iv);
    }
  }, [opponentCompleted]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "default";
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startDrag = () => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
  };

  const showToast = useCallback((msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const hearts = (n: number, max = 5) =>
    Array.from({ length: max }, (_, i) => (
      <span key={i} className={`h ${i < n ? "" : "dead"}`}>
        ❤
      </span>
    ));

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLang(newLang);
    setCode(STARTERS[newLang] || "");
  };

  const runCode = () => {
    if (running || !code) return;
    setRunning(true);
    socket?.emit("run_code", { code, language: lang, stdin: customStdin });
  };

  const submitCode = () => {
    if (submitting || !curProblem) return;
    setSubmitting(true);
    clearSubmissionResult();
    socket?.emit("submit_code", {
      roomId,
      userId: user?.id,
      problemId: curProblem.id,
      code,
      language: lang,
    });
  };

  const decide = (choice: "skip" | "stay") => {
    socket?.emit("decide_skip_stay", { roomId, userId: user?.id, choice });
  };

  const redeem = () => {
    socket?.emit("redeem_life", { roomId, userId: user?.id });
  };

  const me = gameState?.players?.[user?.id || ""];
  const oppId = gameState?.playerIds?.find((id: string) => id !== user?.id);
  const opp = gameState?.players?.[oppId || ""];
  const myStage = me?.currentStage ?? gameState?.currentStage;
  const isBoss = myStage === 6;
  const myTimeRemaining = isBoss
    ? gameState?.stageTimeRemaining
    : (me?.stageTimeRemaining ?? gameState?.stageTimeRemaining);
  const inDecision = me?.status === "WAITING_DECISION";
  const isWaiting = me?.status === "DONE";
  const isElim = me?.status === "ELIMINATED";

  if (!user || !roomId) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-text-muted text-sm font-mono">Redirecting…</div>
      </div>
    );
  }


  if (matchEnded) {
    const won = matchEnded.winnerId === user.id;
    const draw = !matchEnded.winnerId;
    return (
      <div className="relative min-h-screen bg-bg-base text-text-primary flex flex-col font-fira overflow-hidden">
        <Navbar />
        <div className="flex flex-col items-center justify-center gap-6 pt-16 flex-1 relative z-10 px-5 text-center">
          <div className="text-[80px] animate-[pop_0.6s_ease]">
            {draw ? "🤝" : won ? "🏆" : "💀"}
          </div>
          <div
            className={`text-4xl font-black tracking-widest ${draw
                ? "text-[#F5C842]"
                : won
                  ? "text-[#3DCB7F]"
                  : "text-[#E85D5D]"
              }`}
          >
            {draw ? "DRAW" : won ? "VICTORY" : "DEFEATED"}
          </div>
          <div className="text-sm text-text-secondary max-w-[400px] leading-relaxed">
            {draw
              ? "Both fighters competed hard. The battle ends in a draw."
              : won
                ? "You defeated your opponent! Your ELO has been updated."
                : "Your opponent won this battle. Keep practicing!"}
          </div>
          <div className="flex gap-4 flex-wrap justify-center mt-2">
            <div className="cosmo-glass-panel p-5 px-7 min-w-[120px] shadow-lg text-center">
              <div className="text-3xl font-black text-white">{me?.points || 0}</div>
              <div className="text-[10px] text-text-muted mt-1.5 uppercase tracking-wide font-bold">
                Points
              </div>
            </div>
            <div className="cosmo-glass-panel p-5 px-7 min-w-[120px] shadow-lg text-center">
              <div className="text-3xl font-black text-white">{me?.lives || 0}</div>
              <div className="text-[10px] text-text-muted mt-1.5 uppercase tracking-wide font-bold">
                Lives Left
              </div>
            </div>
            <div className="cosmo-glass-panel p-5 px-7 min-w-[120px] shadow-lg text-center">
              <div className="text-3xl font-black text-white">
                {me?.submissionsCount || 0}
              </div>
              <div className="text-[10px] text-text-muted mt-1.5 uppercase tracking-wide font-bold">
                Submissions
              </div>
            </div>
          </div>
          <button
            className="cosmo-btn-primary mt-4 px-10 py-3.5 text-[15px]"
            onClick={() => {
              clearMatchEnded();
              router.push("/");
            }}
          >
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="relative min-h-screen bg-bg-base text-text-primary flex flex-col font-fira overflow-hidden arena-active">
      <Navbar />

      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-[#13111C]/95 backdrop-blur-md border z-[9999] transition-all duration-300 font-bold shadow-lg ${toast ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"
          } ${toast?.type === "ok"
            ? "border-[#3DCB7F] text-[#3DCB7F]"
            : toast?.type === "err"
              ? "border-[#E85D5D] text-[#E85D5D]"
              : "border-[#F5A623] text-[#F5A623]"
          }`}
      >
        {toast?.msg}
      </div>

      <div className="arena-game-wrapper">
        <div className="arena-topbar">
          <div className="arena-topbar-left">
            <span className={`arena-stage-badge ${isBoss ? "boss" : ""}`}>
              {isBoss ? "⚔ BOSS" : `Stage ${myStage ?? "?"} / 6`}
            </span>
            <span className="arena-problem-title">
              {curProblem?.title || "Loading..."}
            </span>
          </div>
          <div className="arena-topbar-right">
            {submissionResult?.status === "ACCEPTED" && (
              <span className="arena-solved-badge">
                ✅ Solved! Waiting for opponent…
              </span>
            )}
            <span
              className={`arena-timer ${(myTimeRemaining || 0) <= 10
                  ? "danger"
                  : (myTimeRemaining || 0) <= 30
                    ? "warning"
                    : ""
                }`}
            >
              ⏱ {fmt(myTimeRemaining || 0)}
            </span>
          </div>
        </div>

        <div className="arena-main" style={{ display: "flex", flexDirection: "row" }}>
          <div
            className="arena-left flex flex-col min-w-0"
            style={{ width: `${leftWidth}%` }}
          >
            <div className="arena-problem-panel flex-1 bg-[#0d0a14] border border-white/5 rounded-xl p-8 relative overflow-y-auto mb-4 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[#A78BFA] font-bold tracking-widest uppercase text-sm">
                  Exercise
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#3DCB7F] border-2 border-[#0d0a14] flex items-center justify-center text-[8px] font-bold text-black">
                      A
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#F5C842] border-2 border-[#0d0a14] flex items-center justify-center text-[8px] font-bold text-black">
                      B
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#E85D5D] border-2 border-[#0d0a14] flex items-center justify-center text-[8px] font-bold text-white">
                      C
                    </div>
                  </div>
                  <span className="text-xs text-text-muted font-medium">
                    +42 also tinkering
                  </span>
                </div>
              </div>

              <h2 className="text-[42px] leading-none font-black font-lato text-white tracking-wide uppercase mb-6 drop-shadow-md">
                {String(myStage ?? 1).padStart(2, "0")}. {curProblem?.title}
              </h2>

              <div className="mb-6 flex items-center">
                <h3
                  className={`text-2xl font-bold ${curProblem?.difficulty === "EASY"
                      ? "text-[#3DCB7F]"
                      : curProblem?.difficulty === "MEDIUM"
                        ? "text-[#F5C842]"
                        : "text-[#E85D5D]"
                    }`}
                >
                  # {curProblem?.difficulty}
                </h3>
                <span className="ml-3 text-2xl">👾</span>
              </div>

              <div className="text-[#A1A1AA] leading-relaxed text-[15px] space-y-4 mb-8">
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {curProblem?.description}
                </div>
              </div>

              <div className="space-y-4 relative z-10 mt-auto">
                {curProblem?.testCases
                  ?.filter((tc: { isPublic: boolean }) => tc.isPublic)
                  .map((tc: { id: string; input: string; expected: string; isPublic: boolean }, i: number) => (
                    <div
                      key={tc.id || i}
                      className="arena-example bg-black/50 border border-white/5 rounded-xl p-5"
                    >
                      <div className="arena-example-label text-[11px] font-bold text-[#A78BFA] mb-3 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                        Example {i + 1}
                      </div>
                      <div className="arena-example-row font-mono text-sm mb-2 flex gap-3 items-start">
                        <span className="arena-example-key text-text-muted select-none mt-1">
                          Input:
                        </span>
                        <code className="arena-example-val text-white bg-white/5 px-2 py-1 rounded border border-white/10 break-all">
                          {tc.input}
                        </code>
                      </div>
                      <div className="arena-example-row font-mono text-sm flex gap-3 items-start">
                        <span className="arena-example-key text-text-muted select-none mt-1">
                          Output:
                        </span>
                        <code className="arena-example-val text-[#3DCB7F] bg-[#3DCB7F]/10 border border-[#3DCB7F]/20 px-2 py-1 rounded break-all">
                          {tc.expected}
                        </code>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="arena-players-section mt-2">
              <div className="arena-players-title text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">
                Players
              </div>

              {me && (
                <div className="arena-player-card you">
                  <span className="arena-player-avi">
                    {getAvatar(user.username)}
                  </span>
                  <div className="arena-player-info">
                    <span className="arena-player-name">
                      {user.username}{" "}
                      <span className="arena-you-tag">(you)</span>
                    </span>
                    <div className="arena-player-meta flex items-center gap-3">
                      <span className="arena-player-stage bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-widest">
                        Stage {me.currentStage}
                      </span>
                      <span className="arena-player-hearts">{hearts(me.lives)}</span>
                      <span className="arena-player-pts text-[#F5C842] font-black text-sm">
                        🌟 {me.points} XP
                      </span>
                      <span
                        className={`arena-player-status ${me.status
                          .toLowerCase()
                          .replace("_", "-")} text-[10px] font-bold tracking-widest uppercase ml-auto`}
                      >
                        {me.status === "CODING"
                          ? "CODING"
                          : me.status === "DONE"
                            ? "DONE"
                            : me.status === "STAYING"
                              ? "STAYING"
                              : me.status === "WAITING_DECISION"
                                ? "DECIDING"
                                : me.status === "ELIMINATED"
                                  ? "ELIMINATED"
                                  : me.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {opp && (
                <div className="arena-player-card bg-[#1C1929] border border-white/5 rounded-xl p-4 flex gap-4 items-center">
                  <span className="arena-player-avi text-4xl bg-black/40 rounded-full w-12 h-12 flex items-center justify-center">
                    {getAvatar(opp.username)}
                  </span>
                  <div className="arena-player-info flex-1">
                    <span className="arena-player-name text-sm font-bold text-white block mb-1">
                      {opp.username}
                    </span>
                    <div className="arena-player-meta flex items-center gap-3">
                      <span className="arena-player-stage bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-widest">
                        Stage {opp.currentStage}
                      </span>
                      <span className="arena-player-hearts">{hearts(opp.lives)}</span>
                      <span className="arena-player-pts text-[#F5C842] font-black text-sm">
                        🌟 {opp.points} XP
                      </span>
                      <span
                        className={`arena-player-status ${opp.status
                          .toLowerCase()
                          .replace("_", "-")} text-[10px] font-bold tracking-widest uppercase ml-auto`}
                      >
                        {opp.status === "CODING"
                          ? "CODING"
                          : opp.status === "DONE"
                            ? "DONE"
                            : opp.status === "STAYING"
                              ? "STAYING"
                              : opp.status === "WAITING_DECISION"
                                ? "DECIDING"
                                : opp.status === "ELIMINATED"
                                  ? "ELIMINATED"
                                  : opp.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="w-2 cursor-col-resize hover:bg-accent/30 transition-colors z-20 flex items-center justify-center shrink-0 group"
            onMouseDown={startDrag}
          >
            <div className="w-0.5 h-12 bg-white/10 group-hover:bg-accent/50 rounded-full transition-colors" />
          </div>

          <div
            className="arena-right flex flex-col flex-1 min-w-0"
            style={{ width: `${100 - leftWidth}%` }}
          >
            <div className="arena-editor-toolbar">
              <div className="arena-editor-toolbar-left">
                <span className="arena-editor-icon">📝</span>
                <span className="arena-editor-label">Editor</span>
                <select
                  className="arena-lang-select"
                  value={lang}
                  onChange={handleLangChange}
                >
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <span className="arena-char-count">{code.length} chars</span>
            </div>

            <textarea
              className="arena-code-editor flex-1 w-full"
              placeholder="# Write your solution here..."
              value={code}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
              spellCheck={false}
            />

            <div className="arena-actions-bar">
              <div className="arena-actions-left">
                {inDecision && (
                  <>
                    <button
                      className="arena-btn-skip"
                      onClick={() => decide("skip")}
                    >
                      ⏭ Skip (−1 life)
                    </button>
                    <button
                      className="arena-btn-stay"
                      onClick={() => decide("stay")}
                    >
                      ✋ Stay & Solve
                    </button>
                  </>
                )}
                {isBoss && (me?.points || 0) >= 100 && (
                  <button className="arena-btn-redeem" onClick={redeem}>
                    ❤️ Redeem Life (100pt)
                  </button>
                )}
              </div>
              <div className="arena-actions-right">
                {!inDecision && (
                  <>
                    <button
                      className="arena-btn-run"
                      onClick={runCode}
                      disabled={running || isElim}
                    >
                      {running ? "⏳ Running..." : "▶ Run"}
                    </button>
                    <button
                      className="arena-btn-submit"
                      onClick={submitCode}
                      disabled={submitting || isWaiting || isElim}
                    >
                      {submitting ? "⏳ Judging..." : "⚡ Submit"}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="arena-stdin-section">
              <div
                className="arena-stdin-toggle"
                onClick={() => setShowStdin(!showStdin)}
              >
                <span>{showStdin ? "▲" : "▼"} Custom Input</span>
              </div>
              {showStdin && (
                <textarea
                  className="arena-stdin-input"
                  placeholder="Enter custom input to pass to stdin..."
                  value={customStdin}
                  onChange={(e) => setCustomStdin(e.target.value)}
                  spellCheck={false}
                />
              )}
            </div>

            <div className="arena-output-section">
              <div className="arena-output-header">
                <span className="arena-output-label">Terminal</span>
                {runResult && !submissionResult && (
                  <span
                    className={`arena-output-status ${runResult.timedOut || runResult.stderr ? "error" : "success"
                      }`}
                  >
                    {runResult.timedOut
                      ? "⏱ TLE"
                      : runResult.stderr
                        ? "❌ Error"
                        : "✓ Success"}
                  </span>
                )}
                {submissionResult && (
                  <span
                    className={`arena-output-status ${submissionResult.status === "ACCEPTED" ? "success" : "error"
                      }`}
                  >
                    {submissionResult.status === "ACCEPTED"
                      ? `✅ ACCEPTED ${submissionResult.passedCount}/${submissionResult.totalCount}`
                      : `❌ ${submissionResult.status.replace(/_/g, " ")} ${submissionResult.passedCount}/${submissionResult.totalCount}`}
                  </span>
                )}
              </div>
              <div
                className={`arena-output-body ${submissionResult
                    ? submissionResult.status === "ACCEPTED"
                      ? "success"
                      : "error"
                    : runResult
                      ? runResult.timedOut || runResult.stderr
                        ? "warn"
                        : "success"
                      : ""
                  }`}
              >
                {submissionResult
                  ? submissionResult.status === "ACCEPTED"
                    ? `All ${submissionResult.passedCount} test cases passed! +${submissionResult.pointsAwarded} points\n` +
                    (submissionResult.testCases
                      ?.filter((tc: { isPublic: boolean }) => tc.isPublic)
                      .map(
                        (tc: { input: string; expected: string }, i: number) =>
                          `\nTest ${i + 1} ✓  Input: ${tc.input}   Expected: ${tc.expected}`
                      )
                      .join("") || "")
                    : `${submissionResult.status.replace(/_/g, " ")}  —  ${submissionResult.livesRemaining} lives remaining\n` +
                    (submissionResult.testCases
                      ?.filter((tc: { isPublic: boolean }) => tc.isPublic)
                      .map(
                        (
                          tc: {
                            input: string;
                            expected: string;
                            actual: string;
                            passed: boolean;
                          },
                          i: number
                        ) =>
                          `\nTest ${i + 1} ${tc.passed ? "✓" : "✗"}  Input: ${tc.input}   Expected: ${tc.expected}   Got: ${tc.actual}`
                      )
                      .join("") || "")
                  : runResult
                    ? runResult.timedOut
                      ? "Your code took too long to execute (Time limit: 5s)."
                      : runResult.stderr ||
                      runResult.stdout ||
                      "(No output produced)"
                    : "Click Run to view your results"}
              </div>
            </div>
          </div>
        </div>

        <div className="arena-bottom-bar">
          <div className="arena-bottom-left">
            <div className="flex items-center gap-2 bg-[#F5C842]/10 px-3 py-1 rounded-full border border-[#F5C842]/30">
              <span className="text-[#F5C842] text-sm">🌟</span>
              <span className="text-[#F5C842] font-black text-sm tracking-widest">
                {me?.points || 0} XP
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="arena-bottom-title font-bold text-white text-sm">
              {curProblem?.title || "Battle Arena"}
            </span>
            <span className="arena-bottom-stage text-xs text-text-muted uppercase tracking-widest font-bold">
              Stage {myStage ?? "?"} / 6
            </span>
          </div>
          <div className="arena-bottom-right">
            <span className="arena-bottom-lives">{me?.lives || 0} lives</span>
          </div>
        </div>

        {waitTimer > 0 && (
          <div className="arena-overlay">
            <div className="arena-overlay-spin">⏳</div>
            <div className="arena-overlay-title">WAITING FOR OPPONENT</div>
            <div className="arena-overlay-sub">
              They are deciding whether to skip or stay.
            </div>
            <div className="arena-overlay-countdown">{waitTimer}</div>
          </div>
        )}

        {decTimer > 0 && (
          <div className="arena-overlay decision">
            <div className="arena-decision-modal">
              <div className="arena-decision-icon">⚠️</div>
              <div className="arena-decision-title">
                OPPONENT COMPLETED STAGE
              </div>
              <div className="arena-decision-desc">
                Your opponent just completed this stage! You have 15 seconds to
                decide whether to stay and try to solve it, or skip to the next
                stage at the cost of 1 life.
              </div>
              <div className="arena-decision-timer">{decTimer}</div>
              <div className="arena-decision-actions">
                <button
                  className="arena-btn-skip"
                  onClick={() => decide("skip")}
                >
                  Skip (−1 life)
                </button>
                <button
                  className="arena-btn-stay-lg"
                  onClick={() => decide("stay")}
                >
                  Stay & Solve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
