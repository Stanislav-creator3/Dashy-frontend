import { ProjectEmojiPicker } from "./projectEmojiPicker";

export default function ChangeIconForm() {
  return (
    <div>
      <p className="font-bold">Иконка</p>
      <p className="text-gray mb-2">
        Загрузите изображение или выберите эмодзи. Этот значок появится на вашей
        боковой панели и в уведомлениях.
      </p>
      <ProjectEmojiPicker />
    </div>
  );
}
