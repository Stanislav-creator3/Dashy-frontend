import { NumberShuffle } from "@/shared/ui";
import { typeLabels } from "@/shared/utils/constants";
import { percentages } from "@/shared/utils/utils";
import { PercentagesOfWorkItem } from "@/widgets/percentagesOfWork";
import {
  useProcessStage,
  useProcessStageStore,
} from "@/widgets/tasks/model/store";
import { AnimatePresence, motion } from "motion/react";

export default function TaskProgressComplete() {
  const processStage = useProcessStage();
  const currentStage = useProcessStageStore((state) => state.currentStage);

  const currentProgressState = processStage?.find(
    (stage) => stage.type === currentStage
  );

  if (!currentProgressState || !currentProgressState.tasks) {
    return <p>Задач нет</p>;
  }

  const progress = Math.round(
    (currentProgressState.tasks.filter((task) => task.completed).length /
      currentProgressState.tasks.length) *
      100
  );

  const label = typeLabels[currentProgressState?.type];

  return (
    <div className="w-full">
      <div className="flex justify-between gap-2 items-center">
        <AnimatePresence>
          <motion.p
            key={label}
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            className="text-lg"
          >
            {label}
          </motion.p>
        </AnimatePresence>

        <div className="flex items-center gap-1 text-4xl">
          <NumberShuffle value={progress} maxValue={progress} /> %
        </div>
      </div>

      <div className="flex items-center">
        {processStage?.map((stage, index) => (
          <PercentagesOfWorkItem
            rounded="square"
            key={stage.id}
            index={index}
            id={stage.id}
            itemPosition="end"
            percentages={percentages(stage.completedTask, stage.totalTask)}
            type={stage.type}
            title={`${percentages(stage.completedTask, stage.totalTask)}%`}
            text={index > 0 ? "" : "Задача"}
          />
        ))}
      </div>
    </div>
  );
}
