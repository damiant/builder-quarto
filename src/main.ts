import "./style.css";
import { renderFeaturedProducts } from "./featured-products.ts";
import { renderFooter } from "./footer.ts";
import { renderFooterLinks } from "./footer-links.ts";
import { renderHeader, initHeaderInteractions } from "./header.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
${renderHeader()}
${renderFeaturedProducts()}
${renderFooterLinks()}
${renderFooter()}
`;

initHeaderInteractions();
