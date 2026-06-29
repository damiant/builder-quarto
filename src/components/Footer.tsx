type LegalLink = {
  label: string;
  href: string;
};

const legalLinks: LegalLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "#terms" },
  { label: "Sales and Refunds", href: "#sales-refunds" },
  { label: "Legal", href: "#legal" },
  { label: "Site Map", href: "#site-map" },
];

const countrySelector = (
  <a
    title="Choose your country or region"
    aria-label="United States. Choose your country or region"
    href="#country-region"
    className="footer-country-link"
  >
    United States
  </a>
);

export function Footer() {
  return (
    <footer className="footer-legal" aria-label="Footer">
      <section className="footer-legal-content">
        <div className="footer-shop-message">
          More ways to shop Quarto:{" "}
          <a href="#stores" className="footer-shop-link">
            Find a Quarto store
          </a>{" "}
          or{" "}
          <a href="#retail-partners" className="footer-shop-link">
            authorized gadget partner
          </a>{" "}
          near you.{" "}
          <span className="footer-callout">
            Or call{" "}
            <a href="tel:1-800-786-2786" className="footer-shop-link footer-phone-link">
              1-800-QUO-ARTO
            </a>{" "}
            (1-800-786-2786).
          </span>
        </div>
        <div className="footer-legal-row">
          <div className="footer-region-mobile">{countrySelector}</div>
          <div className="footer-legal-group">
            <div className="footer-copyright">
              Copyright © 2026 Quarto Inc. All rights reserved.
            </div>
            <ul role="list" className="footer-legal-list">
              {legalLinks.map((link) => (
                <li key={link.href} role="listitem" className="footer-legal-item">
                  <a href={link.href} className="footer-legal-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-region-desktop">{countrySelector}</div>
        </div>
      </section>
    </footer>
  );
}
