"use client";
import { motion, stagger, useAnimate } from "motion/react";
import Link from "next/link";

export default function Logo() {
  const [scope, animate] = useAnimate();

  const onHover = () => {
    animate([
      [".letter", { y: -32 }, { duration: 0.2, delay: stagger(0.05) }],
      [".letter", { y: 0 }, { duration: 0.000001 }],
    ]);
  };

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-3xl font-bold text-black border-2 border-border rounded-full px-4 py-2"
      whileTap={{
        scale: 0.9,
      }}
      onHoverStart={onHover}
    >
      <Link href="/">
        <span className="sr-only text-text">Dashly</span>
        <span className="block text-text h-8 overflow-hidden" aria-hidden>
          {["D", "a", "s", "h", "l", "y"].map((letter, index) => (
            <span
              data-letter={letter}
              className="letter text-text relative inline-block h-8 leading-8 after:absolute after:left-0 after:top-full after:h-8 after:content-[attr(data-letter)]"
              key={`${letter}-${index}`}
            >
              {letter}
            </span>
          ))}
        </span>
      </Link>
    </motion.div>
  );
}
