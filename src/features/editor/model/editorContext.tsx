import { useCanEditPage } from "@/entities/pages/hooks/use-can-edit-page";
import { createContext, useContext } from "react";

export const EditorContext = createContext<{
  pageId: string;
  projectId: string;
} | null>(null);

export function useEditorPage() {
  const context = useContext(EditorContext);
  if (!context) throw new Error("Missing EditorContext.Provider in the tree");
  return context;
}

export function useCanEdit() {
  const { pageId, projectId } = useEditorPage();
  return useCanEditPage({ pageId, projectId });
}
