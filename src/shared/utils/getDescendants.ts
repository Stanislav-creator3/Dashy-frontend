import { FlattenedItem } from "@/widgets/sidebar/model/types";
import { UniqueIdentifier } from "@dnd-kit/abstract";

export function getDescendants(
  items: FlattenedItem[],
  parentId: UniqueIdentifier,
): Set<UniqueIdentifier> {
  const children = items.filter((item) => item.parentId === parentId);
  return children.reduce((acc, item) => {
    return new Set([...acc, item.id, ...getDescendants(items, item.id)]);
  }, new Set<UniqueIdentifier>());
}
