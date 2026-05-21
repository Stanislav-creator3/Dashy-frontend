import { Button, Logo, Tabs } from "@/shared/ui";
import Link from "next/link";
import { headerConfig } from "../config/config";
import { BiUser } from "react-icons/bi";
import { PAGES } from "@/shared/config/pages";
import { CiSettings } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa6";
import ThemeToggle from "@/widgets/toggleTheme/ui/ToggleTheme";

export default function Header() {
  return (
    <div className="flex items-center justify-between w-full mb-5">
      <Logo />
      <div className="flex items-center justify-center gap-2">
        <Tabs tabs={headerConfig.links} />

        <div className="flex items-center justify-center gap-2">
          <ThemeToggle />
          <Button variant="primary" className="rounded-full px-2 py-4">
            <Link
              href={PAGES.SETTINGS}
              className="flex text-sm items-center gap-2"
            >
              <CiSettings size={20} />
              <span>Настройки</span>
            </Link>
          </Button>
          <Button variant="primary" className="rounded-full px-2 py-4">
            <FaRegBell size={20} />
          </Button>
          <Button variant="primary" className="rounded-full px-2 py-4">
            <Link href={PAGES.PROFILE}>
              <BiUser size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
