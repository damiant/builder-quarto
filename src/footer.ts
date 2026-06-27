type LegalLink = {
  label: string;
  href: string;
};

const legalLinks: LegalLink[] = [
  { label: "Privacy Policy", href: "#privacy-policy" },
  { label: "Terms of Use", href: "#terms" },
  { label: "Sales and Refunds", href: "#sales-refunds" },
  { label: "Legal", href: "#legal" },
  { label: "Site Map", href: "#site-map" },
];

const countrySelector = `
<a
  title="Choose your country or region"
  aria-label="United States. Choose your country or region"
  href="#country-region"
  class="footer-country-link"
>
  United States
</a>`;

export function renderFooter(): string {
  return `
<footer class="footer-legal" aria-label="Footer">
  <section class="footer-legal-content">
    <div x-ms-format-detection="none" class="footer-shop-message">
      More ways to shop Quarto:
      <a href="#stores" class="footer-shop-link">Find a Quarto store</a>
      or
      <a href="#retail-partners" class="footer-shop-link">authorized gadget partner</a>
      near you.
      <span class="footer-callout">
        Or call
        <a href="tel:1-800-786-2786" class="footer-shop-link footer-phone-link">1-800-QUO-ARTO</a>
        (1-800-786-2786).
      </span>
    </div>
    <div class="footer-legal-row">
      <div class="footer-region-mobile">${countrySelector}</div>
      <div class="footer-legal-group">
        <div class="footer-copyright">Copyright © 2026 Quarto Inc. All rights reserved.</div>
        <ul role="list" class="footer-legal-list">
          ${legalLinks.map(link => `
          <li role="listitem" class="footer-legal-item">
            <a href="${link.href}" class="footer-legal-link">${link.label}</a>
          </li>`).join("")}
        </ul>
      </div>
      <div class="footer-region-desktop">${countrySelector}</div>
    </div>
  </section>
</footer>`;
}
