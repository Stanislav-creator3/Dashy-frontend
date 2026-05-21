import { ChangeIconForm, ChangeNameForm, DeleteProjectForm } from "@/features/projects";
import { Heading, Separator } from "@/shared/ui";

export default function WorkspacePage() {
  return (
    <>
      <Heading
        title="Основные"
        description="Управление названием рабочей области, доменами и другими параметрами"
      />
      <h2 className="text-2xl font-bold mt-5">Настройки рабочей области</h2>
      <Separator className="my-2" />
      <ChangeNameForm className="mb-5" />
      <ChangeIconForm />
      <h2 className="text-2xl mt-5 font-bold ">Красная зона</h2>
      <Separator className="my-2" />
      <DeleteProjectForm />
    </>
  );
}
