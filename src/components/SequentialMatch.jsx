import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, RotateCcw, User, Clock } from 'lucide-react';

const initializeGame = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .sort(() => Math.random() - 0.5)
    .map((num, index) => ({ id: index, value: num }));
};

const SequentialMatch = () => {
  // Game States
  const [gameState, setGameState] = useState('START'); // START, PLAYING, WON, LOST
  const [playerName, setPlayerName] = useState('');
  const [cards, setCards] = useState([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [flippedId, setFlippedId] = useState(null);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const timerRef = useRef(null);

  // Timer Logic
  useEffect(() => {
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
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
    setTimeLeft(180);
    setNextExpected(1);
    setSolved([]);
    setMoves(0);
  };

  const resetGame = () => {
    clearInterval(timerRef.current);
    setGameState('START');
    setPlayerName('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCardClick = (card) => {
    if (disabled || solved.includes(card.value) || gameState !== 'PLAYING') return;
    setFlippedId(card.id);
    
    if (card.value === nextExpected) {
      const newSolved = [...solved, card.value];
      setSolved(newSolved);
      setNextExpected(prev => prev + 1);
      setFlippedId(null);
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
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      
      {/* 1. START SCREEN */}
      <AnimatePresence>
        {gameState === 'START' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', fontStyle: 'italic', marginBottom: '10px' }}>NEURAL <span style={{ color: '#ec4899' }}>SYNC.</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '2px', marginBottom: '30px' }}>SEQUENCE AUTHORIZATION REQUIRED</p>
            <form onSubmit={startGame}>
              <input 
                autoFocus
                type="text" 
                placeholder="ENTER SUBJECT NAME" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', textAlign: 'center', outline: 'none', marginBottom: '20px' }}
              />
              <button type="submit" style={{ width: '100%', padding: '15px', borderRadius: '50px', backgroundColor: '#ec4899', color: 'white', fontWeight: '900', border: 'none', cursor: 'pointer' }}>INITIALIZE</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PLAYING SCREEN */}
      {gameState === 'PLAYING' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px 20px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Clock size={14} color={timeLeft < 30 ? '#ef4444' : '#ec4899'} />
              <span style={{ fontSize: '14px', fontWeight: 'bold', fontMono: 'true' }}>{formatTime(timeLeft)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px 20px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Target size={14} color="#ec4899" />
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>FIND: {nextExpected}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', width: '320px' }}>
            {cards.map((card) => {
              const isShowing = solved.includes(card.value) || flippedId === card.id;
              return (
                <div key={card.id} style={{ aspectRatio: '1/1', perspective: '1000px' }}>
                  <motion.div 
                    onClick={() => handleCardClick(card)}
                    animate={{ rotateY: isShowing ? 180 : 0 }}
                    style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', cursor: 'pointer' }}
                  >
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justify: 'center', backfaceVisibility: 'hidden' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ec489920', border: '2px solid #ec4899', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <span style={{ fontSize: '32px', fontWeight: '900' }}>{card.value}</span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
          <p style={{ marginTop: '30px', color: 'rgba(255,255,255,0.3)', fontSize: '10px', textTransform: 'uppercase' }}>Subject: {playerName}</p>
        </div>
      )}

      {/* 3. WIN SCREEN */}
      <AnimatePresence>
        {gameState === 'WON' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <h2 style={{ fontSize: '4rem', fontStyle: 'italic', fontWeight: '900', margin: 0 }}>CONGRATS!</h2>
            <p style={{ fontSize: '1.5rem', color: '#ec4899', marginBottom: '40px' }}>{playerName}, You successfully synced!</p>
            <button onClick={resetGame} style={{ padding: '15px 40px', backgroundColor: 'white', color: 'black', borderRadius: '50px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>NEW SESSION</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. TIME OVER SCREEN */}
      <AnimatePresence>
        {gameState === 'LOST' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', position: 'fixed', inset: 0, background: 'rgba(239,68,68,0.1)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#ef4444' }}>SYNC FAILED.</h2>
            <p style={{ marginBottom: '40px' }}>Time has expired, {playerName}.</p>
            <button onClick={resetGame} style={{ padding: '15px 40px', backgroundColor: 'white', color: 'black', borderRadius: '50px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>RESTART CORE</button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SequentialMatch;