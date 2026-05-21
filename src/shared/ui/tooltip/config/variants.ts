export const tooltipVariants = ({
  direction,
}: {
  direction: "top" | "bottom" | "left" | "right";
}) => {
  switch (direction) {
    case "right":
      return {
        initial: { x: -50, opacity: 0, scale: 0.2 },
        animate: {
          x: 0,
          opacity: 1,
          scale: 1,
        },
        exit: {
          visibility: "hidden",
          scale: 0.2,
          opacity: 0,
        },
      };
    case "left":
      return {
        initial: { x: 50, opacity: 0, scale: 0.2 },
        animate: { x: 0, opacity: 1, scale: 1 },
        exit: {
          visibility: "hidden",
          opacity: 0,
          scale: 0.2,
        },
      };
    case "top":
      return {
        initial: { y: 50, opacity: 0, scale: 0.2 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: {
          visibility: "hidden",
          opacity: 0,
          scale: 0.2,
        },
      };
    case "bottom":
      return {
        initial: { y: -50, opacity: 0, scale: 0.2 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: {
          visibility: "hidden",
          opacity: 0,
          scale: 0.2,
        },
      };
    default:
      break;
  }
};
