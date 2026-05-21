import { Variants } from "motion";

export const variantTextFieldEdit: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: 20 },
};
