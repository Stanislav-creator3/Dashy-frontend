import { IPageList, PAGE_TYPE } from "@/entities/pages/model/page.types";
import { FlattenedItem } from "@/widgets/sidebar/model/types";

export function buildTree(flattenedItems: FlattenedItem[]): IPageList[] {
  const root: IPageList = {
    id: "root",
    children: [],
    title: "root",
    icon: null,
    position: 0,
    parentId: null,
    type: PAGE_TYPE.PAGE,
  };
  const nodes: Record<string, IPageList> = { [root.id]: root };
  const items = flattenedItems.map((item) => ({ ...item, children: [] }));

  for (const item of items) {
    const { id, children } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? items.find(({ id }) => id === parentId);

    if (!parent) continue;

    nodes[id] = {
      id,
      title: item.title,
      icon: item.icon,
      type: item.type,
      position: item.position,
      parentId: item.parentId,
      children,
    };
    parent.children.push(item);
  }

  return root.children;
}
