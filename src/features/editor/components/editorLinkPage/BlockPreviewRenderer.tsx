"use client";

import LinkPage from "@/shared/ui/linkPage/LinkPage";
import { getIcon } from "@/shared/utils/getIcon";
import { renderIcon } from "@/shared/utils/renderIcon";
import { IBlock } from "../../model/block.types";
import { HeadingPreview } from "./blockPreview/HeadingPreview";
import { ParagraphPreview } from "./blockPreview/ParagraphPreview";

export default function BlockPreviewRenderer({
  blocks,
  projectId,
}: {
  blocks: IBlock[];
  projectId: string;
}) {
  if (blocks.length === 0) {
    return (
      <p className="rounded-xl bg-bg-hover px-3 py-2 text-sm text-text">
        Страница пока пустая
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {blocks.map((block, index) => {
        if (block.type === "Heading") {
          return <HeadingPreview key={block.id} block={block} />;
        }

        if (block.type === "Paragraph") {
          return <ParagraphPreview key={block.id} block={block} />;
        }

        if (block.type === "LinkPage") {
          const icon = renderIcon(
            getIcon(block.content.icon ?? block.content.typePage),
          );

          return (
            <LinkPage
              key={block.id}
              href={`/projects/${projectId}/pages/${block.content.id}`}
              text={block.content.text}
              icon={icon}
              className="rounded-xl px-3 py-2"
              textClassName="text-base"
            />
          );
        }

        return (
          <p
            key={index}
            className="rounded-xl bg-bg-hover px-3 py-2 text-sm text-text"
          >
            Неподдерживаемый блок
          </p>
        );
      })}
    </div>
  );
}
