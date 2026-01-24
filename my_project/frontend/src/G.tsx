import { useEffect, useRef } from "react";
import { initGame } from "../../game/frontend/game";
import { initGame_remot } from "../../game/frontend/remoteGame";
import {   aiinitGame } from "../../game/frontend/aigame";


export function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const winner = initGame(canvasRef.current);
      
    }
  }, []);

  return (
    <div>
      <canvas id="board" ref={canvasRef}></canvas>
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

export function Gamepage_i() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      aiinitGame (canvasRef.current);
    }
  }, []);

  return (
    <div>
      <canvas id="board" ref={canvasRef}></canvas>
    </div>
  );
}