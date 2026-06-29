import "./style.css";
import { hydrateBuilderCustomComponents, registerBuilderComponents } from "./builder-components.ts";
import { getBuilderPage, isBuilderPreviewRequest, type BuilderPageBlock } from "./builder-page.ts";
import { renderFeaturedProducts } from "./featured-products.ts";
import { renderFooter } from "./footer.ts";
import { renderFooterLinks } from "./footer-links.ts";
import { renderHeader, initHeaderInteractions } from "./header.ts";

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

function renderPageNotFound(urlPath: string): string {
  return `
    <main class="builder-page-status" aria-labelledby="builder-page-status-title">
      <p class="builder-page-status-eyebrow">Page not found</p>
      <h1 id="builder-page-status-title" class="builder-page-status-title">No Builder page found for ${escapeHtml(urlPath)}</h1>
    </main>
  `;
}

type RenderedMainContent = {
  html: string;
  blocks: BuilderPageBlock[];
};

function renderPageError(): string {
  return `
    <main class="builder-page-status" aria-labelledby="builder-page-status-title">
      <p class="builder-page-status-eyebrow">Builder page</p>
      <h1 id="builder-page-status-title" class="builder-page-status-title">This page could not be loaded right now.</h1>
    </main>
  `;
}

async function renderMainContent(urlPath: string, searchParams: URLSearchParams): Promise<RenderedMainContent> {
  if (urlPath === "/" && !isBuilderPreviewRequest(searchParams)) {
    return { html: await renderFeaturedProducts(), blocks: [] };
  }

  try {
    const builderPage = await getBuilderPage(urlPath, searchParams);

    if (!builderPage) {
      return {
        html: urlPath === "/" ? await renderFeaturedProducts() : renderPageNotFound(urlPath),
        blocks: [],
      };
    }

    if (builderPage.title) {
      document.title = builderPage.title;
    }

    return {
      html: `<main class="builder-page-content">${builderPage.html}</main>`,
      blocks: builderPage.blocks,
    };
  } catch (error) {
    console.error(error);

    return { html: renderPageError(), blocks: [] };
  }
}

async function renderApp(): Promise<void> {
  const urlPath = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  const mainContent = await renderMainContent(urlPath, searchParams);

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
${renderHeader()}
${mainContent.html}
${renderFooterLinks()}
${renderFooter()}
`;

  initHeaderInteractions();
  await hydrateBuilderCustomComponents(mainContent.blocks);
}

registerBuilderComponents();
void renderApp();
