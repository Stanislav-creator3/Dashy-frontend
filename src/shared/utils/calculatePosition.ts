export const calculatePosition = (prev?: number, next?: number) => {
  console.log("calculatePosition", prev, next);
  if (prev && next) return (prev + next) / 2;
  if (next && !prev) return next / 2;
  if (prev && !next) return prev + 1;
  return 1;
};
