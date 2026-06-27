import "./style.css";
import { renderFooter } from "./footer.ts";
import { renderFooterLinks } from "./footer-links.ts";
import { renderHeader, initHeaderInteractions } from "./header.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
${renderHeader()}
<section id="spacer"></section>
${renderFooterLinks()}
${renderFooter()}
`;

initHeaderInteractions();
