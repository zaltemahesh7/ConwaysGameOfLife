import React, { useState, useCallback, useRef } from "react";

const numRow = 30;
const numColomn = 30;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

function ConwaysGameOfLife() {
  const [grid, setGrid] = useState(() => {
    const row = [];
    for (let i = 0; i < numRow; i++) {
      row.push(Array.from(Array(numColomn), () => 0));
    }
    return row;
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return g.map((row, i) =>
        row.map((col, j) => {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRow && newJ >= 0 && newJ < numColomn) {
              neighbors += g[newI][newJ];
            }
          });

          if (col === 1 && (neighbors < 2 || neighbors > 3)) {
            return 0;
          }
          if (col === 0 && neighbors === 3) {
            return 1;
          }
          return col;
        })
      );
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div>
      <div className=" flex items-center justify-center mx-auto gap-3 mt-10">
        <button
          className=" border px-4 py-1 rounded-md bg-green-600"
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          className=" border px-4 py-1 rounded-md"
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRow; i++) {
              rows.push(
                Array.from(Array(numColomn), () =>
                  Math.random() > 0.7 ? 1 : 0
                )
              );
            }
            setGrid(rows);
          }}
        >
          Random
        </button>
        <button
          className=" border px-4 py-1 rounded-md"
          onClick={() => {
            setGrid(() => {
              const rows = [];
              for (let i = 0; i < numRow; i++) {
                rows.push(Array.from(Array(numColomn), () => 0));
              }
              return rows;
            });
          }}
        >
          Clear
        </button>
      </div>
      <div
        className="justify-center mt-10"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numColomn}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = [...grid];
                newGrid[i][j] = grid[i][j] ? 0 : 1;
                setGrid(newGrid);
              }}
              className="h-4 border w-4"
              style={{
                backgroundColor: grid[i][j] ? "black" : undefined,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ConwaysGameOfLife;
