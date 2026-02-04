import { useEffect, useRef } from "react";
import { initGame, getLocalWinner } from "../../game/frontend/game";
import { initGame_remot } from "../../game/frontend/remoteGame";
import {   aiinitGame, getaiWinner } from "../../game/frontend/aigame";


export function GamePage(userdata:any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastWinnerRef = useRef<string | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initGame(canvasRef.current, userdata.username);
      const interval = setInterval(() => {
          const data = getLocalWinner();
          // console.log("winneeeeeeeer is: ", data.aiwinner);
          
          if (data.winner !== null && data.winner !== lastWinnerRef.current)
          {
            lastWinnerRef.current = data.winner;
            const winner = data.winner;
            const opponent_username = "LOCAL_GUEST";
            const user_score = data.player1score;
            const opp_score = data.player2score;
            const match_type = "LOCAL";
            gameResults({winner, opponent_username});
            // console.log("hadxiiiii li 3ndi f front ::::: ", opponent_username, user_score, opp_score, match_type);
            gamescore({opponent_username, user_score, opp_score, match_type})
          }
          else if (data.winner === null && lastWinnerRef.current !== null)
          {
            lastWinnerRef.current = null;
          }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="flex justify-center items-center flex-col h-full  w-full gap-[20px] ">
      {/* <div> */}
    <div className=" flex flex-col  items-center ">
      <h1> local game</h1>
      <p>Play with a friend on the same device</p>
      <div className="flex items-center gap-[12px] mb-[6px] space-x-[80px] ">
        <div className="flex flex-col items-center gap-[10px] ">
          <p className="text-[40px] text-gray-500 font-bold mb-[1px] ">Player 1</p>
          <span className="text-[20px] font-black text-[#ff44ff] drop-shadow-[0_0_10px_#ff44ff]">0</span>
        </div>
        
        <div className="text- font-light ">:</div>

        <div className="flex flex-col items-center gap-[10px]">
          <p className="text-[40px] text-gray-500 font-bold mb-[1px]">Player 2</p>
          <span className="text-[20px] font-black text-[#ff44ff] drop-shadow-[0_0_10px_#ff44ff]">0</span>
        </div>
      </div>
    </div>
      <canvas id="board" ref={canvasRef}></canvas>
      {/* </div> */}
    </div>
  );
}

export function Gamepage_r() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initGame_remot (canvasRef.current);
    }
  }, []);

  return (
    <div>
      <canvas id="board" ref={canvasRef}></canvas>
    </div>
  );
}

export function Gamepage_i(userdata:any) {
  // console.log("player issssssssssss ", userdata.username);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastWinnerRef = useRef<string | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      aiinitGame (canvasRef.current, userdata.username);
      const interval = setInterval(() => {
          const data = getaiWinner();
          // console.log("winneeeeeeeer is: ", data.aiwinner);
          
          if (data.aiwinner !== null && data.aiwinner !== lastWinnerRef.current)
          {
            lastWinnerRef.current = data.aiwinner;
            const winner = data.aiwinner;
            const opponent_username = "AI";
            const user_score = data.playerscore;
            const opp_score = data.aiscore;
            const match_type = "AI";
            gameResults({winner, opponent_username});
            console.log("hadxiiiii li 3ndi f front ::::: ", opponent_username, user_score, opp_score, match_type);
            gamescore({opponent_username, user_score, opp_score, match_type})
          }
          else if (data.aiwinner === null && lastWinnerRef.current !== null)
          {
            lastWinnerRef.current = null;
          }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div>
      <canvas id="board" ref={canvasRef}></canvas>
    </div>
  );
}

export async function gameResults(data:{
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

export async function gamescore(data:{
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