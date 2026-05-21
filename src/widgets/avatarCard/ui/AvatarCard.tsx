import { Button, Card } from "@/shared/ui";
import styles from "./style.module.css";
import { cn } from "@/shared/utils/utils";
import defaultAvatar from "../../../../public/defaultAvatar.png";
import { StaticImageData } from "next/image";

interface IAvatarCard {
  userName: string;
  jobTitle: string;
  avatar?: string | StaticImageData;
  prise: number;
}

export default function AvatarCard({
  userName,
  jobTitle,
  avatar = defaultAvatar.src,
  prise,
}: IAvatarCard) {

  return (
    <Card
      variant="bgWhite"
      className={cn(styles.image, "relative w-full h-full")}
      style={{ backgroundImage: `url(${avatar})` }}
    >
      <div className="flex items-end justify-between w-full h-full relative z-1 gap-2 text-white">
        <div className="flex flex-col gap-2">
          <p className="text-2xl">{userName}</p>
          <p className="text-sm">{jobTitle}</p>
        </div>
        <Button variant="outline" >
          <p className="text-2xl">{prise}$</p>
        </Button>
      </div>
    </Card>
  );
}
