"use client";

import { Card, NumberShuffle } from "@/shared/ui";
import CardTask from "@/shared/ui/cardTask/CardTask";
import { getIcon } from "@/shared/utils/getIcon";
import { cn } from "@/shared/utils/utils";
import { motion, Transition, useAnimate } from "motion/react";
import { useState } from "react";
import TaskItem from "./TaskItem";
import { typeLabels } from "@/shared/utils/constants";
import {
  useProcessStage,
  setCurrentProcessStage,
  useProcessStageStore,
} from "../model/store";
import { TaskProgressComplete } from "@/widgets/TaskProgressComplete";
import { renderIcon } from "@/shared/utils/renderIcon";

interface Props {
  className?: string;
}

const spring: Transition = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};

export default function Tasks({ className }: Props) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const processStage = useProcessStage();
  const currentStage = useProcessStageStore((state) => state.currentStage);
  const [isAnimate, setIsAnimate] = useState(false);
  const lastIndex = processStage ? processStage.length - 1 : -1;
  const findIndex = processStage
    ? processStage.findIndex((stage) => stage.type === currentStage)
    : -1;

  let sortStage: typeof processStage = [];
  if (processStage && findIndex !== -1) {
    sortStage = [...processStage];
    sortStage.splice(findIndex, 1);
    sortStage.splice(lastIndex, 0, processStage[findIndex]);
  } else if (processStage && Array.isArray(processStage)) {
    sortStage = [...processStage];
  }

  const onClick = (index: number, stage: string) => {
    if (processStage && index !== lastIndex) {
      setIsAnimate(true);

      animate([[scope.current.children[index], { y: 0 }]]);
      setTimeout(() => {
        setIsAnimate(false);
      }, 300);
      setCurrentProcessStage(index, stage);
    }
  };

  const onHoverStart = (index: number) => {
    if (index !== lastIndex)
      animate([[scope.current.children[index], { y: -20 }]]);
  };

  const onHoverEnd = (index: number) => {
    animate([[scope.current.children[index], { y: 0 }]]);
  };

  return (
    <Card className={cn(className, "flex flex-col relative gap-5")}>
      <TaskProgressComplete />
      <div ref={scope}>
        {sortStage &&
          sortStage?.map((stage, index) => {
            return (
              <motion.div
                layout
                key={stage.id}
                onClick={() => onClick(index, stage.type)}
                className={`relative cursor-pointer nth-[n+2]:-mt-[35vh] `}
                transition={spring}
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    delay: 0.3 * index,
                  },
                }}
                style={{
                  zIndex: index * 1,
                }}
                onHoverStart={() => (isAnimate ? "" : onHoverStart(index))}
                onHoverEnd={() => (isAnimate ? "" : onHoverEnd(index))}
              >
                <CardTask className="h-[40vh]" typeTask={stage.type}>
                  <div className="flex flex-col h-full gap-3 ">
                    <div className="flex items-center justify-between">
                      <p>{typeLabels[stage.type]}</p>
                      <div className="text-2xl flex gap-2">
                        <NumberShuffle
                          maxValue={stage.tasks.length}
                          value={
                            stage.tasks.filter(
                              (item) => item.completed === true,
                            ).length
                          }
                        />
                        <span>/</span>
                        {stage.tasks.length}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 overflow-scroll scrollbar-hide">
                      {stage.tasks?.map((task) => {
                        return (
                          <TaskItem
                            key={task.id}
                            id={task.id}
                            icon={getIcon(task.type)}
                            stage={stage.type}
                            text={task.text}
                            typeStyle={
                              stage.type === "projects" ? "white" : "dark"
                            }
                            completed={task.completed}
                          />
                        );
                      })}
                    </div>
                  </div>
                </CardTask>
              </motion.div>
            );
          })}
      </div>
    </Card>
  );
}
