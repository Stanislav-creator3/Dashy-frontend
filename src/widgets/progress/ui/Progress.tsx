import { Button, Card, ProgressWeekItem } from "@/shared/ui";
import { IProgress } from "../model/progress.interface";
import { IoIosArrowRoundUp } from "react-icons/io";


const progressInHours = (progress: number) => {
  const hours = Math.floor(progress / 60);
  const minutes = progress % 60;
  return `${hours}ч ${minutes}м`;
};

export default function Progress({ progress }: IProgress) {
  const totalProgress = (
    progress.reduce((acc, item) => acc + (item.progress || 0), 0) / 60
  ).toFixed(2);

  return (
    <Card className="flex flex-col">
      <div className="flex items-end justify-between mb-1">
        <h2 className="text-2xl">Прогресс</h2>
        <Button variant="rounded">
          <IoIosArrowRoundUp size={30} className="rotate-45" />
        </Button>
      </div>

      <div className="flex items-end gap-3 mb-2">
        <p className="text-3xl">
          {totalProgress} <span className="text-3xl"> ч</span>
        </p>
        <p className="text-sm max-w-30">Прогресс за неделю в часах</p>
      </div>

      <div className="flex items-end justify-between h-full">
        {progress.map((item, index) => (
          <ProgressWeekItem
            key={item.id}
            id={item.id}
            index={index}
            day={item.day}
            progress={item.progress}
            progressInHours={
              item.progress ? progressInHours(item.progress) : undefined
            }
          />
        ))}
      </div>
    </Card>
  );
}
