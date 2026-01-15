import { useEffect, useRef } from "react";
import { initGame } from "../../game/frontend/game";
import { initGame_remot } from "../../game/frontend/remoteGame";

export function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initGame(canvasRef.current);
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