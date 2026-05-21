import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/radixUi/ui/avatar";
import { getMediaSource } from "@/shared/utils/get-media-source";
import { cva, VariantProps } from "cva";

const avatarSizes = cva({
  base: "",
  variants: {
    size: {
      sm: "size-7",
      default: "size-9",
      lg: "size-14",
      xl: "size-32",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  avatar?: string;
  userName: string;
  isOnline?: boolean;
  alt: string;
}

export default function UserAvatar({
  size,
  avatar,
  userName,
  isOnline,
  alt,
}: UserAvatarProps) {
  const srcAvatar = avatar ? getMediaSource(avatar) : "/defaultAvatar.png";
  return (
    <div className="relative">
      <Avatar
        className={cn(
          avatarSizes({ size }),
          isOnline && "ring-2 ring-rose-500",
        )}
      >
        <AvatarImage src={srcAvatar} className="object-cover" alt={alt} />
        <AvatarFallback
          className={cn(
            size === "xl" && "text-4xl",
            size === "lg" && "text-2xl",
          )}
        >
          {userName[0]}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
