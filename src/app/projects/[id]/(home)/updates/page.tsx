
import { Button, Card, Tooltip } from "@/shared/ui";

export default function UpdatesPage() {
  return (
    <div className="relative">
      <Tooltip delay={1000} className="z-4" direction="right" content="test">
        <Button variant="roundedBlack">
          <h1>test</h1>
        </Button>
      </Tooltip>
    </div>
  );
}
