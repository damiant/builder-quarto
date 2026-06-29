const BUILDER_PUBLIC_API_KEY = "b9fca26fe967446595da74f3f38325f1";
const BUILDER_PAGE_MODEL = "page";
const BUILDER_WEBCOMPONENTS_SCRIPT_ID = "builder-webcomponents-script";

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

function getBuilderPageUrl(urlPath: string): URL {
  const builderPageUrl = new URL(`https://cdn.builder.io/api/v1/html/${BUILDER_PAGE_MODEL}`);
  builderPageUrl.searchParams.set("apiKey", BUILDER_PUBLIC_API_KEY);
  builderPageUrl.searchParams.set("url", urlPath);

  return builderPageUrl;
}

export async function getBuilderPage(urlPath: string): Promise<BuilderPageResult | null> {
  const response = await fetch(getBuilderPageUrl(urlPath));

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
