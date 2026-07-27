'use client';

import { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface CodePlayerState {
  status?: string;
  currentStage?: number;
  points?: number;
  lives?: number;
  currentDraft?: string;
}

interface CodeMatchState {
  roomId?: string;
  problems?: string[];
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
  error?: string;
  stderr?: string;
}

interface MatchInfo {
  roomId: string;
  opponentId: string;
  opponentUsername: string;
  opponentElo: number;
  mode: 'code' | 'mcq';
}

interface ProblemDetails {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  basePoints: number;
  testCases: { id: string; input: string; expected: string; isPublic: boolean }[];
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
  const [loadingProblem, setLoadingProblem] = useState(false);
  const [problemError, setProblemError] = useState<string | null>(null);
  const [code, setCode] = useState('# Write your solution here\n');
  const [language, setLanguage] = useState('python');
  const [submitting, setSubmitting] = useState(false);
  const [execResult, setExecResult] = useState<ExecResult | null>(null);
  const [waitingDecision, setWaitingDecision] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // State for MCQ Battle
  const [mcqState, setMcqState] = useState<McqMatchState | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [roundReveal, setRoundReveal] = useState<RoundRevealData | null>(null);

  // Match outcome
  const [matchResult, setMatchResult] = useState<{ winnerId: string | null; reason: string } | null>(null);
  const draftRestoredRef = useRef(false);

  // Join room on mount & setup listeners
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
              points:       myPlayer?.score ?? 0,
              livesLeft:    0,
              submissions:  0,
              opponentName: matchInfo.opponentUsername,
              myName:       username,
              eloDelta:     null,
              matchId:      matchInfo.roomId,
              isWinner:     data.winnerId === userId,
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
        } else {
          setWaitingDecision(false);
        }
      });

      socket.on('submission_result', (result: ExecResult) => {
        setSubmitting(false);
        setExecResult(result);
      });

      socket.on('opponent_completed_stage', () => {
        setWaitingDecision(true);
      });

      socket.on('match_ended', (data: { winnerId: string | null; reason: string }) => {
        setMatchResult(data);

        // Persist result for the victory page to read
        setCodeState((latest) => {
          const myPlayer = latest?.players?.[userId];
          try {
            localStorage.setItem('cosmodex_match_result', JSON.stringify({
              points:       myPlayer?.points ?? 0,
              livesLeft:    myPlayer?.lives ?? 0,
              submissions:  0,
              opponentName: matchInfo.opponentUsername,
              myName:       username,
              eloDelta:     null,
              matchId:      latest?.roomId ?? null,
              isWinner:     data.winnerId === userId,
            }));
            localStorage.setItem('cosmodex_last_room_state', JSON.stringify(latest));
            if (latest?.roomId) localStorage.setItem('cosmodex_last_match_id', latest.roomId);
          } catch { /* ignore */ }
          return latest;
        });

        // Redirect winner to victory page after a short delay
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
      socket.off('opponent_completed_stage');
      socket.off('match_ended');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isMcq, matchInfo.roomId, userId]);

  // Auto-save code draft in Code Battle
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

  // Fetch problem details when stage changes in Code Battle
  useEffect(() => {
    if (isMcq || !codeState) return;

    const myPlayer = codeState.players?.[userId];
    const currentStage = myPlayer?.currentStage ?? 1;
    const problemId = codeState.problems?.[currentStage - 1];

    if (!problemId || problemId === problem?.id) return;

    let ignore = false;

    fetch(`/api/battle/problems/${problemId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} - Failed to fetch problem`);
        return res.json();
      })
      .then((data) => {
        if (ignore) return;
        if (data.error) {
          setProblemError(data.error);
        } else {
          setProblem(data);
          setExecResult(null);
          setProblemError(null);
          setCode(getStarterCode(language, data.title));
        }
      })
      .catch((err) => {
        if (ignore) return;
        console.error('[ActiveMatchView] Problem fetch error:', err);
        setProblemError(err.message || 'Failed to load problem');
      })
      .finally(() => {
        if (!ignore) setLoadingProblem(false);
      });

    return () => {
      ignore = true;
    };
  }, [codeState, userId, isMcq, problem?.id, language, retryTrigger]);

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

  const handleSubmitCode = () => {
    if (!socket || !problem) return;
    setSubmitting(true);
    setExecResult(null);
    socket.emit('submit_code', {
      roomId: matchInfo.roomId,
      userId,
      problemId: problem.id,
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

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', color: '#eee' }}>

      {/* Match Result Overlay if ended */}
      {matchResult && (
        <div style={{ background: '#1e1b4b', border: '2px solid #7c3aed', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: matchResult.winnerId === userId ? '#4ade80' : matchResult.winnerId ? '#f87171' : '#facc15', margin: '0 0 8px' }}>
            {matchResult.winnerId === userId ? '🏆 VICTORY!' : matchResult.winnerId ? '❌ DEFEAT' : '🤝 DRAW!'}
          </h2>
          <p style={{ color: '#aaa', margin: '0 0 16px' }}>
            {matchResult.winnerId === userId ? 'You won the match!' : matchResult.winnerId ? `${matchInfo.opponentUsername} won the match.` : 'The match ended in a draw.'}
          </p>
          <button
            onClick={onLeave}
            style={{ padding: '10px 24px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Back to Arena
          </button>
        </div>
      )}

      {/* Scoreboard Header */}
      <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '16px 24px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>{isMcq ? 'MCQ Speed Battle' : 'Code Battle'}</span>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
            {isMcq ? `Round ${mcqState?.currentRound ?? 1} / 5` : `Stage ${myPlayerCode?.currentStage ?? 1} / 6`}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '32px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#888' }}>You ({username})</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80' }}>
              {isMcq ? `${myPlayerMcq?.score ?? 0} pts` : `${myPlayerCode?.points ?? 0} pts (${myPlayerCode?.lives ?? 5} ❤️)`}
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>VS</div>
          <div>
            <div style={{ fontSize: '12px', color: '#888' }}>{matchInfo.opponentUsername}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f87171' }}>
              {isMcq ? `${oppPlayerMcq?.score ?? 0} pts` : `${oppPlayerCode?.points ?? 0} pts (${oppPlayerCode?.lives ?? 5} ❤️)`}
            </div>
          </div>
        </div>

        <button
          onClick={handleForfeit}
          style={{ padding: '6px 12px', background: '#222', color: '#f87171', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
        >
          Forfeit
        </button>
      </div>

      {/* Decision Window for Code Battle */}
      {waitingDecision && !isMcq && (
        <div style={{ background: '#2e1065', border: '1px solid #7c3aed', borderRadius: '10px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 8px', color: '#facc15' }}>⚡ Opponent finished this stage first!</h4>
          <p style={{ fontSize: '14px', color: '#ddd', margin: '0 0 16px' }}>Choose your strategy:</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => handleDecision('skip')}
              style={{ padding: '10px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Skip Stage (-1 Life)
            </button>
            <button
              onClick={() => handleDecision('stay')}
              style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Stay & Keep Solving
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      {isMcq ? (
        /* MCQ QUESTION VIEW */
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '24px' }}>
          {mcqState?.currentQuestion ? (
            <>
              <div style={{ fontSize: '12px', color: '#a78bfa', textTransform: 'uppercase', marginBottom: '8px' }}>
                {mcqState.currentQuestion.category} • {mcqState.currentQuestion.difficulty}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '20px' }}>
                {mcqState.currentQuestion.question}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {mcqState.currentQuestion.options.map((option: string, idx: number) => {
                  let btnBg = '#222';
                  let btnBorder = '#333';
                  if (selectedAnswer === idx) {
                    btnBg = '#7c3aed';
                    btnBorder = '#a78bfa';
                  }
                  if (roundReveal) {
                    if (idx === roundReveal.correctIndex) {
                      btnBg = '#16a34a';
                      btnBorder = '#4ade80';
                    } else if (selectedAnswer === idx && idx !== roundReveal.correctIndex) {
                      btnBg = '#dc2626';
                      btnBorder = '#f87171';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleMcqAnswer(idx)}
                      disabled={selectedAnswer !== null || roundReveal !== null}
                      style={{
                        padding: '16px',
                        background: btnBg,
                        border: `1px solid ${btnBorder}`,
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '15px',
                        textAlign: 'left',
                        cursor: selectedAnswer !== null ? 'default' : 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}. {option}
                    </button>
                  );
                })}
              </div>

              {roundReveal && (
                <div style={{ padding: '12px', background: '#1e293b', borderRadius: '6px', textAlign: 'center', color: '#cbd5e1' }}>
                  Round Over! Correct Answer: {String.fromCharCode(65 + roundReveal.correctIndex)}. Loading next round...
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#888' }}>Waiting for question...</div>
          )}
        </div>
      ) : (
        /* CODE BATTLE VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left: Problem Details */}
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', height: '520px', overflowY: 'auto' }}>
            {loadingProblem ? (
              <div style={{ color: '#888' }}>Loading problem...</div>
            ) : problemError ? (
              <div style={{ color: '#f87171' }}>
                <p style={{ margin: '0 0 12px' }}>Error loading problem: {problemError}</p>
                <button
                  onClick={() => {
                    setLoadingProblem(true);
                    setProblemError(null);
                    setRetryTrigger((prev) => prev + 1);
                  }}
                  style={{ padding: '6px 12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Retry
                </button>
              </div>
            ) : problem ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{problem.title}</h3>
                  <span style={{ fontSize: '12px', background: '#222', color: '#a78bfa', padding: '4px 8px', borderRadius: '4px' }}>
                    {problem.difficulty}
                  </span>
                </div>
                <p style={{ color: '#ccc', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>{problem.description}</p>

                <h4 style={{ fontSize: '14px', color: '#aaa', margin: '0 0 8px' }}>Public Test Cases</h4>
                {problem.testCases?.map((tc, idx) => (
                  <div key={idx} style={{ background: '#1a1a1a', border: '1px solid #262626', padding: '10px', borderRadius: '6px', marginBottom: '8px', fontSize: '13px' }}>
                    <div><strong style={{ color: '#888' }}>Input:</strong> <code>{tc.input}</code></div>
                    <div><strong style={{ color: '#888' }}>Expected:</strong> <code style={{ color: '#4ade80' }}>{tc.expected}</code></div>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: '#888' }}>No problem loaded.</div>
            )}
          </div>

          {/* Right: Code Editor & Submission */}
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', height: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', color: '#aaa' }}>Language:</label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  if (problem) setCode(getStarterCode(e.target.value, problem.title));
                }}
                style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}
              >
                <option value="python">Python 3</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                flex: 1,
                background: '#050508',
                color: '#4ade80',
                fontFamily: 'monospace',
                fontSize: '14px',
                padding: '12px',
                border: '1px solid #262626',
                borderRadius: '6px',
                resize: 'none',
                outline: 'none',
                marginBottom: '12px',
              }}
            />

            {execResult && (
              <div style={{
                padding: '10px',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '12px',
                maxHeight: '120px',
                overflowY: 'auto',
                background: execResult.status === 'ACCEPTED' ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${execResult.status === 'ACCEPTED' ? '#4ade80' : '#f87171'}`,
                color: execResult.status === 'ACCEPTED' ? '#4ade80' : '#f87171',
              }}>
                <div>Status: <strong>{execResult.status}</strong> ({execResult.passedCount ?? 0} / {execResult.totalCount ?? 0} passed)</div>
                {execResult.error && <div style={{ marginTop: '4px', fontFamily: 'monospace', fontSize: '12px' }}>{execResult.error}</div>}
                {execResult.stderr && <div style={{ marginTop: '4px', fontFamily: 'monospace', fontSize: '12px' }}>Stderr: {execResult.stderr}</div>}
              </div>
            )}

            <button
              onClick={handleSubmitCode}
              disabled={submitting || !problem}
              style={{
                padding: '12px',
                background: submitting ? '#555' : '#7c3aed',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Running Tests...' : 'Submit Solution'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getStarterCode(lang: string, title: string): string {
  if (lang === 'python') {
    return `# Solution for ${title}\nimport sys\n\ndef main():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    # Implement solution here\n\nif __name__ == "__main__":\n    main()\n`;
  }
  if (lang === 'cpp') {
    return `// Solution for ${title}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Implement solution here\n    return 0;\n}\n`;
  }
  return `// Solution for ${title}\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Implement solution here\n    }\n}\n`;
}
