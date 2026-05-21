"use client";

import { typeLabels } from "@/shared/utils/constants";
import { cn, percentages } from "@/shared/utils/utils";
import PercentagesOfWorkItem from "./PercentagesOfWorkItem";
import { useProcessStage } from "@/widgets/tasks/model/store";

interface PercentagesOfWorkProps {
  percentages: {
    id: string;
    percentages: number;
    type: "interviews" | "projects" | "offers" | "output";
  }[];
  className?: string;
}

export default function PercentagesOfWork({
  className,
}: PercentagesOfWorkProps) {
  const processStage = useProcessStage();

  
  const totalTasksStageAll =
    processStage?.reduce((acc, stage) => acc + stage.totalTask, 0) ?? 0;

  return (
    <div className={cn(className, "flex w-[50vw] gap-2")}>
      {processStage?.map((stage, index) => (
        <PercentagesOfWorkItem
          index={index}
          key={stage.id}
          id={stage.id}
          percentages={percentages(stage.totalTask, totalTasksStageAll)}
          type={stage.type}
          title={typeLabels[stage.type]}
          text={`${percentages(stage.totalTask, totalTasksStageAll)}%`}
        />
      ))}
    </div>
  );
}
