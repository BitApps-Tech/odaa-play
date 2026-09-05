import { hashSeed } from "@/lib/site-games";

export type Edge = -1 | 0 | 1;

export type JigsawPiece = {
  id: number;
  row: number;
  col: number;
  left: Edge;
  right: Edge;
  top: Edge;
  bottom: Edge;
};

export function makeJigsaw(rows: number, cols: number, seed: string): JigsawPiece[] {
  const pieces: JigsawPiece[] = [];
  let h = hashSeed(seed);
  const nextEdge = (): Edge => {
    h = Math.imul(h, 1664525) + 1013904223;
    return (h >>> 0) % 2 === 0 ? 1 : -1;
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = col === 0 ? 0 : ((-pieces[row * cols + col - 1]!.right) as Edge);
      const top = row === 0 ? 0 : ((-pieces[(row - 1) * cols + col]!.bottom) as Edge);
      pieces.push({
        id: row * cols + col,
        row,
        col,
        left,
        right: col === cols - 1 ? 0 : nextEdge(),
        top,
        bottom: row === rows - 1 ? 0 : nextEdge(),
      });
    }
  }
  return pieces;
}

function tab(
  axis: "h" | "v",
  from: number,
  to: number,
  shared: number,
  dir: Edge,
  outward: 1 | -1,
) {
  if (dir === 0) {
    return axis === "h" ? `L ${to} ${shared}` : `L ${shared} ${to}`;
  }
  const mid = (from + to) / 2;
  const bump = shared + 20 * outward * dir;
  const a = mid - 12;
  const b = mid + 12;
  if (axis === "h") {
    return `L ${a} ${shared} C ${a} ${shared}, ${mid - 6} ${bump}, ${mid} ${bump} C ${mid + 6} ${bump}, ${b} ${shared}, ${b} ${shared} L ${to} ${shared}`;
  }
  return `L ${shared} ${a} C ${shared} ${a}, ${bump} ${mid - 6}, ${bump} ${mid} C ${bump} ${mid + 6}, ${shared} ${b}, ${shared} ${b} L ${shared} ${to}`;
}

export function jigsawPath(piece: JigsawPiece) {
  const { left, right, top, bottom } = piece;
  return [
    "M 0 0",
    tab("h", 0, 100, 0, top, -1),
    tab("v", 0, 100, 100, right, 1),
    tab("h", 100, 0, 100, bottom, 1),
    tab("v", 100, 0, 0, left, -1),
    "Z",
  ].join(" ");
}
