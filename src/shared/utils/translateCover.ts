export type Cover =
  | "archirecture"
  | "architecture-painting"
  | "gradient"
  | "painting"
  | "planet-earth"
  | string;

export function translateCover({ cover }: { cover: Cover }) {
  switch (cover) {
    case "archirecture":
      return "Архитектура";
    case "planet-earth":
      return "Планета Земля";
    case "painting":
      return "Живопись";
    case "architecture-painting":
      return "Архитектура + Живопись";
    case "gradient":
      return "Градиент";
    default:
      return "Изображение";
  }
}
