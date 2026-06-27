import "./style.css";
import { renderFeaturedProducts } from "./featured-products.ts";
import { renderFooter } from "./footer.ts";
import { renderFooterLinks } from "./footer-links.ts";
import { renderHeader, initHeaderInteractions } from "./header.ts";

async function renderApp(): Promise<void> {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
${renderHeader()}
${await renderFeaturedProducts()}
${renderFooterLinks()}
${renderFooter()}
`;

  initHeaderInteractions();
}

void renderApp();
