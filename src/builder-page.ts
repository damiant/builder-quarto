export const BUILDER_PUBLIC_API_KEY = "b9fca26fe967446595da74f3f38325f1";
export const BUILDER_PAGE_MODEL = "page";

const BUILDER_PREVIEW_PARAMS = new Set([
  "builder.preview",
  "builder.editing",
  "builder.frameEditing",
  "builder.overrides.page",
  "includeUnpublished",
  "preview",
]);

export function isBuilderPreviewRequest(searchParams: URLSearchParams): boolean {
  for (const [paramName, paramValue] of searchParams) {
    if (BUILDER_PREVIEW_PARAMS.has(paramName) && paramValue !== "false") {
      return true;
    }
  }
  return false;
}
