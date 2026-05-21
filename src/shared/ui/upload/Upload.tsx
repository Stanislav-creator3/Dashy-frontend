"use client";

import { cn } from "@/shared/utils/utils";
import { useEffect, useState } from "react";
import { PiUploadSimpleThin } from "react-icons/pi";
import Loading from "../loading/Loading";
import { AnimatePresence, motion } from "motion/react";

interface UploadProps {
  isLoading?: boolean;
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
}

export default function Upload({
  value,
  onChange,
  className,
  isLoading,
}: UploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFile = (file?: File) => {
    if (!file) return;

    onChange(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && preview ? (
        <motion.div
          className={cn(
            "relative flex min-w-30 min-h-20 w-full h-full items-center justify-center",
            className,
          )}
          key={"isLoading"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src={preview}
            alt="preview"
            className="absolute h-20 w-20 rounded-lg object-cover"
            initial={{ opacity: 0, scale: 0.7, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: -50 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />

          <motion.div
            className="absolute"
            initial={{ opacity: 0, scale: 0.7, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: 50 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
          >
            <Loading />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key={"upload"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "relative flex min-w-30 min-h-20 w-full h-full rounded-md overflow-hidden",
            isDragOver && "border-4 border-dashed border-yellow",
            className,
          )}
        >
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <label
            className={cn(
              "absolute inset-0 cursor-pointer bg-input flex items-center justify-center",
              preview && "opacity-80",
            )}
          >
            <div className="flex flex-col text-black items-center gap-4 text-center px-6">
              <p className="text-xl opacity-60">
                Перетащите сюда изображение или нажмите, чтобы выбрать
                изображение в форматах: JPEG, JPG, GIF, WEBP. Максимальный
                размер 5МБ.
              </p>
              <PiUploadSimpleThin size={50} className="opacity-50" />{" "}
            </div>

            <input
              disabled={isLoading}
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/webp,image/gif"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
