import {
  CiGlobe,
  CiBookmark,
  CiWarning,
  CiImageOn,
  CiViewList,
} from "react-icons/ci";
import { TbFlask } from "react-icons/tb";
import { SiMaildotru } from "react-icons/si";
import {
  IoEyeOutline,
  IoTerminalOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { BsDatabase } from "react-icons/bs";
import { CgSmileMouthOpen } from "react-icons/cg";
import {
  PiBooks,
  PiCurrencyRubLight,
  PiPencilSimpleBold,
} from "react-icons/pi";
import { FaCode } from "react-icons/fa6";
import { MdOutlinePalette } from "react-icons/md";
import { IconType } from "react-icons";
import { IoDocumentOutline } from "react-icons/io5";
import { TfiText } from "react-icons/tfi";
import { LuHeading1, LuHeading2, LuHeading3, LuListTodo } from "react-icons/lu";
import { FaListOl, FaListUl, FaQuoteLeft } from "react-icons/fa";
import { RiTextSnippet } from "react-icons/ri";

export interface IIconList {
  icon: IconType;
  name: string;
  category: string;
  label: string;
}

export const iconsList = [
  {
    icon: IoDocumentOutline,
    name: "PAGE",
    label: "Страница",
  },
  {
    icon: BsDatabase,
    name: "database",
    category: "development",
    label: "База данных",
  },
  {
    icon: CiGlobe,
    name: "globe",
    category: "general",
    label: "Глобус",
  },
  {
    icon: TbFlask,
    name: "flask",
    category: "science",
    label: "Эксперимент",
  },
  {
    icon: CiBookmark,
    name: "bookmark",
    category: "general",
    label: "Закладка",
  },
  {
    icon: SiMaildotru,
    name: "mail",
    category: "communication",
    label: "Почта",
  },
  {
    icon: IoEyeOutline,
    name: "eye",
    category: "ui",
    label: "Просмотр",
  },
  {
    icon: CiWarning,
    name: "warning",
    category: "feedback",
    label: "Предупреждение",
  },
  {
    icon: CgSmileMouthOpen,
    name: "smile",
    category: "social",
    label: "Смайлик",
  },
  {
    icon: CiImageOn,
    name: "image",
    category: "media",
    label: "Изображение",
  },
  {
    icon: PiBooks,
    name: "books",
    category: "education",
    label: "Книги",
  },
  {
    icon: IoTerminalOutline,
    name: "terminal",
    category: "development",
    label: "Терминал",
  },
  {
    icon: PiCurrencyRubLight,
    name: "currency",
    category: "finance",
    label: "Валюта",
  },
  {
    icon: IoSunnyOutline,
    name: "sun",
    category: "weather",
    label: "Солнце",
  },
  {
    icon: CiViewList,
    name: "view-list",
    category: "ui",
    label: "Список",
  },
  {
    icon: FaCode,
    name: "code",
    category: "development",
    label: "Код",
  },
  {
    icon: MdOutlinePalette,
    name: "palette",
    category: "design",
    label: "Палитра",
  },
  {
    icon: PiPencilSimpleBold,
    name: "pencil",
    category: "design",
    label: "Карандаш",
  },
  {
    icon: TfiText,
    name: "text",
    category: "general",
    label: "Текст",
  },

  {
    icon: LuHeading1,
    name: "h1",
    category: "general",
    label: "Заголовок 1",
  },
  {
    icon: LuHeading2,
    name: "h2",
    category: "general",
    label: "Заголовок 2",
  },
  {
    icon: LuHeading3,
    name: "h3",
    category: "general",
    label: "Заголовок 3",
  },
  {
    icon: FaListUl,
    name: "bullet",
    category: "general",
    label: "Маркированный список",
  },
  {
    icon: FaListOl,
    name: "ListNumber",
    category: "general",
    label: "Нумерованный список",
  },
  {
    icon: LuListTodo,
    name: "todo",
    category: "general",
    label: "Tody-Лист",
  },
  {
    icon: FaQuoteLeft,
    name: "quote",
    category: "general",
    label: "Цитата",
  },

  {
    icon: RiTextSnippet,
    name: "callout",
    category: "general",
    label: "Коллаут",
  }
];
