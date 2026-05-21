
export const motionConfig = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.3,
    delay: 0.1,
  },
};

export const animationVariantsOpacity = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};  

export const animationVariantsOpacityX = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -100 },
};