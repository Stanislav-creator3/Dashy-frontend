import TextAreaSkeleton from "@/shared/ui/textarea/TextareaSkeleton";
import TextFieldSkeleton from "@/shared/ui/textField/TextFieldSkeleton";

export function EditCollectionFormSkeleton() {
  return (
    <div className="flex flex-col h-101.5 gap-4 p-5">
      <div className="flex gap-1 mt-10">
        <div className="animate-pulse h-13 w-13 bg-gray-800 rounded-xl"></div>
        <TextFieldSkeleton />
      </div>
      <TextAreaSkeleton />
      <div className="animate-pulse h-15 w-30 bg-gray-800 rounded-xl"></div>
    </div>
  );
}
