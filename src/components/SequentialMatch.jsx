import  { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target,Clock, AlertTriangle, Sparkles, Cpu } from 'lucide-react';

const initializeGame = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .sort(() => Math.random() - 0.5)
    .map((num, index) => ({ id: index, value: num }));
};

const MOTIVATIONS = ["EXCELLENT", "NEURAL MATCH", "PERFECT SYNC", "DATA SECURED", "KEEP GOING", "GENIUS LEVEL"];

const SequentialMatch = () => {
  const [gameState, setGameState] = useState('START'); 
  const [playerName, setPlayerName] = useState('');
  const [cards, setCards] = useState([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [flippedId, setFlippedId] = useState(null);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [motivate, setMotivate] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'PLAYING') {
      setGameState('LOST');
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  const startGame = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    setCards(initializeGame());
    setGameState('PLAYING');
    setTimeLeft(60);
    setNextExpected(1);
    setSolved([]);
    setMoves(0);
  };

  const handleCardClick = (card) => {
    if (disabled || solved.includes(card.value) || gameState !== 'PLAYING') return;
    setFlippedId(card.id);
    
    if (card.value === nextExpected) {
      setSolved(prev => [...prev, card.value]);
      setNextExpected(prev => prev + 1);
      setFlippedId(null);
      setMotivate(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
      setTimeout(() => setMotivate(""), 1000);

      if (card.value === 9) {
        setGameState('WON');
        clearInterval(timerRef.current);
      }
    } else {
      setDisabled(true);
      setMoves(prev => prev + 1);
      setTimeout(() => {
        setSolved([]);
        setNextExpected(1);
        setFlippedId(null);
        setDisabled(false);
      }, 800);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020202', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: '"Inter", sans-serif', padding: '20px', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background Decorative Elements */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)' }} />
      </div>

      {/* 1. START SCREEN */}
      <AnimatePresence>
        {gameState === 'START' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -50 }} style={{ textAlign: 'center', maxWidth: '450px', width: '100%', zIndex: 10 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ marginBottom: '20px', display: 'inline-block' }}>
              <Cpu size={60} color="#ec4899" />
            </motion.div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', fontStyle: 'italic', marginBottom: '5px', letterSpacing: '-3px' }}>NEURAL <span style={{ color: '#ec4899', textShadow: '0 0 20px rgba(236,72,153,0.5)' }}>SYNC.</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '4px', marginBottom: '40px', textTransform: 'uppercase' }}>Memory Calibrator v1.05</p>
            
            <form onSubmit={startGame} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="SUBJECT IDENTITY" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  style={{ width: '100%', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', textAlign: 'center', outline: 'none', fontSize: '14px', letterSpacing: '2px', fontWeight: 'bold' }}
                />
                <motion.div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: '#ec4899' }} initial={{ width: 0 }} whileFocus={{ width: '100%' }} />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: '#f472b6' }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                style={{ width: '100%', padding: '18px', borderRadius: '50px', backgroundColor: '#ec4899', color: 'white', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '12px', letterSpacing: '3px', boxShadow: '0 10px 30px rgba(236,72,153,0.3)' }}
              >
                INITIALIZE CORE
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PLAYING SCREEN */}
      {gameState === 'PLAYING' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
            <motion.div animate={timeLeft < 10 ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px 25px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Clock size={16} color={timeLeft < 10 ? '#ef4444' : '#ec4899'} />
              <span style={{ fontSize: '18px', fontWeight: '900', fontVariantNumeric: 'tabular-nums', color: timeLeft < 10 ? '#ef4444' : 'white' }}>{timeLeft}s</span>
            </motion.div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px 25px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Target size={16} color="#ec4899" />
              <span style={{ fontSize: '18px', fontWeight: '900' }}>{nextExpected}/9</span>
            </div>
          </div>

          <AnimatePresence>
            {motivate && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: 'absolute', top: '150px', color: '#ec4899', fontWeight: '900', fontSize: '12px', letterSpacing: '4px' }}>
                {motivate}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', width: '340px' }}>
            {cards.map((card) => {
              const isShowing = solved.includes(card.value) || flippedId === card.id;
              return (
                <div key={card.id} style={{ aspectRatio: '1/1', perspective: '1000px' }}>
                  <motion.div 
                    onClick={() => handleCardClick(card)}
                    animate={{ rotateY: isShowing ? 180 : 0, scale: isShowing ? 1.05 : 1 }}
                    whileHover={{ scale: isShowing ? 1.05 : 1.02 }}
                    style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', cursor: 'pointer' }}
                  >
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' }}>
                       <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    </div>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(236,72,153,0.1)', border: '2px solid #ec4899', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', boxShadow: '0 0 20px rgba(236,72,153,0.2)' }}>
                      <span style={{ fontSize: '38px', fontWeight: '900', color: 'white' }}>{card.value}</span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. WIN SCREEN (The Pop) */}
      <AnimatePresence>
        {gameState === 'WON' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', position: 'fixed', inset: 0, background: 'rgba(2,2,2,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ type: "spring", damping: 12 }}>
              <Sparkles size={80} color="#ec4899" style={{ marginBottom: '20px' }} />
            </motion.div>
            <h2 style={{ fontSize: '5rem', fontStyle: 'italic', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-4px' }}>CONGRATS!</h2>
            <p style={{ fontSize: '1.5rem', color: '#ec4899', fontWeight: 'bold', marginBottom: '40px' }}>{playerName}, you synced perfectly!</p>
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setGameState('START')} style={{ padding: '20px 50px', backgroundColor: 'white', color: 'black', borderRadius: '50px', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '14px', letterSpacing: '2px' }}>NEW SESSION</motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. LOSS SCREEN (The Sad Glitch) */}
      <AnimatePresence>
        {gameState === 'LOST' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1, x: [0, -10, 10, -10, 10, 0] }} 
            style={{ textAlign: 'center', position: 'fixed', inset: 0, background: 'rgba(30,0,0,0.98)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          >
            <AlertTriangle size={80} color="#ef4444" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '4rem', fontWeight: '900', color: '#ef4444', letterSpacing: '-2px' }}>SYSTEM HALT.</h2>
            <p style={{ marginBottom: '40px', color: 'white', fontSize: '1.2rem' }}>Synchronization failed, {playerName}.</p>
            <button onClick={() => setGameState('START')} style={{ padding: '18px 45px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50px', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '12px', letterSpacing: '2px' }}>REBOOT CORE</button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SequentialMatch;