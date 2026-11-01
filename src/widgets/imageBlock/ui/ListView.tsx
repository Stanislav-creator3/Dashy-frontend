import { IImageItem, ImageLayout } from "../model/types";
import { ListItem } from "./ListItem";

interface IListViewProps {
  imageItems: IImageItem[];
  open: (id: string) => void;
  layout?: ImageLayout;
  nodeKey: string;
  selectedId: string | null;
}

export const ListView = ({
  imageItems,
  open,
  layout = 1,
  nodeKey,
  selectedId,
}: IListViewProps) => {
  const gridArea = (count: number) => {
    switch (count) {
      case 1:
        return `"image1"`;
      case 2:
        return `"image1 image2"`;
      case 3:
        return `"image1 image2"
              "image3 image2"`;
      case 4:
        return `"image1 image2"
              "image3 image4"`;
    }
  };
  return (
    <ul
      className="relative grid max-h-180 w-full auto-rows-fr gap-2"
      style={{
        gridTemplateColumns: `repeat(${layout > 2 ? 2 : layout}, minmax(0, 1fr))`,
        gridTemplateAreas: gridArea(layout),
      }}
    >
      {imageItems.map((item, index) => (
        <ListItem
          selectedId={selectedId}
          key={item.id}
          id={item.id}
          index={index}
          url={item.url}
          open={open}
          alt={item.alt}
          nodeKey={nodeKey}
        />
      ))}
    </ul>
  );
};
