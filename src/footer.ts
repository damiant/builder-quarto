type LegalLink = {
  label: string;
  href: string;
};

const legalLinks: LegalLink[] = [
  { label: "Privacy Policy", href: "https://www.apple.com/legal/privacy/" },
  { label: "Terms of Use", href: "https://www.apple.com/legal/internet-services/terms/site.html" },
  { label: "Sales and Refunds", href: "https://www.apple.com/us/shop/goto/help/sales_refunds" },
  { label: "Legal", href: "https://www.apple.com/legal/" },
  { label: "Site Map", href: "https://www.apple.com/sitemap/" },
];

const countrySelector = `
<a
  title="Choose your country or region"
  aria-label="United States. Choose your country or region"
  href="https://www.apple.com/choose-country-region/"
  class="footer-country-link"
>
  United States
</a>`;

export function renderFooter(): string {
  return `
<footer class="footer-legal" aria-label="Footer">
  <section class="footer-legal-content">
    <div x-ms-format-detection="none" class="footer-shop-message">
      More ways to shop:
      <a href="https://www.apple.com/retail/" class="footer-shop-link">Find an Apple Store</a>
      or
      <a href="https://locate.apple.com/" class="footer-shop-link">other retailer</a>
      near you.
      <span class="footer-callout">
        Or call
        <a href="tel:1-800-692-7753" class="footer-shop-link footer-phone-link">1-800-MY-APPLE</a>
        (1-800-692-7753).
      </span>
    </div>
    <div class="footer-legal-row">
      <div class="footer-region-mobile">${countrySelector}</div>
      <div class="footer-legal-group">
        <div class="footer-copyright">Copyright © 2026 Apple Inc. All rights reserved.</div>
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
