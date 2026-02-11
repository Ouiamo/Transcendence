import { useEffect, useRef, useState } from "react";
import { initGame, getLocalWinner } from "../../game/frontend/game";
import { initGame_remot, cleanupGame, getRemoteGameState} from "../../game/frontend/remoteGame";
import { aiinitGame, getaiWinner } from "../../game/frontend/aigame";
import { getSocket } from "./socketService";


export function GamePage(userdata: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastWinnerRef = useRef<string | null>(null);
  
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const cleanupGame = initGame(canvasRef.current, userdata.username);

    const interval = setInterval(() => {
      const data = getLocalWinner();
      
      setPlayer1Score(data.playerscore);
      setPlayer2Score(data.Guestscore);

      if (data.winner !== null && data.winner !== lastWinnerRef.current) {
        lastWinnerRef.current = data.winner;

        const winner = data.winner;
        const opponent_username = "LOCAL_GUEST";
        const user_score = data.playerscore;
        const opp_id = -1;
        const opp_score = data.Guestscore;
        const match_type = "LOCAL";

        gameResults({ winner, opponent_username });
        gamescore({ opponent_username, user_score, opp_score,opp_id, match_type });
      }
      else if (data.winner === null && lastWinnerRef.current !== null) {
        lastWinnerRef.current = null;
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (typeof cleanupGame === 'function')
        cleanupGame();
      console.log("Game Cleaned Up");
    };
  }, [userdata.username]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full   px-[40px]">
      <div className="flex flex-col items-center text-center mb-[30px]">
        <h1 className=" uppercase glow-text ">Local Game</h1>
        <p className="text-gray-400 text-sm">Play with a friend on the same device</p>
      </div>

      <div className="flex items-center gap-[60px] mb-[40px]">
        <div className="flex flex-col items-center">
          <p className="text-[20px] text-gray-500 font-bold uppercase tracking-widest mb-2" style={{ WebkitTextStroke: '2px #c44cff' }}>GUEST</p>
          <span className="text-[40px] text-[#c44cff] [text-shadow:_0_0_15px_rgba(255,68,255,0.8),_0_0_30px_rgba(255,68,255,0.4)]">{player2Score}</span>
        </div>

        <div className="text-3xl font-light text-gray-700 self-end pb-[2px]">:</div>

        <div className="flex flex-col items-center">
          <p className="text-[20px] text-gray-500 font-bold uppercase tracking-widest mb-2" style={{ WebkitTextStroke: '2px #c44cff' }}>{userdata.username}</p>
          <span className="text-[40px] font-black text-[#c44cff] [text-shadow:_0_0_15px_rgba(255,68,255,0.8),_0_0_30px_rgba(255,68,255,0.4)]">{player1Score}</span>
        </div>
      </div>

      <div className="relative p-[1px] border-[2px] border-[#ff44ff]/30  shadow-[0_0_20px_rgba(255,68,255,0.8)]">
        <canvas
          id="board"
          ref={canvasRef}
          className="max-w-full h-auto block mx-auto rounded-2xl bg-[#000]"
          width={800}
          height={450}
        ></canvas>
      </div>
      <div className="mt-[30px] flex gap-[100px] text-[12px]   uppercase ">
        <div className="flex items-center gap-[13px] ">
          <p className="text-[#c44cff] text-[20px]">Player 1</p>
          <p className="text-[20px] [text-shadow:_0_0_1px_white] font-black" style={{ WebkitTextStroke: '2px #c44cff' }}>:</p>
          <div className="flex gap-[13px]">
            <kbd className="px-[4px] py-[4px] bg-white/5 border border-white/20 rounded-md text-white shadow-[0_0_5px_rgba(255,255,255,0.2)]">W</kbd>
            <kbd className="px-[4px] py-[4px] bg-white/5 border border-white/20 rounded-md text-white shadow-[0_0_5px_rgba(255,255,255,0.2)]">S</kbd>
          </div>
        </div>
        <div className="flex items-center gap-[13px]">
          <p className="text-[#c44cff] text-[20px]">Player 2</p>
            <p className="text-[20px] [text-shadow:_0_0_1px_white] font-black" style={{ WebkitTextStroke: '2px #c44cff' }}>:</p>
          <div className="flex gap-[13px]">
            <kbd className="px-[4px] py-[4px]  border  rounded-md text-white shadow-[0_0_5px_rgba(255,255,255,0.2)] text-[16px]">↑</kbd>
            <kbd className="px-[4px] py-[4px]  border  rounded-md text-white shadow-[0_0_5px_rgba(255,255,255,0.2)] text-[16px]">↓</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Gamepage_r() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastWinnerRef = useRef<string | null>(null);

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  useEffect(() => {
    if (!canvasRef.current) return;
    const existingSocket = getSocket();
    const roomData = localStorage.getItem('private_game_data');
    console.log("Gamepage_r initializing with socket:", !!existingSocket);
    console.log("Room data available:", !!roomData);
      initGame_remot(
        canvasRef.current, 
        existingSocket as any, 
        roomData ? JSON.parse(roomData) : undefined
      );
      const interval = setInterval(() => {
      const data = getRemoteGameState();
      setPlayer1Score(data.score1);
      setPlayer2Score(data.score2);
      setPlayer1Name(data.player1Username);
      setPlayer2Name(data.player2Username);
      if (data.winner !== null && data.winner !== lastWinnerRef.current) {
        lastWinnerRef.current = data.winner;

        const winner = data.winner;
        const opponent_username = data.player1Username;
        const opp_id = data.oppid;
        const user_score = data.score1;
        const opp_score = data.score2;
        const match_type = "REMOTE";

        gameResults({ winner, opponent_username });
        gamescore({ opponent_username, user_score, opp_score,opp_id, match_type });
      }
      else if (data.winner === null && lastWinnerRef.current !== null) {
        lastWinnerRef.current = null;
      }
    }, 100);
      return () => {
      clearInterval(interval);
      cleanupGame();
      console.log("Game Cleaned Up");
    };
  }, []);

  return (
     <div className="flex flex-col items-center justify-start w-full h-full bg-[#0b0618] pt-[5vh] px-[40px]">
      <div className="flex flex-col items-center text-center mb-[30px]">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Remote Game</h1>
        <p className="text-gray-400 text-sm">Play with a friend</p>
      </div>

      <div className="flex items-center gap-[60px] mb-[40px]">
        <div className="flex flex-col items-center">
          <p className="text-[20px] text-gray-500 font-bold uppercase tracking-widest mb-2" style={{ WebkitTextStroke: '2px #c44cff' }}>{player1Name}</p>
          <span className="text-[40px] text-[#c44cff] [text-shadow:_0_0_15px_rgba(255,68,255,0.8),_0_0_30px_rgba(255,68,255,0.4)]">{player1Score}</span>
        </div>

        <div className="text-3xl font-light text-gray-700 self-end pb-[2px]">:</div>

        <div className="flex flex-col items-center">
          <p className="text-[20px] text-gray-500 font-bold uppercase tracking-widest mb-2" style={{ WebkitTextStroke: '2px #c44cff' }}>{player2Name}</p>
          <span className="text-[40px] font-black text-[#c44cff] [text-shadow:_0_0_15px_rgba(255,68,255,0.8),_0_0_30px_rgba(255,68,255,0.4)]">{player2Score}</span>
        </div>
      </div>

      <div className="relative p-[1px] border-[2px] border-[#ff44ff]/30  shadow-[0_0_20px_rgba(255,68,255,0.8)]">
        <canvas
          id="board"
          ref={canvasRef}
          className="max-w-full h-auto block mx-auto rounded-2xl bg-[#000]"
          width={900}
          height={450}
        ></canvas>
      </div>
      <div className="mt-[30px] flex gap-[100px] text-[12px]   uppercase ">
        <div className="flex items-center gap-[13px] ">
          <p className="text-[#c44cff] text-[20px]">Player 1</p>
          <p className="text-[20px] [text-shadow:_0_0_1px_white] font-black" style={{ WebkitTextStroke: '2px #c44cff' }}>:</p>
          <div className="flex gap-[13px]">
            <kbd className="px-[4px] py-[4px] bg-white/5 border border-white/20 rounded-md text-white shadow-[0_0_5px_rgba(255,255,255,0.2)]">W</kbd>
            <kbd className="px-[4px] py-[4px] bg-white/5 border border-white/20 rounded-md text-white shadow-[0_0_5px_rgba(255,255,255,0.2)]">S</kbd>
          </div>
        </div>
        <div className="flex items-center gap-[13px]">
          <p className="text-[#c44cff] text-[20px]">Player 2</p>
            <p className="text-[20px] [text-shadow:_0_0_1px_white] font-black" style={{ WebkitTextStroke: '2px #c44cff' }}>:</p>
          <div className="flex gap-[13px]">
            <kbd className="px-[4px] py-[4px]  border  rounded-md text-white shadow-[0_0_5px_rgba(255,255,255,0.2)] text-[16px]">↑</kbd>
            <kbd className="px-[4px] py-[4px]  border  rounded-md text-white shadow-[0_0_5px_rgba(255,255,255,0.2)] text-[16px]">↓</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Gamepage_i(userdata: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastWinnerRef = useRef<string | null>(null);

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return; 

    aiinitGame(canvasRef.current, userdata.username);
    const interval = setInterval(() => {
      const data = getaiWinner();
      setPlayer1Score(data.aiscore);
      setPlayer2Score(data.playerscore);

      if (data.aiwinner !== null && data.aiwinner !== lastWinnerRef.current) {
        lastWinnerRef.current = data.aiwinner;
        const winner = data.aiwinner;
        const opponent_username = "AI";
        const user_score = data.playerscore;
        const opp_id = -1;
        const opp_score = data.aiscore;
        const match_type = "AI";
        gameResults({ winner, opponent_username });
        console.log("hadxiiiii li 3ndi f front ::::: ", opponent_username, user_score, opp_score, match_type);
        gamescore({ opponent_username, user_score, opp_score,opp_id, match_type });
      }
      else if (data.aiwinner === null && lastWinnerRef.current !== null) {
        lastWinnerRef.current = null;
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [userdata.username]);

  return (
   <div className="flex flex-col items-center justify-start w-full h-full bg-gradient-to-br from-[#0d0221] via-[#1a043a] to-[#0d0221] pt-[5vh] px-[40px]">
      <div className="flex flex-col items-center text-center mb-[30px]">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter glow-text">IA Game</h1>
       <p className="text-gray-400 text-sm">Challenge our advanced AI and test your skills</p>
      </div>

      <div className="flex items-center gap-[60px] mb-[40px]">
        <div className="flex flex-col items-center">
          <p className="text-[20px] text-gray-500 font-bold uppercase tracking-widest mb-2 "  style={{ WebkitTextStroke: '2px #c44cff' }}>BOT</p>
          <span className="text-[40px] text-[#c44cff] [text-shadow:_0_0_15px_rgba(255,68,255,0.8),_0_0_30px_rgba(255,68,255,0.4)]">{player1Score}</span>
        </div>

        <div className="text-3xl font-light text-gray-700 self-end pb-[2px]">:</div>

        <div className="flex flex-col items-center">
          <p className="text-[20px] text-gray-500 font-bold uppercase tracking-widest mb-2" style={{ WebkitTextStroke: '2px #c44cff' }}>{userdata.username}</p>
          <span className="text-[40px] font-black text-[#c44cff] [text-shadow:_0_0_15px_rgba(255,68,255,0.8),_0_0_30px_rgba(255,68,255,0.4)]">{player2Score}</span>
        </div>
      </div>

      <div className="relative p-[1px] border-[2px] border-[#ff44ff]/30  shadow-[0_0_20px_rgba(255,68,255,0.8)]">
        <canvas
          id="board"
          ref={canvasRef}
          className="max-w-full h-auto block mx-auto rounded-2xl bg-[#000]"
          width={800}
          height={450}
        ></canvas>
      </div>
      <div className="mt-[30px] flex gap-[100px] text-[12px]   uppercase ">
        <div className="flex items-center gap-[13px]">
          <p className="text-[#c44cff] text-[20px]">Player 2</p>
            <p className="text-[20px] [text-shadow:_0_0_1px_white] font-black" style={{ WebkitTextStroke: '2px #c44cff' }}>:</p>
          <div className="flex gap-[13px]">
            <kbd className="px-[4px] py-[4px]  border  rounded-md text-white shadow-[0_0_5px_rgba(255,255,255,0.2)] text-[16px]">↑</kbd>
            <kbd className="px-[4px] py-[4px]  border  rounded-md text-white shadow-[0_0_5px_rgba(255,255,255,0.2)] text-[16px]">↓</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function gameResults(data: {
  winner: string;
  opponent_username: string;
}) {
  const response = await fetch(`https://10.13.249.23:3010/api/stats/game_results`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function gamescore(data: {
  opponent_username: string;
  user_score: number;
  opp_score: number;
  opp_id: number;
  match_type: string;
}) {
  console.log("game score g front:: ", data.opponent_username, data.user_score, data.opp_score, data.match_type);
  const response = await fetch(`https://10.13.249.23:3010/api/history/new_score`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  return await response.json();
}