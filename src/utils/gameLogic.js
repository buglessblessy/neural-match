export const SYMBOLS_SEQUENTIAL = ['⚛️', '🚀', '💻', '🎨', '🔥', '⭐️', '⚡️', '☀️', '🌀'];

export const initializeSequentialGame = () => {
  // 1. Create numbers 1-9
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // 2. Shuffle them
  const shuffledNumbers = numbers
    .sort(() => Math.random() - 0.5)
    .map((num, index) => ({
      id: index, // Unique ID for the grid cell
      value: num, // The number itself
      symbol: SYMBOLS_SEQUENTIAL[num - 1], // (Optional) a matching symbol
    }));

  return shuffledNumbers;
};