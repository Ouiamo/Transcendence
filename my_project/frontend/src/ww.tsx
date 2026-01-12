import React, { useEffect, useState } from "react";
import { Gamepad2 } from "lucide-react";

interface HomeProps {
    gotoLogin: () => void;
    gotoSignup: () => void;
}

function Home({ gotoLogin, gotoSignup }: HomeProps) {
    const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
    const [ballVelocity, setBallVelocity] = useState({ x: 2, y: 1.5 });
    const [leftPaddleY, setLeftPaddleY] = useState(40);
    const [rightPaddleY, setRightPaddleY] = useState(40);

    useEffect(() => {
        const interval = setInterval(() => {
            setBallPosition(prev => {
                let newX = prev.x + ballVelocity.x;
                let newY = prev.y + ballVelocity.y;
                let newVelX = ballVelocity.x;
                let newVelY = ballVelocity.y;

                // Rebond haut/bas
                if (newY <= 0 || newY >= 100) {
                    newVelY = -newVelY;
                    newY = newY <= 0 ? 0 : 100;
                }

                // Rebond gauche (raquette)
                if (newX <= 5 && newY >= leftPaddleY && newY <= leftPaddleY + 20) {
                    newVelX = -newVelX;
                    newX = 5;
                }

                // Rebond droite (raquette)
                if (newX >= 95 && newY >= rightPaddleY && newY <= rightPaddleY + 20) {
                    newVelX = -newVelX;
                    newX = 95;
                }

                // Reset si sort
                if (newX < 0 || newX > 100) {
                    newX = 50;
                    newY = 50;
                }

                setBallVelocity({ x: newVelX, y: newVelY });

                // Déplacer les raquettes vers la balle
                setLeftPaddleY(prev => {
                    const target = newY - 10;
                    return prev + (target - prev) * 0.1;
                });
                setRightPaddleY(prev => {
                    const target = newY - 10;
                    return prev + (target - prev) * 0.1;
                });

                return { x: newX, y: newY };
            });
        }, 50);

        return () => clearInterval(interval);
    }, [ballVelocity, leftPaddleY, rightPaddleY]);

    return (
        <div className="relative min-h-screen w-full bg-[#0d0221] flex items-center justify-center overflow-hidden">
            {/* Animation Pong en arrière-plan */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="relative w-[600px] h-[400px] border-2 border-[#ff44ff]/30 rounded-lg">
                    {/* Ligne centrale */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[2px] border-l-2 border-dashed border-[#ff44ff]/30"></div>
                    
                    {/* Raquette gauche */}
                    <div 
                        className="absolute left-2 w-3 h-20 bg-gradient-to-r from-[#ff44ff] to-[#ff99ff] rounded-full shadow-[0_0_20px_rgba(255,68,255,0.6)]"
                        style={{ top: `${leftPaddleY}%` }}
                    ></div>
                    
                    {/* Raquette droite */}
                    <div 
                        className="absolute right-2 w-3 h-20 bg-gradient-to-r from-[#ff44ff] to-[#ff99ff] rounded-full shadow-[0_0_20px_rgba(255,68,255,0.6)]"
                        style={{ top: `${rightPaddleY}%` }}
                    ></div>
                    
                    {/* Balle */}
                    <div 
                        className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                        style={{ 
                            left: `${ballPosition.x}%`, 
                            top: `${ballPosition.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    ></div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="relative z-10 flex flex-col items-center gap-12 px-8">
                {/* Logo */}
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-gradient-to-br from-[#ff44ff] to-[#ff99ff] p-6 rounded-full shadow-[0_0_40px_rgba(255,68,255,0.8)]">
                        <Gamepad2 className="text-white" size={64} />
                    </div>
                    
                    <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]">
                        PONG
                    </h1>
                    
                    <p className="text-white/70 text-lg">
                        Bienvenue ! Connectez-vous à votre compte
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-4 w-[300px]">
                    <button
                        onClick={gotoLogin}
                        className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff] text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_20px_rgba(255,68,255,0.5)] hover:shadow-[0_0_35px_rgba(255,68,255,0.8)] hover:scale-[1.05] active:scale-[0.98]"
                    >
                        Connexion
                    </button>

                    <button
                        onClick={gotoSignup}
                        className="w-full py-4 px-8 rounded-full bg-transparent text-[#ff44ff] font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-2 border-[#ff44ff] hover:bg-[#ff44ff]/10 hover:scale-[1.05] active:scale-[0.98]"
                    >
                        Inscription
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;