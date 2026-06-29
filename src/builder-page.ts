const BUILDER_PUBLIC_API_KEY = "b9fca26fe967446595da74f3f38325f1";
const BUILDER_PAGE_MODEL = "page";
const BUILDER_WEBCOMPONENTS_SCRIPT_ID = "builder-webcomponents-script";
const BUILDER_PREVIEW_PARAMS = new Set([
  "builder.preview",
  "builder.editing",
  "builder.frameEditing",
  "builder.overrides.page",
  "includeUnpublished",
  "preview",
]);
const BUILDER_PASSTHROUGH_PARAMS = new Set([
  "builder.preview",
  "builder.editing",
  "builder.frameEditing",
  "builder.overrides.page",
  "builder.space",
  "builder.cachebust",
  "cachebust",
  "noCache",
  "includeUnpublished",
  "preview",
]);

export type BuilderPageResult = {
  html: string;
  title?: string;
  description?: string;
};

type BuilderHtmlResponse = {
  data?: {
    html?: string;
    title?: string;
    description?: string;
  };
};

export { BUILDER_PUBLIC_API_KEY };

export function isBuilderPreviewRequest(searchParams: URLSearchParams): boolean {
  for (const [paramName, paramValue] of searchParams) {
    if (BUILDER_PREVIEW_PARAMS.has(paramName) && paramValue !== "false") {
      return true;
    }
  }

  return false;
}

function appendBuilderPreviewParams(builderPageUrl: URL, searchParams: URLSearchParams): void {
  for (const [paramName, paramValue] of searchParams) {
    if (BUILDER_PASSTHROUGH_PARAMS.has(paramName) || paramName.startsWith("builder.")) {
      builderPageUrl.searchParams.append(paramName, paramValue);
    }
  }

  if (isBuilderPreviewRequest(searchParams)) {
    builderPageUrl.searchParams.set("includeUnpublished", "true");
    builderPageUrl.searchParams.set("cachebust", "true");
    builderPageUrl.searchParams.set("noCache", "true");
  }
}

function getBuilderPageUrl(urlPath: string, searchParams: URLSearchParams): URL {
  const builderPageUrl = new URL(`https://cdn.builder.io/api/v1/html/${BUILDER_PAGE_MODEL}`);
  builderPageUrl.searchParams.set("apiKey", BUILDER_PUBLIC_API_KEY);
  builderPageUrl.searchParams.set("url", urlPath);
  appendBuilderPreviewParams(builderPageUrl, searchParams);

  return builderPageUrl;
}

export async function getBuilderPage(urlPath: string, searchParams: URLSearchParams): Promise<BuilderPageResult | null> {
  const response = await fetch(getBuilderPageUrl(urlPath, searchParams));

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load Builder page: ${response.status}`);
  }

  const builderResponse = (await response.json()) as BuilderHtmlResponse;
  const html = builderResponse.data?.html;

  if (!html) {
    return null;
  }

  return {
    html,
    title: builderResponse.data?.title,
    description: builderResponse.data?.description,
  };
}

export function loadBuilderWebComponents(): void {
  if (document.getElementById(BUILDER_WEBCOMPONENTS_SCRIPT_ID)) {
    return;
  }

  const builderScript = document.createElement("script");
  builderScript.id = BUILDER_WEBCOMPONENTS_SCRIPT_ID;
  builderScript.async = true;
  builderScript.src = "https://cdn.builder.io/js/webcomponents";
  document.head.append(builderScript);
}
