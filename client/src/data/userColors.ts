const COLORS = [
  "#E57373", // Red
  "#81C784", // Green
  "#64B5F6", // Blue
  "#FFD54F", // Yellow
  "#BA68C8", // Purple
  "#4DB6AC", // Teal
  "#FF8A65", // Orange
];

export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const seed = hash + Date.now() + Math.random() * 1000000;
  const index = Math.floor(Math.abs(seed) % COLORS.length);
  return COLORS[index];
};
