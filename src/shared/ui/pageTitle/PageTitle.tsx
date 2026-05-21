export default function PageTitle({
  titleRef,
  onSubmit,
}: {
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  onSubmit: (title: string) => void;
}) {
  return (
    <h1
      ref={titleRef}
      className="text-4xl mb-4 focus:outline-none empty:before:content-['Без_названия'] empty:before:text-gray-400"
      contentEditable="true"
      suppressContentEditableWarning
      onInput={(e) => {
        let text = e.currentTarget.textContent.trim();
        if (text === "") {
          text = "Без названия";
          e.currentTarget.textContent = "";
        }
        onSubmit(text);
      }}
    />
  );
}
