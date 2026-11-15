import { ACCESS_LEVEL } from "./page.types";

export const canEditPage = (access: ACCESS_LEVEL | undefined | null) =>
  access === ACCESS_LEVEL.EDIT;
