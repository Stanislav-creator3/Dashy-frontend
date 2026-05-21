import { Button, Card, Logo } from "@/shared/ui";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface Props {
  heading: string;
  backButtonLabel?: string;
  backButtonHref?: string;
}

export default function AuthWRapper({
  children,
  heading,
  backButtonLabel,
  backButtonHref,
}: PropsWithChildren<Props>) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex items-center">
        <Card className="w-[50vw]">
          <div className="flex items-center gap-x-4 mb-2">
            <Logo />
            <h2 className="text-2xl">{heading}</h2>
          </div>
          <div>{children}</div>
          <div className="mt-2">
            {backButtonLabel && backButtonHref && (
              <Button className="w-full">
                <Link href={backButtonHref}>{backButtonLabel}</Link>
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
