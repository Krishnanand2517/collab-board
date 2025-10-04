const COLORS = [
  "#E57373", // Red
  "#81C784", // Green
  "#64B5F6", // Blue
  "#FFD54F", // Yellow
  "#BA68C8", // Purple
  "#4DB6AC", // Teal
  "#FF8A65", // Orange
];

// Cache to store generated colors for each user
const colorCache = new Map<string, string>();

export const stringToColor = (identifier: string): string => {
  if (colorCache.has(identifier)) {
    return colorCache.get(identifier)!;
  }

  const index = Math.floor(Math.random() * COLORS.length);
  const color = COLORS[index];

  colorCache.set(identifier, color);
  return color;
};
