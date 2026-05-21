"use client";
import { Button, Card } from "@/shared/ui";
import { IoIosArrowRoundUp } from "react-icons/io";
import { MdOutlinePlayArrow } from "react-icons/md";
import { AiOutlinePause } from "react-icons/ai";

import styles from "./styles.module.css";
import { cn, formatHoursMinutes } from "@/shared/utils/utils";
import { useNow } from "@/shared/hooks/useNow";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTimeTrackerStore } from "../model/timeTracker.store";
import { useTimer } from "../hooks/useTimer";

const totalMinutes = 480;

export default function TimeTracker() {
  const { handleStartTimer, handleStopTimer } = useTimer();
  const timerDate = useTimeTrackerStore((state) => state.timeDate);
  const isActiveTimer = useTimeTrackerStore((state) => state.isTimerActive);
  const timerId = useTimeTrackerStore((state) => state.timerId);
  const timePause = useTimeTrackerStore((state) => state.timePause);

  const [startAt, setStartAt] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isActiveTimer && timerDate) {
      setVisible(true);
      setStartAt(timerDate);
    } else if (!isActiveTimer) {
      setVisible(true);
      setStartAt(null);
    }
  }, [isActiveTimer, timerDate]);

  const now = useNow(60000, startAt);

  const timeFromStart = now - (startAt ?? now);

  const timer = timeFromStart + timePause;

  const strokeDasharray = `${((timer / 60000 / totalMinutes) * 283).toFixed(
    0
  )}, 283`;

  const pause = () => {
    setStartAt(null);
    if (timerId) handleStopTimer(timerId, new Date());
  };

  const start = () => {
    if (isActiveTimer && timerDate) {
      setStartAt(timerDate);
    }
    if (!isActiveTimer) {
      handleStartTimer(new Date());
    }
    setVisible(true);
  };

  return (
    <Card>
      <div className="flex flex-col justify-between h-full">
        <div className="flex justify-between">
          <p className="text-2xl">Тайм-трекер</p>
          <Button variant="rounded">
            <IoIosArrowRoundUp size={30} className="rotate-45" />
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <div className={styles["base-timer"]}>
            <svg
              viewBox="0 0 100 100"
              className={styles["base-timer__svg"]}
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className={styles["base-timer__circle"]}>
                <circle
                  className={styles["base-timer__path-elapsed"]}
                  cx="50%"
                  cy="50%"
                  r="45%"
                />
                <motion.path
                  className={cn(styles[`base-timer__path-remaining`])}
                  strokeDasharray="0, 283"
                  stroke="var(--color-yellow)"
                  initial={false}
                  animate={{
                    strokeDasharray: strokeDasharray,
                    opacity: visible ? 1 : 0,
                  }}
                  d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
                ></motion.path>
              </g>
            </svg>
            <div className={styles["base-timer__label"]}>
              <span>{formatHoursMinutes(Math.floor(timer / 60000))}</span>
              <span className="text-sm">Рабочее время</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Button
              onClick={start}
              disabled={startAt !== null}
              variant="rounded"
            >
              <MdOutlinePlayArrow size={30} />
            </Button>
            <Button onClick={pause} variant="rounded">
              <AiOutlinePause size={30} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
