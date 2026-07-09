import { BOARD_COLORS } from "../hooks/useColor";

export function ColorBoard() {
  return (
    <div className="flex flex-wrap gap-2">
      {BOARD_COLORS.map((color) => (
        <div
          key={color.id}
          className="w-6 h-6 rounded-full cursor-pointer"
          style={{ backgroundColor: color.background }}
        />
      ))}
    </div>
  );
}
