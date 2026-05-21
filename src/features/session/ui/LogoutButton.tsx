import { CgLogOut } from "react-icons/cg";
import { useLogout } from "../hooks/useLogout";
import { Button, Modal } from "@/shared/ui";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    redirect("/account/login");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex cursor-pointer items-center p-1 rounded-sm gap-2 hover:bg-bg-hover"
      >
        <CgLogOut className="text-red-500" />
        Выйти
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} width="md">
        <div className="flex w-100 flex-1 py-2 px-10 h-full items-center justify-center flex-col gap-2">
          <div className="flex items-center justify-center flex-col text-sm">
            <CgLogOut size={60} className="text-red-500" />
            <p className="text-bold">Выходите из своей учетной записи?</p>
            <p className="text-center text-gray">
              Вам нужно будет снова войти в систему, чтобы получить доступ к
              своим рабочим пространствам Dashly.
            </p>
          </div>
          <div className="flex w-full flex-col text-bold gap-2">
            <button
              onClick={() => handleLogout()}
              className="flex cursor-pointer justify-center bg-red-400 border border-border text-white p-2 rounded-sm items-center hover:bg-red-600"
            >
              Выйти
            </button>
            <Button
              onClick={() => setIsOpen(false)}
              className="flex justify-center items-center"
            >
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
