import { useEffect, useRef, useState } from "react";
import { initGame, getLocalWinner } from "../../game/frontend/game";
import { initGame_remot } from "../../game/frontend/remoteGame";
import { aiinitGame, getaiWinner } from "../../game/frontend/aigame";


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
      
      // Update scores in real-time
      setPlayer1Score(data.player1score);
      setPlayer2Score(data.player2score);

      if (data.winner !== null && data.winner !== lastWinnerRef.current) {
        lastWinnerRef.current = data.winner;

        const winner = data.winner;
        const opponent_username = "LOCAL_GUEST";
        const user_score = data.player1score;
        const opp_score = data.player2score;
        const match_type = "LOCAL";

        gameResults({ winner, opponent_username });
        gamescore({ opponent_username, user_score, opp_score, match_type });
      }
      else if (data.winner === null && lastWinnerRef.current !== null) {
        lastWinnerRef.current = null;
      }
    }, 100); // Changed from 1000 to 100 for smoother updates


    return () => {
      clearInterval(interval);
    
      if (typeof cleanupGame === 'function')
        cleanupGame();

  
      console.log("Game Cleaned Up");
    };
  }, [userdata.username]);

  return (

    <div className="flex flex-col items-center justify-start w-full h-full bg-[#0b0618] pt-[5vh] px-[40px]">


      <div className="flex flex-col items-center text-center mb-[30px]">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Local Game</h1>
        <p className="text-gray-400 text-sm">Play with a friend on the same device</p>
      </div>


      <div className="flex items-center gap-[60px] mb-[40px]">
        <div className="flex flex-col items-center">
          <p className="text-[20px] text-gray-500 font-bold uppercase tracking-widest mb-2" style={{ WebkitTextStroke: '2px #c44cff' }}>GUEST</p>
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

  useEffect(() => {
    if (canvasRef.current) {
      initGame_remot(canvasRef.current);
    }
  }, []);

  return (
    <div>
      <canvas id="board" ref={canvasRef}></canvas>
    </div>
  );
}

export function Gamepage_i(userdata: any) {
  // console.log("player issssssssssss ", userdata.username);
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
        // console.log("winneeeeeeeer is: ", data.aiwinner);

        if (data.aiwinner !== null && data.aiwinner !== lastWinnerRef.current) {
          lastWinnerRef.current = data.aiwinner;
          const winner = data.aiwinner;
          const opponent_username = "AI";
          const user_score = data.playerscore;
          const opp_score = data.aiscore;
          const match_type = "AI";
          gameResults({ winner, opponent_username });
          console.log("hadxiiiii li 3ndi f front ::::: ", opponent_username, user_score, opp_score, match_type);
          gamescore({ opponent_username, user_score, opp_score, match_type })
        }
        else if (data.aiwinner === null && lastWinnerRef.current !== null) {
          lastWinnerRef.current = null;
        }
      }, 100);
      return () => clearInterval(interval);
    
  }, []);

  return (
   <div className="flex flex-col items-center justify-start w-full h-full bg-[#0b0618] pt-[5vh] px-[40px]">


      <div className="flex flex-col items-center text-center mb-[30px]">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">IA Game</h1>
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
  const response = await fetch(`https://localhost:3010/api/stats/game_results`, { // kant backend
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
  match_type: string;
}) {
  console.log("game score g front:: ", data.opponent_username, data.user_score, data.opp_score, data.match_type);
  const response = await fetch(`https://localhost:3010/api/history/new_score`, { // kant backend
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  return await response.json();
}