import { stagger, Variants } from "motion";

const childrenContainer: Variants = {
  open: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.03, { startDelay: 0.03 }),
      layout: { duration: 0.2 },
    },
  },
  closed: {
    opacity: 0,
    transition: { delayChildren: stagger(0), layout: { duration: 0.2 } },
  },
};

const childItem: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" },
  },
  closed: { opacity: 0, y: -6, transition: { duration: 0.15, ease: "easeIn" } },
};

export { childrenContainer, childItem };
