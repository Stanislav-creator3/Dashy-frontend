import { defineExtension } from "lexical";

export const editableExtension = defineExtension({
  name: "@/app/editor/editable",
  config: { editable: false },
  init: (editorConfig, config) => {
    editorConfig.editable = config.editable;
  },
});
