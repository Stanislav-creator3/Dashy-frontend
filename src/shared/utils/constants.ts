export const typeLabels = {
  interviews: "Собеседования",
  projects: "Проекты",
  offers: "Офферы",
  output: "Остальное",
  onboarding: "Онбординг",
};

export const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL as string;

export const textColors = [
  { label: "По умолчанию", color: "var(--color-text)" },
  { label: "Серый", color: "var(--color-text-gray)" },
  { label: "Коричневый", color: "var(--color-text-brown)" },
  { label: "Оранжевый", color: "var(--color-text-orange)" },
  { label: "Жёлтый", color: "var(--color-text-yellow)" },
  { label: "Зелёный", color: "var(--color-text-green)" },
  { label: "Синий", color: "var(--color-text-blue)" },
  { label: "Фиолетовый", color: "var(--color-text-purple)" },
  { label: "Розовый", color: "var(--color-text-pink)" },
  { label: "Красный", color: "var(--color-text-red)" },
];

export const backgroundColors = [
  { label: "По умолчанию", color: "transparent" },
  { label: "Серый", color: "var(--color-bg-gray)" },
  { label: "Коричневый", color: "var(--color-bg-brown)" },
  { label: "Оранжевый", color: "var(--color-bg-orange)" },
  { label: "Жёлтый", color: "var(--color-bg-yellow)" },
  { label: "Зелёный", color: "var(--color-bg-green)" },
  { label: "Синий", color: "var(--color-bg-blue)" },
  { label: "Фиолетовый", color: "var(--color-bg-purple)" },
  { label: "Розовый", color: "var(--color-bg-pink)" },
  { label: "Красный", color: "var(--color-bg-red)" },
];
