const COLS = 18;
const ROWS = 11;
const cx = (COLS - 1) / 2;
const cy = (ROWS - 1) / 2;
const maxDist = Math.sqrt(cx * cx + cy * cy);

const dots = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2);
  return {
    id: i,
    left: `${(col / (COLS - 1)) * 96 + 2}%`,
    top: `${(row / (ROWS - 1)) * 96 + 2}%`,
    delay: `${((dist / maxDist) * 2.5).toFixed(2)}s`,
  };
});

export default function DotGridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map(dot => (
        <div
          key={dot.id}
          className="absolute w-1.5 h-1.5 rounded-full bg-accent-500"
          style={{
            left: dot.left,
            top: dot.top,
            animation: `dotPulse 3s ease-in-out ${dot.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
