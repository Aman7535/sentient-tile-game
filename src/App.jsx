import { useState, useEffect } from "react";

const images = [
  "/pic1.jpg",
  "/pic2.jpg",
  "/pic3.jpg",
  "/pic4.jpg",
  "/pic5.jpg",
  "/pic6.jpg",
  "/pic7.jpg",
  "/pic8.jpg",
];

export default function App() {
  const [tiles, setTiles] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const handleClick = (tile) => {
    if (flipped.length === 2 || flipped.find((f) => f.id === tile.id)) return;
    setFlipped([...flipped, tile]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      if (flipped[0].image === flipped[1].image) {
        setMatched([...matched, flipped[0].id, flipped[1].id]);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  }, [flipped]);

  const resetGame = () => {
    const shuffled = [...images, ...images]
      .sort(() => Math.random() - 0.5)
      .map((image, i) => ({ id: i, image }));
    setTiles(shuffled);
    setFlipped([]);
    setMatched([]);
    setTime(0);
    setRunning(true);
  };

  const formatTime = (t) => {
    const minutes = String(Math.floor(t / 60)).padStart(2, "0");
    const seconds = String(t % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-4 sm:p-6">
      <div className="flex flex-col items-center space-y-6 w-full max-w-5xl">
        {/* Title & Logo */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <img src="/logo.png" alt="Game Logo" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg" />
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-cyan-300 drop-shadow-lg">
            SENTIENT TILE MATCH GAME
          </h1>
          <p className="text-lg sm:text-xl font-bold text-white bg-black/30 px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md">
            ⏱ {formatTime(time)}
          </p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {tiles.map((tile) => {
            const isFlipped = flipped.find((f) => f.id === tile.id);
            const isMatched = matched.includes(tile.id);
            return (
              <div
                key={tile.id}
                onClick={() => handleClick(tile)}
                className={`w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36
                  flex items-center justify-center rounded-xl cursor-pointer 
                  overflow-hidden transition-all duration-500 transform
                  ${
                    isFlipped || isMatched
                      ? "bg-white/20 border border-cyan-400 shadow-lg scale-105"
                      : "bg-black/50 border border-gray-700 hover:scale-105"
                  }
                  ${isMatched ? "opacity-60" : ""}`}
              >
                {isFlipped || isMatched ? (
                  <img src={tile.image} alt="tile" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-xl sm:text-2xl md:text-3xl">❓</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Win Message */}
        {matched.length === tiles.length && tiles.length > 0 && (
          <div className="text-xl sm:text-2xl font-extrabold text-cyan-300 drop-shadow-lg animate-bounce text-center">
            🎉 You Win in {formatTime(time)}! 🎉
          </div>
        )}

        {/* Restart Button */}
        <button
          onClick={resetGame}
          className="px-6 py-3 sm:px-8 sm:py-4 bg-cyan-500/20 border border-cyan-400 text-cyan-200 rounded-xl shadow-lg hover:bg-cyan-400/30 hover:scale-110 transition-all font-semibold text-base sm:text-lg"
        >
          🔄 Restart
        </button>
      </div>
    </div>
  );
}
