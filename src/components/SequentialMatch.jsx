import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, RotateCcw } from 'lucide-react';

// Game Logic: Shuffling 1-9
const initializeGame = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .sort(() => Math.random() - 0.5)
    .map((num, index) => ({
      id: index,
      value: num,
    }));
};

const SequentialMatch = () => {
  const [cards, setCards] = useState([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [flippedId, setFlippedId] = useState(null);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    setCards(initializeGame());
  }, []);

  const resetGame = () => {
    setCards(initializeGame());
    setSolved([]);
    setNextExpected(1);
    setFlippedId(null);
    setMoves(0);
    setDisabled(false);
  };

  const handleCardClick = (card) => {
    if (disabled || solved.includes(card.value)) return;
    setFlippedId(card.id);
    
    if (card.value === nextExpected) {
      setSolved(prev => [...prev, card.value]);
      setNextExpected(prev => prev + 1);
      setFlippedId(null);
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: 'white',
      padding: '20px',
      overflow: 'hidden'
    }}>
      
      {/* 1. Header with Fade-In Animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '900', 
          fontStyle: 'italic', 
          margin: '0', 
          letterSpacing: '-2px' 
        }}>
          NEURAL <span style={{ color: '#ec4899' }}>SYNC.</span>
        </h1>
        
        <div style={{
          display: 'inline-flex',
          gap: '20px',
          background: 'rgba(255,255,255,0.05)',
          padding: '10px 25px',
          borderRadius: '50px',
          border: '1px solid rgba(255,255,255,0.1)',
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={16} color="#ec4899" />
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px' }}>
              TARGET: {nextExpected}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
            <Zap size={16} color="rgba(255,255,255,0.4)" />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>
              MISTAKES: {moves}
            </span>
          </div>
          <motion.button 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            onClick={resetGame}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <RotateCcw size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* 2. The 3x3 Animated Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        width: '100%',
        maxWidth: '380px'
      }}>
        {cards.map((card, index) => {
          const isSolved = solved.includes(card.value);
          const isFlippedWrong = flippedId === card.id;
          const isShowing = isSolved || isFlippedWrong;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              style={{ position: 'relative', aspectRatio: '1/1', perspective: '1000px' }}
            >
              <motion.div
                onClick={() => handleCardClick(card)}
                animate={{ rotateY: isShowing ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  cursor: isSolved ? 'default' : 'pointer'
                }}
              >
                {/* BACK OF BOX (Hidden Side) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backfaceVisibility: 'hidden',
                  transition: '0.3s'
                }}>
                  <span style={{ color: 'rgba(236,72,153,0.1)', fontSize: '32px', fontWeight: '900' }}>?</span>
                </div>

                {/* FRONT OF BOX (The Number) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: isSolved ? 'rgba(236,72,153,0.15)' : 'rgba(239,68,68,0.2)',
                  border: isSolved ? '2px solid #ec4899' : '2px solid #ef4444',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  boxShadow: isSolved ? '0 0 20px rgba(236,72,153,0.2)' : 'none'
                }}>
                  <span style={{ 
                    fontSize: '42px', 
                    fontWeight: '900', 
                    color: isSolved ? 'white' : '#fca5a5',
                    textShadow: '0 0 10px rgba(255,255,255,0.3)'
                  }}>
                    {card.value}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Win Overlay Animation */}
      <AnimatePresence>
        {solved.length === 9 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              backdropFilter: 'blur(10px)'
            }}
          >
            <motion.h2 
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ fontSize: '5rem', fontWeight: '900', fontStyle: 'italic', margin: '0' }}
            >
              SYNCED.
            </motion.h2>
            <p style={{ color: '#ec4899', letterSpacing: '5px', fontSize: '10px', fontWeight: 'bold', marginTop: '10px', marginBottom: '40px' }}>
              NEURAL PATHWAY STABILIZED
            </p>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetGame}
              style={{
                padding: '15px 40px',
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '50px',
                fontWeight: '900',
                textTransform: 'uppercase',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Restart Simulation
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

    </div>
  );
};

export default SequentialMatch;