export type DatabaseColorId =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | null;

export interface DatabaseColor {
  id: DatabaseColorId;
  label: string;
  background: string;
  text: string;
  border: string;
  status: string;
}
export const DATABASE_COLORS: DatabaseColor[] = [
  {
    id: "default",
    label: "По умолчанию",
    background: "var(--board-default-bg)",
    text: "var(--board-default-text)",
    border: "var(--board-default-border)",
    status: "var(--board-default-status)",
  },
  {
    id: "gray",
    label: "Серый",
    background: "var(--board-gray-bg)",
    text: "var(--board-gray-text)",
    border: "var(--board-gray-border)",
    status: "var(--board-gray-status)",
  },
  {
    id: "brown",
    label: "Коричневый",
    background: "var(--board-brown-bg)",
    text: "var(--board-brown-text)",
    border: "var(--board-brown-border)",
    status: "var(--board-brown-status)",
  },
  {
    id: "orange",
    label: "Оранжевый",
    background: "var(--board-orange-bg)",
    text: "var(--board-orange-text)",
    border: "var(--board-orange-border)",
    status: "var(--board-orange-status)",
  },
  {
    id: "yellow",
    label: "Желтый",
    background: "var(--board-yellow-bg)",
    text: "var(--board-yellow-text)",
    border: "var(--board-yellow-border)",
    status: "var(--board-yellow-status)",
  },
  {
    id: "green",
    label: "Зеленый",
    background: "var(--board-green-bg)",
    text: "var(--board-green-text)",
    border: "var(--board-green-border)",
    status: "var(--board-green-status)",
  },
  {
    id: "blue",
    label: "Синий",
    background: "var(--board-blue-bg)",
    text: " var(--board-blue-text)",
    border: "var(--board-blue-border)",
    status: "var(--board-blue-status)",
  },
  {
    id: "red",
    label: "Красный",
    background: "var(--board-red-bg)",
    text: "var(--board-red-text)",
    border: "var(--board-red-border)",
    status: "var(--board-red-status)",
  },
  {
    id: "purple",
    label: "Фиолетовый",
    background: "var(--board-purple-bg)",
    text: "var(--board-purple-text)",
    border: "var(--board-purple-border)",
    status: "var(--board-purple-status)",
  },
  {
    id: "pink",
    label: "Розовый",
    background: "var(--board-pink-bg)",
    text: "var(--board-pink-text)",
    border: "var(--board-pink-border)",
    status: "var(--board-pink-status)",
  },
];

export function getDatabaseColor(id?: DatabaseColorId): DatabaseColor {
  return DATABASE_COLORS.find((c) => c.id === id) ?? DATABASE_COLORS[0];
}
