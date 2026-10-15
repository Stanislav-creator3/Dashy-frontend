import { cn } from "@/lib/utils";
import { Modal, Button } from "@/shared/ui";
import { motion } from "motion/react";
import { getBoardColor } from "../model/boardColors";
import { useState } from "react";
import { BoardCard, IBoardColumn } from "../model/board.types";
import RadioGroup from "@/shared/ui/RadioGroup/RadioGroup";
import { useDeleteFieldOptions } from "../hooks/useDeleteFieldOption";
import { useParams } from "next/navigation";
import { useBoard } from "../model/boardContext";

export function DeleteColumnModal({
  columnId,
  databaseId,
  openModal,
  setOpenModal,
  columnItems,
  otherColumnsProperty,
  groupByFieldId,
}: {
  columnId: string;
  databaseId: string;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  columnItems: BoardCard[];
  groupByFieldId: string;
  otherColumnsProperty: IBoardColumn[];
}) {
  const { id: projectId } = useParams<{
    id: string;
  }>();
  const { setColumnsItems, setItemsByColumn } = useBoard();
  const [selectedOption, setSelectedOption] = useState<string>("moveToColumn");
  const [selectedMoveTo, setSelectedMoveTo] = useState<string | null>(
    otherColumnsProperty[0]?.id ?? null,
  );

  const { onDeleteFieldOption, onDeleteFieldOptionPending } =
    useDeleteFieldOptions({
      databaseId,
      projectId,
    });
  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
    if (value === "deleteAll") setSelectedMoveTo(null);
    if (value === "moveToColumn" && selectedMoveTo === null)
      setSelectedMoveTo(otherColumnsProperty[0].id ?? null);
  };

  const deleteColumn = (optionsId: string, moveToId?: string | null) => {
    onDeleteFieldOption({ fieldId: groupByFieldId, optionsId, moveToId });

    if (selectedOption === "moveToColumn" && moveToId) {
      setColumnsItems((prev) =>
        prev.filter((column) => column.id !== columnId),
      );
      setItemsByColumn((prev) => {
        const newItemsByColumn = { ...prev };
        newItemsByColumn[moveToId] = [
          ...newItemsByColumn[moveToId],
          ...newItemsByColumn[columnId],
        ];
        delete newItemsByColumn[columnId];
        return newItemsByColumn;
      });
    }
    if (selectedOption === "deleteAll") {
      setColumnsItems((prev) =>
        prev.filter((column) => column.id !== columnId),
      );
      setItemsByColumn((prev) => {
        const newItemsByColumn = { ...prev };
        delete newItemsByColumn[columnId];
        return newItemsByColumn;
      });
    }
    setOpenModal(false);
  };

  return (
    <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
      <div className="p-10 flex flex-col gap-2 items-center justify-center">
        <div className="font-bold flex flex-col items-center ">
          <p className="text-lg text-error">
            Вы действительно хотите удалить колонку?
          </p>
          <p className="text-sm ">
            {otherColumnsProperty.length > 0 &&
              "Все следующие страницы будут удалены или перенесены в другую колонку"}
            {columnItems.length > 0 && "Все задачи в колонке будут удалены"}
          </p>
        </div>
        {columnItems && columnItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5 overflow-y-scroll max-h-25">
            {columnItems.map((card) => {
              if (!card) return null;
              const colorStyle = getBoardColor(card.color);
              return (
                <div
                  key={card.id}
                  className="flex p-2 items-center justify-center bg-background border rounded-lg"
                  style={{ backgroundColor: colorStyle.background }}
                >
                  <p>{card.title}</p>
                </div>
              );
            })}
          </div>
        )}

        {otherColumnsProperty.length > 0 && columnItems.length > 0 && (
          <RadioGroup
            name="ColumnDelete"
            options={[
              {
                value: "moveToColumn",
                content: (
                  <div className="bg-background w-full p-5 border rounded-lg">
                    <p className="font-bold mb-2">
                      Перенести задачи в другую колонку Задачи встанут в конец
                      выбранной колонки, порядок сохранится.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
                      {otherColumnsProperty.length > 0 &&
                        columnItems &&
                        otherColumnsProperty.map((column) => {
                          const style = getBoardColor(column.color);
                          const active = column.id === selectedMoveTo;
                          return (
                            <motion.button
                              key={column.id}
                              onClick={() => {
                                handleSelectChange("moveToColumn");
                                setSelectedMoveTo(column.id);
                              }}
                              className={cn(
                                "relative text-sm p-1 cursor-pointer rounded-lg hover:opacity-80 flex items-center justify-center gap-1",
                              )}
                              style={{
                                backgroundColor: style.background,
                                color: style.text,
                                outlineStyle: "solid",
                                outlineColor: style.status,
                                outlineWidth: active ? "2px" : "0px",
                              }}
                              animate={{
                                outlineOffset: active ? "2px" : "-2px",
                              }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                              {column.name}
                            </motion.button>
                          );
                        })}
                    </div>
                  </div>
                ),
              },
              {
                value: "deleteAll",
                content: (
                  <div className="bg-background w-full p-5 border rounded-lg">
                    <p>Удалить страницы вместе с колонкой</p>
                    <p className="text-sm text-error">
                      {columnItems?.length} задачи будут удалены безвозвратно.
                    </p>
                  </div>
                ),
              },
            ]}
            selected={selectedOption}
            onChange={handleSelectChange}
          />
        )}

        <Button
          className="w-full"
          variant="danger"
          disabled={!selectedOption || onDeleteFieldOptionPending}
          onClick={() => deleteColumn(columnId, selectedMoveTo)}
        >
          Удалить
        </Button>
        <Button className="w-full" onClick={() => setOpenModal(false)}>
          Отменить
        </Button>
      </div>
    </Modal>
  );
}
