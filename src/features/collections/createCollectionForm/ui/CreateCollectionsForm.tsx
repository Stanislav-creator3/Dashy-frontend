"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import {
  createCollectionSchema,
  TypeCreateCollectionSchema,
} from "../model/createCollections.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/shared/ui/textField/TextField";
import { IconSelect } from "@/widgets/iconSelect";
import { useEffect, useState } from "react";
import { iconsList } from "@/widgets/iconSelect/model/icons";
import { iconsColors } from "@/widgets/iconSelect/model/iconsColor";
import { Button, TextArea } from "@/shared/ui";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { onCloseModal } from "@/shared/ui/modal/modal.store";
import { collectionsApi } from "@/entities/collections/api/collections.api";

export default function CreateCollectionsForm() {
  const { id } = useParams();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: collectionsApi.createCollections,
  });

  const queryClient = useQueryClient();

  const [icon, setIcon] = useState(iconsList[0]);
  const [color, setColor] = useState(iconsColors[0]);

  const { formState, control, handleSubmit, setValue } =
    useForm<TypeCreateCollectionSchema>({
      resolver: zodResolver(createCollectionSchema),
      mode: "onChange",
      defaultValues: {
        title: "",
        description: "",
        icon: iconsList[0].name,
        iconColor: iconsColors[0],
      },
    });

  useEffect(() => {
    setValue("icon", icon.name);
    setValue("iconColor", color);
  }, [icon, color, setValue]);

  const onSubmit = (data: TypeCreateCollectionSchema) => {
    mutate(
      {
        projectId: id as string,
        title: data.title,
        description: data.description,
        icon: data.icon,
        iconColor: data.iconColor,
      },
      {
        onSuccess(dataCollection) {
          toast.success(`коллекция ${dataCollection.title}, успешно создана.`);
          onCloseModal();
          setTimeout(() => {
            router.back();
          }, 500);
        },
        onError(err: Error) {
          toast.error(err.message);
        },
        onSettled() {
          queryClient.invalidateQueries(collectionsApi.getCollections(`${id}`));
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 p-5">
      <p className="text-3xl font-bold">Создать коллекцию</p>
      <p className="text-lg">
        Эта коллекция поможет организовать и систематизировать информацию.
        Добавьте свойства, которые отражают ключевые аспекты ваших данных:
        статус, приоритет, теги или даты.
      </p>
      <p className="text-lg">
        💡 **Совет**: Используйте разные типы свойств для лучшей организации -
        Выпадающие списки для категорий - Числа для количественных данных -
        Флажки для отслеживания выполнения
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <p className="text-3xl">Название и иконка</p>
          <div className="flex gap-2">
            <IconSelect
              className="flex pt-2"
              iconsColors={iconsColors}
              iconsList={iconsList}
              selectedColor={color}
              SelectedIcon={icon.icon}
              onColorChange={setColor}
              onIconChange={setIcon}
            />

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="title"
                  placeholder="Название"
                  error={formState.errors["title"]?.message}
                />
              )}
            />
          </div>
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              className="mb-2"
              id="description"
              placeholder="Описание коллекции"
              label="Описание"
              error={formState.errors["description"]?.message}
              rows={4}
            />
          )}
        />
        <Button
          type="submit"
          className="w-40"
          disabled={isPending || !formState.isValid}
        >
          Создать
        </Button>
      </form>
    </div>
  );
}
