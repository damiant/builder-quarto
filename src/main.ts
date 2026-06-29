import "./style.css";
import { loadBuilderComponentRegistry } from "./builder-components.ts";
import { getBuilderPage, isBuilderPreviewRequest, loadBuilderWebComponents } from "./builder-page.ts";
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

function renderPageError(): string {
  return `
    <main class="builder-page-status" aria-labelledby="builder-page-status-title">
      <p class="builder-page-status-eyebrow">Builder page</p>
      <h1 id="builder-page-status-title" class="builder-page-status-title">This page could not be loaded right now.</h1>
    </main>
  `;
}

async function renderMainContent(urlPath: string, searchParams: URLSearchParams): Promise<string> {
  if (urlPath === "/" && !isBuilderPreviewRequest(searchParams)) {
    return renderFeaturedProducts();
  }

  try {
    const builderPage = await getBuilderPage(urlPath, searchParams);

    if (!builderPage) {
      return urlPath === "/" ? renderFeaturedProducts() : renderPageNotFound(urlPath);
    }

    if (builderPage.title) {
      document.title = builderPage.title;
    }

    loadBuilderWebComponents();

    return `<main class="builder-page-content">${builderPage.html}</main>`;
  } catch (error) {
    console.error(error);

    return renderPageError();
  }
}

async function renderApp(): Promise<void> {
  const urlPath = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
${renderHeader()}
${await renderMainContent(urlPath, searchParams)}
${renderFooterLinks()}
${renderFooter()}
`;

  initHeaderInteractions();
}

loadBuilderComponentRegistry();
void renderApp();
