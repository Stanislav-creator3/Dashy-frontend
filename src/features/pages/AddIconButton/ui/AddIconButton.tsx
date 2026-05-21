import { FaSmile } from "react-icons/fa";

export default function AddIconButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="text-gray flex gap-1 items-center p-1 text-xs cursor-pointer rounded-md transition-bg duration-300 hover:bg-bg-hover"
      onClick={onClick}
    >
      <FaSmile />
      <p>Добавить иконку</p>
    </button>
  );
}
