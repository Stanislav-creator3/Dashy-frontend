"use client";

import { collectionsApi } from "@/entities/collections/api/collections.api";
import { iconsList } from "@/widgets/iconSelect/model/icons";
import { iconsColors } from "@/widgets/iconSelect/model/iconsColor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  editCollectionSchema,
  TypeEditCollectionSchema,
} from "../model/createCollections.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { onCloseModal } from "@/shared/ui/modal/modal.store";
import toast from "react-hot-toast";
import { IconSelect } from "@/widgets/iconSelect";
import { TextField } from "@/shared/ui/textField/TextField";
import { Button, TextArea } from "@/shared/ui";
import { EditCollectionFormSkeleton } from "./EditCollectionFormSkeleton";
import { AnimatePresence, motion } from "motion/react";

export default function EditCollectionForm() {
  const { id, collectionId } = useParams();
  const router = useRouter();
  const { data, isLoading } = useQuery(
    collectionsApi.getCollectionById(collectionId as string)
  );

  const { mutate, isPending } = useMutation({
    mutationFn: collectionsApi.updataCollection,
  });

  const queryClient = useQueryClient();

  const [icon, setIcon] = useState(iconsList[0]);
  const [color, setColor] = useState(iconsColors[0]);

  const { formState, control, handleSubmit, setValue, reset } =
    useForm<TypeEditCollectionSchema>({
      resolver: zodResolver(editCollectionSchema),
      mode: "onChange",
      defaultValues: {
        title: "",
        description: "",
        icon: "",
        iconColor: "",
      },
    });

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        description: data.description || "",
        icon: data.icon,
        iconColor: data.iconColor || color,
      });

      const foundIcon = iconsList.find((icon) => icon.name === data.icon);
      if (foundIcon) {
        setIcon(foundIcon);
      }
      setColor(data.iconColor || iconsColors[0]);
    }
  }, [data]);

  useEffect(() => {
    setValue("icon", icon.name);
    setValue("iconColor", color);
  }, [icon, color, setValue]);

  const onSubmit = (data: TypeEditCollectionSchema) => {
    mutate(
      {
        id: collectionId as string,
        body: {
          title: data.title,
          description: data.description,
          icon: data.icon,
          iconColor: data.iconColor,
        },
      },
      {
        onSuccess(dataCollection) {
          toast.success(`Коллекция ${dataCollection.title} успешно обновлена.`);
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
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <EditCollectionFormSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-4 p-5"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
              Сохранить
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
