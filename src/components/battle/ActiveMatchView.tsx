'use client';

import { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';

const STARTERS: Record<string, string> = {
  python: "# Write your solution here\n",
  java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // Write your solution here\n  }\n}',
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  // Write your solution here\n  return 0;\n}",
};

const AVATARS = ["🥷", "🧙", "🧑‍💻", "👾", "🤖", "🦸", "⚡", "🔥", "🐉", "🦊"];
function getAvatar(name: string) {
  return AVATARS[(name || "?").charCodeAt(0) % AVATARS.length];
}

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const hearts = (n = 5, max = 5) =>
  Array.from({ length: max }, (_, i) => (
    <span key={i} className={`h ${i < n ? "" : "dead"}`}>
      ❤
    </span>
  ));

interface ProblemDetails {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  basePoints: number;
  testCases: { id: string; input: string; expected: string; isPublic: boolean }[];
}

const MOCK_PROBLEMS: Record<number, ProblemDetails> = {
  1: {
    id: "mock-stage-1",
    title: "Two Sum & Target Search",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "EASY",
    basePoints: 100,
    testCases: [
      { id: "tc1", input: "nums = [2,7,11,15], target = 9", expected: "[0,1]", isPublic: true },
      { id: "tc2", input: "nums = [3,2,4], target = 6", expected: "[1,2]", isPublic: true },
      { id: "tc3", input: "nums = [3,3], target = 6", expected: "[0,1]", isPublic: true },
    ],
  },
  2: {
    id: "mock-stage-2",
    title: "Valid Palindrome String",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
    difficulty: "EASY",
    basePoints: 150,
    testCases: [
      { id: "tc1", input: 's = "A man, a plan, a canal: Panama"', expected: "true", isPublic: true },
      { id: "tc2", input: 's = "race a car"', expected: "false", isPublic: true },
    ],
  },
  3: {
    id: "mock-stage-3",
    title: "Longest Substring Without Repeating",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    difficulty: "MEDIUM",
    basePoints: 200,
    testCases: [
      { id: "tc1", input: 's = "abcabcbb"', expected: "3", isPublic: true },
      { id: "tc2", input: 's = "bbbbb"', expected: "1", isPublic: true },
    ],
  },
  4: {
    id: "mock-stage-4",
    title: "Container With Most Water",
    description: "You are given an integer array `height` of length `n`. Find two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
    difficulty: "MEDIUM",
    basePoints: 250,
    testCases: [
      { id: "tc1", input: "height = [1,8,6,2,5,4,8,3,7]", expected: "49", isPublic: true },
      { id: "tc2", input: "height = [1,1]", expected: "1", isPublic: true },
    ],
  },
  5: {
    id: "mock-stage-5",
    title: "Binary Tree Maximum Path Sum",
    description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. Return the maximum path sum of any non-empty path.",
    difficulty: "HARD",
    basePoints: 350,
    testCases: [
      { id: "tc1", input: "root = [1,2,3]", expected: "6", isPublic: true },
      { id: "tc2", input: "root = [-10,9,20,null,null,15,7]", expected: "42", isPublic: true },
    ],
  },
  6: {
    id: "mock-stage-6",
    title: "BOSS: Cosmic Graph Matrix Optimization",
    description: "Solve the cosmic matrix node traversal problem with optimal time and space complexity to defeat the Boss and claim supreme victory in the Arena!",
    difficulty: "HARD",
    basePoints: 500,
    testCases: [
      { id: "tc1", input: "matrix = [[1,2],[3,4]]", expected: "24", isPublic: true },
      { id: "tc2", input: "matrix = [[0,1],[1,0]]", expected: "0", isPublic: true },
    ],
  },
};

interface CodePlayerState {
  status?: string;
  currentStage?: number;
  points?: number;
  lives?: number;
  currentDraft?: string;
  stageTimeRemaining?: number;
  submissionsCount?: number;
}

interface CodeMatchState {
  roomId?: string;
  currentStage?: number;
  stageTimeRemaining?: number;
  problems?: string[];
  playerIds?: string[];
  players?: Record<string, CodePlayerState>;
}

interface McqQuestion {
  category: string;
  difficulty: string;
  question: string;
  options: string[];
}

interface McqPlayerState {
  score?: number;
}

interface McqMatchState {
  currentRound?: number;
  status?: string;
  currentQuestion?: McqQuestion;
  players?: Record<string, McqPlayerState>;
}

interface RoundRevealData {
  correctIndex: number;
}

interface ExecResult {
  status?: string;
  passedCount?: number;
  totalCount?: number;
  pointsAwarded?: number;
  livesRemaining?: number;
  error?: string;
  stderr?: string;
  testCases?: { id?: string; input: string; expected: string; actual?: string; passed?: boolean; isPublic?: boolean }[];
}

interface RunResult {
  stdout?: string;
  stderr?: string;
  timedOut?: boolean;
}

interface MatchInfo {
  roomId: string;
  opponentId: string;
  opponentUsername: string;
  opponentElo: number;
  mode: 'code' | 'mcq';
}

interface Props {
  socket: Socket | null;
  matchInfo: MatchInfo;
  userId: string;
  username: string;
  onLeave: () => void;
}

export default function ActiveMatchView({ socket, matchInfo, userId, username, onLeave }: Props) {
  const isMcq = matchInfo.mode === 'mcq';

  // State for Code Battle
  const [codeState, setCodeState] = useState<CodeMatchState | null>(null);
  const [problem, setProblem] = useState<ProblemDetails | null>(null);

  const [code, setCode] = useState(STARTERS.python);
  const [language, setLanguage] = useState('python');
  const [customStdin, setCustomStdin] = useState('');
  const [showStdin, setShowStdin] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecResult | null>(null);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [waitingDecision, setWaitingDecision] = useState(false);
  const [decTimer, setDecTimer] = useState(0);
  const [waitTimer, setWaitTimer] = useState(0);

  const [leftWidth, setLeftWidth] = useState(40);
  const isDragging = useRef(false);

  // State for MCQ Battle
  const [mcqState, setMcqState] = useState<McqMatchState | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [roundReveal, setRoundReveal] = useState<RoundRevealData | null>(null);

  // Match outcome
  const [matchResult, setMatchResult] = useState<{ winnerId: string | null; reason: string } | null>(null);
  const draftRestoredRef = useRef(false);

  // Drag resizer
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startDrag = () => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
  };

  // Socket setup
  useEffect(() => {
    if (!socket) return;

    if (isMcq) {
      socket.emit('mcq_join_room', { roomId: matchInfo.roomId, userId });

      socket.on('mcq_room_state', (state: McqMatchState) => {
        setMcqState(state);
        if (state.status === 'ACTIVE') {
          setRoundReveal(null);
        }
      });

      socket.on('mcq_round_reveal', (data: RoundRevealData) => {
        setRoundReveal(data);
      });

      socket.on('mcq_next_round', (state: McqMatchState) => {
        setMcqState(state);
        setRoundReveal(null);
        setSelectedAnswer(null);
      });

      socket.on('mcq_match_ended', (data: { winnerId: string | null; reason: string }) => {
        setMatchResult(data);

        setMcqState((latest) => {
          try {
            const myPlayer = latest?.players?.[userId];
            localStorage.setItem('cosmodex_match_result', JSON.stringify({
              points: myPlayer?.score ?? 0,
              livesLeft: 0,
              submissions: 0,
              opponentName: matchInfo.opponentUsername,
              myName: username,
              eloDelta: null,
              matchId: matchInfo.roomId,
              isWinner: data.winnerId === userId,
            }));
          } catch { /* ignore */ }
          return latest;
        });

        if (data.winnerId === userId) {
          setTimeout(() => { window.location.href = '/victory'; }, 1200);
        }
      });
    } else {
      socket.emit('join_room', { roomId: matchInfo.roomId, userId });

      socket.on('room_state_update', (state: CodeMatchState) => {
        setCodeState(state);
        const myPlayer = state.players?.[userId];

        // Restore current draft only once on join
        if (myPlayer?.currentDraft && !draftRestoredRef.current) {
          draftRestoredRef.current = true;
          setCode(myPlayer.currentDraft);
        }

        if (myPlayer?.status === 'WAITING_DECISION') {
          setWaitingDecision(true);
          setDecTimer((prev) => (prev > 0 ? prev : 15));
        } else {
          setWaitingDecision(false);
          setDecTimer(0);
        }
      });

      socket.on('submission_result', (result: ExecResult) => {
        setSubmitting(false);
        setExecResult(result);
      });

      socket.on('run_result', (res: RunResult) => {
        setRunning(false);
        setRunResult(res);
      });

      socket.on('opponent_completed_stage', () => {
        setWaitingDecision(true);
        setDecTimer(15);
      });

      socket.on('waiting_for_opponent', (data: { time: number }) => {
        setWaitTimer(data?.time || 15);
      });

      socket.on('match_ended', (data: { winnerId: string | null; reason: string }) => {
        setMatchResult(data);

        // Persist result for victory page
        setCodeState((latest) => {
          const myPlayer = latest?.players?.[userId];
          try {
            localStorage.setItem('cosmodex_match_result', JSON.stringify({
              points: myPlayer?.points ?? 0,
              livesLeft: myPlayer?.lives ?? 0,
              submissions: myPlayer?.submissionsCount ?? 0,
              opponentName: matchInfo.opponentUsername,
              myName: username,
              eloDelta: null,
              matchId: latest?.roomId ?? null,
              isWinner: data.winnerId === userId,
            }));
            localStorage.setItem('cosmodex_last_room_state', JSON.stringify(latest));
            if (latest?.roomId) localStorage.setItem('cosmodex_last_match_id', latest.roomId);
          } catch { /* ignore */ }
          return latest;
        });

        if (data.winnerId === userId) {
          setTimeout(() => { window.location.href = '/victory'; }, 1200);
        }
      });
    }

    return () => {
      socket.off('mcq_room_state');
      socket.off('mcq_round_reveal');
      socket.off('mcq_next_round');
      socket.off('mcq_match_ended');
      socket.off('room_state_update');
      socket.off('submission_result');
      socket.off('run_result');
      socket.off('opponent_completed_stage');
      socket.off('waiting_for_opponent');
      socket.off('match_ended');
    };
  }, [socket, isMcq, matchInfo.roomId, matchInfo.opponentUsername, userId, username]);

  // Wait timer Countdown
  useEffect(() => {
    if (waitTimer <= 0) return;
    const interval = setInterval(() => {
      setWaitTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [waitTimer]);

  // Decision timer Countdown (Pure cleanup effect with no setState in effect body)
  useEffect(() => {
    if (!waitingDecision) return;
    const interval = setInterval(() => {
      setDecTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [waitingDecision]);

  // Auto-save draft in Code Battle
  useEffect(() => {
    if (isMcq || !socket || !matchInfo.roomId || !code) return;
    const timer = setTimeout(() => {
      socket.emit('auto_save_draft', {
        roomId: matchInfo.roomId,
        userId,
        code,
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [code, isMcq, socket, matchInfo.roomId, userId]);

  // Problem management: Try backend fetch; fallback asynchronously (FIX: no synchronous setState in effect body)
  useEffect(() => {
    if (isMcq) return;

    const myPlayer = codeState?.players?.[userId];
    const currentStage = myPlayer?.currentStage ?? codeState?.currentStage ?? 1;
    const problemId = codeState?.problems?.[currentStage - 1];

    if (!problemId) return;

    let ignore = false;

    fetch(`/api/battle/problems/${problemId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (ignore) return;
        if (data && !data.error && data.id && data.title) {
          setProblem(data);
          setExecResult(null);
          setRunResult(null);
        }
      })
      .catch((err) => {
        if (ignore) return;
        console.log('[ActiveMatchView] Backend problem unavailable:', err.message);
      });

    return () => {
      ignore = true;
    };
  }, [codeState, userId, isMcq]);

  const handleForfeit = () => {
    if (socket && matchInfo.roomId) {
      if (isMcq) {
        socket.emit('mcq_leave_room', { roomId: matchInfo.roomId, userId });
      } else {
        socket.emit('leave_match', { roomId: matchInfo.roomId, userId });
      }
    }
    onLeave();
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(STARTERS[newLang] || "");
  };

  const handleRunCode = () => {
    if (running || !code) return;
    setRunning(true);
    setRunResult(null);
    setExecResult(null);
    socket?.emit("run_code", { code, language, stdin: customStdin });
  };

  const handleSubmitCode = () => {
    const currentProblem = problem || MOCK_PROBLEMS[myStage] || MOCK_PROBLEMS[1];
    if (!socket || !currentProblem || submitting) return;
    setSubmitting(true);
    setExecResult(null);
    setRunResult(null);
    socket.emit('submit_code', {
      roomId: matchInfo.roomId,
      userId,
      problemId: currentProblem.id,
      code,
      language,
    });
  };

  const handleDecision = (choice: 'skip' | 'stay') => {
    if (!socket) return;
    socket.emit('decide_skip_stay', {
      roomId: matchInfo.roomId,
      userId,
      choice,
    });
    setWaitingDecision(false);
  };

  const handleRedeem = () => {
    if (!socket) return;
    socket.emit('redeem_life', { roomId: matchInfo.roomId, userId });
  };

  const handleMcqAnswer = (answerIndex: number) => {
    if (!socket || selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    socket.emit('mcq_answer', {
      roomId: matchInfo.roomId,
      userId,
      answerIndex,
    });
  };

  const myPlayerCode = codeState?.players?.[userId];
  const oppPlayerCode = codeState?.players?.[matchInfo.opponentId];

  const myPlayerMcq = mcqState?.players?.[userId];
  const oppPlayerMcq = mcqState?.players?.[matchInfo.opponentId];

  const myStage = myPlayerCode?.currentStage ?? codeState?.currentStage ?? 1;
  const isBoss = myStage === 6;
  const myTimeRemaining = isBoss
    ? codeState?.stageTimeRemaining
    : (myPlayerCode?.stageTimeRemaining ?? codeState?.stageTimeRemaining);

  const inDecision = waitingDecision || myPlayerCode?.status === 'WAITING_DECISION';
  const isWaiting = myPlayerCode?.status === 'DONE';
  const isElim = myPlayerCode?.status === 'ELIMINATED';

  // Derived active problem & timer without cascading renders
  const activeProblem = problem || MOCK_PROBLEMS[myStage] || MOCK_PROBLEMS[1];
  const effectiveDecTimer = waitingDecision ? decTimer : 0;

  // ── MATCH ENDED VIEW OVERLAY ───────────────────────────────────────────────
  if (matchResult) {
    const won = matchResult.winnerId === userId;
    const draw = !matchResult.winnerId;
    return (
      <div className="fixed inset-0 z-[9999] bg-[#050508] text-text-primary flex flex-col font-fira overflow-hidden">
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
                : `${matchInfo.opponentUsername} won this battle. Keep practicing!`}
          </div>
          <div className="flex gap-4 flex-wrap justify-center mt-2">
            <div className="cosmo-glass-panel p-5 px-7 min-w-[120px] shadow-lg text-center">
              <div className="text-3xl font-black text-white">
                {isMcq ? myPlayerMcq?.score || 0 : myPlayerCode?.points || 0}
              </div>
              <div className="text-[10px] text-text-muted mt-1.5 uppercase tracking-wide font-bold">
                Points
              </div>
            </div>
            {!isMcq && (
              <>
                <div className="cosmo-glass-panel p-5 px-7 min-w-[120px] shadow-lg text-center">
                  <div className="text-3xl font-black text-white">{myPlayerCode?.lives || 0}</div>
                  <div className="text-[10px] text-text-muted mt-1.5 uppercase tracking-wide font-bold">
                    Lives Left
                  </div>
                </div>
                <div className="cosmo-glass-panel p-5 px-7 min-w-[120px] shadow-lg text-center">
                  <div className="text-3xl font-black text-white">
                    {myPlayerCode?.submissionsCount || 0}
                  </div>
                  <div className="text-[10px] text-text-muted mt-1.5 uppercase tracking-wide font-bold">
                    Submissions
                  </div>
                </div>
              </>
            )}
          </div>
          <button
            className="cosmo-btn-primary mt-4 px-10 py-3.5 text-[15px]"
            onClick={onLeave}
          >
            Back to Arena
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN ARENA VIEW (FULLSCREEN TAKEOVER, NO NAVBAR) ──────────────────────
  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#050508] text-text-primary flex flex-col font-fira overflow-hidden arena-active">
      <div className="arena-game-wrapper" style={{ paddingTop: 0, height: '100vh' }}>
        {/* Topbar */}
        <div className="arena-topbar">
          <div className="arena-topbar-left">
            <span className={`arena-stage-badge ${isBoss ? "boss" : ""}`}>
              {isMcq ? `MCQ Round ${mcqState?.currentRound ?? 1} / 5` : isBoss ? "⚔ BOSS" : `Stage ${myStage} / 6`}
            </span>
            <span className="arena-problem-title">
              {isMcq ? mcqState?.currentQuestion?.category || 'MCQ Speed Battle' : activeProblem.title}
            </span>
          </div>
          <div className="arena-topbar-right">
            {!isMcq && execResult?.status === "ACCEPTED" && (
              <span className="arena-solved-badge">
                ✅ Solved! Waiting for opponent…
              </span>
            )}
            {!isMcq && (
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
            )}
            <button
              onClick={handleForfeit}
              className="px-3 py-1 bg-white/5 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-bold transition-all cursor-pointer"
            >
              Forfeit
            </button>
          </div>
        </div>

        {/* Content Area */}
        {isMcq ? (
          /* MCQ QUESTION VIEW */
          <div className="p-8 max-w-4xl mx-auto flex-1 flex flex-col justify-center">
            <div className="bg-[#110f19] border border-white/10 rounded-2xl p-8 shadow-2xl">
              {mcqState?.currentQuestion ? (
                <>
                  <div className="text-xs text-[#A78BFA] font-bold uppercase tracking-widest mb-3 flex justify-between">
                    <span>{mcqState.currentQuestion.category} • {mcqState.currentQuestion.difficulty}</span>
                    <span>Opponent Score: {oppPlayerMcq?.score || 0}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-8 leading-snug">
                    {mcqState.currentQuestion.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {mcqState.currentQuestion.options.map((option: string, idx: number) => {
                      let btnStyle = "bg-white/5 border-white/10 text-white hover:bg-white/10";
                      if (selectedAnswer === idx) {
                        btnStyle = "bg-[#7c3aed] border-[#a78bfa] text-white";
                      }
                      if (roundReveal) {
                        if (idx === roundReveal.correctIndex) {
                          btnStyle = "bg-[#16a34a] border-[#4ade80] text-white";
                        } else if (selectedAnswer === idx && idx !== roundReveal.correctIndex) {
                          btnStyle = "bg-[#dc2626] border-[#f87171] text-white";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleMcqAnswer(idx)}
                          disabled={selectedAnswer !== null || roundReveal !== null}
                          className={`p-5 rounded-xl border text-left font-medium transition-all ${btnStyle}`}
                        >
                          <span className="font-mono text-sm opacity-60 mr-2">{String.fromCharCode(65 + idx)}.</span> {option}
                        </button>
                      );
                    })}
                  </div>

                  {roundReveal && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center text-sm text-text-secondary">
                      Round Over! Correct Answer: <strong className="text-[#3DCB7F]">{String.fromCharCode(65 + roundReveal.correctIndex)}</strong>. Loading next round...
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-text-muted py-12 font-mono">Waiting for next question...</div>
              )}
            </div>
          </div>
        ) : (
          /* CODE BATTLE VIEW */
          <div className="arena-main" style={{ display: "flex", flexDirection: "row" }}>
            {/* Left Panel: Problem Details & Players */}
            <div
              className="arena-left flex flex-col min-w-0"
              style={{ width: `${leftWidth}%` }}
            >
              <div className="arena-problem-panel flex-1 bg-[#0d0a14] border border-white/5 rounded-xl p-8 relative overflow-y-auto mb-4 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[#A78BFA] font-bold tracking-widest uppercase text-sm">
                    Exercise
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted font-medium">
                      Stage {myStage} of 6
                    </span>
                  </div>
                </div>

                <h2 className="text-[36px] leading-none font-black font-lato text-white tracking-wide uppercase mb-4 drop-shadow-md">
                  {String(myStage).padStart(2, "0")}. {activeProblem.title}
                </h2>

                <div className="mb-6 flex items-center">
                  <h3
                    className={`text-xl font-bold ${activeProblem.difficulty === "EASY"
                        ? "text-[#3DCB7F]"
                        : activeProblem.difficulty === "MEDIUM"
                          ? "text-[#F5C842]"
                          : "text-[#E85D5D]"
                      }`}
                  >
                    # {activeProblem.difficulty}
                  </h3>
                  <span className="ml-3 text-xl">👾</span>
                </div>

                <div className="text-[#A1A1AA] leading-relaxed text-[14px] space-y-4 mb-8">
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {activeProblem.description}
                  </div>
                </div>

                <div className="space-y-4 relative z-10 mt-auto">
                  {activeProblem.testCases
                    ?.filter((tc) => tc.isPublic)
                    .map((tc, i) => (
                      <div
                        key={tc.id || i}
                        className="arena-example bg-black/50 border border-white/5 rounded-xl p-4"
                      >
                        <div className="arena-example-label text-[11px] font-bold text-[#A78BFA] mb-2 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                          Example {i + 1}
                        </div>
                        <div className="arena-example-row font-mono text-xs mb-1 flex gap-3 items-start">
                          <span className="arena-example-key text-text-muted select-none mt-0.5">
                            Input:
                          </span>
                          <code className="arena-example-val text-white bg-white/5 px-2 py-0.5 rounded border border-white/10 break-all">
                            {tc.input}
                          </code>
                        </div>
                        <div className="arena-example-row font-mono text-xs flex gap-3 items-start">
                          <span className="arena-example-key text-text-muted select-none mt-0.5">
                            Output:
                          </span>
                          <code className="arena-example-val text-[#3DCB7F] bg-[#3DCB7F]/10 border border-[#3DCB7F]/20 px-2 py-0.5 rounded break-all">
                            {tc.expected}
                          </code>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Players Section */}
              <div className="arena-players-section mt-2">
                <div className="arena-players-title text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">
                  Players
                </div>

                {/* You Card */}
                <div className="arena-player-card you">
                  <span className="arena-player-avi">
                    {getAvatar(username)}
                  </span>
                  <div className="arena-player-info">
                    <span className="arena-player-name">
                      {username}{" "}
                      <span className="arena-you-tag">(you)</span>
                    </span>
                    <div className="arena-player-meta flex items-center gap-3">
                      <span className="arena-player-stage bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-widest">
                        Stage {myStage}
                      </span>
                      <span className="arena-player-hearts">{hearts(myPlayerCode?.lives ?? 5)}</span>
                      <span className="arena-player-pts text-[#F5C842] font-black text-sm">
                        🌟 {myPlayerCode?.points ?? 0} XP
                      </span>
                      <span
                        className={`arena-player-status ${(myPlayerCode?.status || 'CODING')
                          .toLowerCase()
                          .replace("_", "-")} text-[10px] font-bold tracking-widest uppercase ml-auto`}
                      >
                        {myPlayerCode?.status === "CODING"
                          ? "CODING"
                          : myPlayerCode?.status === "DONE"
                            ? "DONE"
                            : myPlayerCode?.status === "STAYING"
                              ? "STAYING"
                              : myPlayerCode?.status === "WAITING_DECISION"
                                ? "DECIDING"
                                : myPlayerCode?.status === "ELIMINATED"
                                  ? "ELIMINATED"
                                  : myPlayerCode?.status || "CODING"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Opponent Card */}
                <div className="arena-player-card bg-[#1C1929] border border-white/5 rounded-xl p-4 flex gap-4 items-center mt-2">
                  <span className="arena-player-avi text-4xl bg-black/40 rounded-full w-12 h-12 flex items-center justify-center">
                    {getAvatar(matchInfo.opponentUsername)}
                  </span>
                  <div className="arena-player-info flex-1">
                    <span className="arena-player-name text-sm font-bold text-white block mb-1">
                      {matchInfo.opponentUsername}
                    </span>
                    <div className="arena-player-meta flex items-center gap-3">
                      <span className="arena-player-stage bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-widest">
                        Stage {oppPlayerCode?.currentStage ?? 1}
                      </span>
                      <span className="arena-player-hearts">{hearts(oppPlayerCode?.lives ?? 5)}</span>
                      <span className="arena-player-pts text-[#F5C842] font-black text-sm">
                        🌟 {oppPlayerCode?.points ?? 0} XP
                      </span>
                      <span
                        className={`arena-player-status ${(oppPlayerCode?.status || 'CODING')
                          .toLowerCase()
                          .replace("_", "-")} text-[10px] font-bold tracking-widest uppercase ml-auto`}
                      >
                        {oppPlayerCode?.status === "CODING"
                          ? "CODING"
                          : oppPlayerCode?.status === "DONE"
                            ? "DONE"
                            : oppPlayerCode?.status === "STAYING"
                              ? "STAYING"
                              : oppPlayerCode?.status === "WAITING_DECISION"
                                ? "DECIDING"
                                : oppPlayerCode?.status === "ELIMINATED"
                                  ? "ELIMINATED"
                                  : oppPlayerCode?.status || "CODING"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Resizer */}
            <div
              className="w-2 cursor-col-resize hover:bg-accent/30 transition-colors z-20 flex items-center justify-center shrink-0 group"
              onMouseDown={startDrag}
            >
              <div className="w-0.5 h-12 bg-white/10 group-hover:bg-accent/50 rounded-full transition-colors" />
            </div>

            {/* Right Panel: Code Editor & Execution */}
            <div
              className="arena-right flex flex-col flex-1 min-w-0"
              style={{ width: `${100 - leftWidth}%` }}
            >
              {/* Toolbar */}
              <div className="arena-editor-toolbar">
                <div className="arena-editor-toolbar-left">
                  <span className="arena-editor-icon">📝</span>
                  <span className="arena-editor-label">Editor</span>
                  <select
                    className="arena-lang-select"
                    value={language}
                    onChange={handleLangChange}
                  >
                    <option value="python">Python 3</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
                <span className="arena-char-count">{code.length} chars</span>
              </div>

              {/* Code Textarea */}
              <textarea
                className="arena-code-editor flex-1 w-full"
                placeholder="# Write your solution here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />

              {/* Actions Bar */}
              <div className="arena-actions-bar">
                <div className="arena-actions-left">
                  {inDecision && (
                    <>
                      <button
                        className="arena-btn-skip"
                        onClick={() => handleDecision("skip")}
                      >
                        ⏭ Skip (−1 life)
                      </button>
                      <button
                        className="arena-btn-stay"
                        onClick={() => handleDecision("stay")}
                      >
                        ✋ Stay & Solve
                      </button>
                    </>
                  )}
                  {isBoss && (myPlayerCode?.points || 0) >= 100 && (
                    <button className="arena-btn-redeem" onClick={handleRedeem}>
                      ❤️ Redeem Life (100pt)
                    </button>
                  )}
                </div>
                <div className="arena-actions-right">
                  {!inDecision && (
                    <>
                      <button
                        className="arena-btn-run"
                        onClick={handleRunCode}
                        disabled={running || isElim}
                      >
                        {running ? "⏳ Running..." : "▶ Run"}
                      </button>
                      <button
                        className="arena-btn-submit"
                        onClick={handleSubmitCode}
                        disabled={submitting || isWaiting || isElim}
                      >
                        {submitting ? "⏳ Judging..." : "⚡ Submit"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Custom Stdin Section */}
              <div className="arena-stdin-section">
                <div
                  className="arena-stdin-toggle cursor-pointer"
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

              {/* Output / Terminal Section */}
              <div className="arena-output-section">
                <div className="arena-output-header">
                  <span className="arena-output-label">Terminal</span>
                  {runResult && !execResult && (
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
                  {execResult && (
                    <span
                      className={`arena-output-status ${execResult.status === "ACCEPTED" ? "success" : "error"
                        }`}
                    >
                      {execResult.status === "ACCEPTED"
                        ? `✅ ACCEPTED ${execResult.passedCount}/${execResult.totalCount}`
                        : `❌ ${(execResult.status || "FAILED").replace(/_/g, " ")} ${execResult.passedCount ?? 0}/${execResult.totalCount ?? 0}`}
                    </span>
                  )}
                </div>
                <div
                  className={`arena-output-body ${execResult
                      ? execResult.status === "ACCEPTED"
                        ? "success"
                        : "error"
                      : runResult
                        ? runResult.timedOut || runResult.stderr
                          ? "warn"
                          : "success"
                        : ""
                    }`}
                >
                  {execResult
                    ? execResult.status === "ACCEPTED"
                      ? `All ${execResult.passedCount} test cases passed! +${execResult.pointsAwarded ?? 0} points\n` +
                      (execResult.testCases
                        ?.filter((tc) => tc.isPublic)
                        .map(
                          (tc, i) =>
                            `\nTest ${i + 1} ✓  Input: ${tc.input}   Expected: ${tc.expected}`
                        )
                        .join("") || "")
                      : `${(execResult.status || "FAILED").replace(/_/g, " ")}  —  ${execResult.livesRemaining ?? myPlayerCode?.lives ?? 0} lives remaining\n` +
                      (execResult.error ? `Error: ${execResult.error}\n` : "") +
                      (execResult.testCases
                        ?.filter((tc) => tc.isPublic)
                        .map(
                          (tc, i) =>
                            `\nTest ${i + 1} ${tc.passed ? "✓" : "✗"}  Input: ${tc.input}   Expected: ${tc.expected}   Got: ${tc.actual || "(none)"}`
                        )
                        .join("") || "")
                    : runResult
                      ? runResult.timedOut
                        ? "Your code took too long to execute (Time limit: 5s)."
                        : runResult.stderr ||
                        runResult.stdout ||
                        "(No output produced)"
                      : "Click Run or Submit to view your execution results"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Status Bar */}
        <div className="arena-bottom-bar">
          <div className="arena-bottom-left">
            <div className="flex items-center gap-2 bg-[#F5C842]/10 px-3 py-1 rounded-full border border-[#F5C842]/30">
              <span className="text-[#F5C842] text-sm">🌟</span>
              <span className="text-[#F5C842] font-black text-sm tracking-widest">
                {isMcq ? myPlayerMcq?.score || 0 : myPlayerCode?.points || 0} XP
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="arena-bottom-title font-bold text-white text-sm">
              {isMcq ? 'MCQ Speed Battle' : activeProblem.title}
            </span>
            <span className="arena-bottom-stage text-xs text-text-muted uppercase tracking-widest font-bold">
              {isMcq ? `Round ${mcqState?.currentRound ?? 1} / 5` : `Stage ${myStage} / 6`}
            </span>
          </div>
          <div className="arena-bottom-right">
            {!isMcq && (
              <span className="arena-bottom-lives">{myPlayerCode?.lives ?? 5} lives</span>
            )}
          </div>
        </div>

        {/* Overlay: Waiting for Opponent */}
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

        {/* Overlay: Decision Modal */}
        {effectiveDecTimer > 0 && (
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
              <div className="arena-decision-timer">{effectiveDecTimer}</div>
              <div className="arena-decision-actions">
                <button
                  className="arena-btn-skip"
                  onClick={() => handleDecision("skip")}
                >
                  Skip (−1 life)
                </button>
                <button
                  className="arena-btn-stay-lg"
                  onClick={() => handleDecision("stay")}
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
