type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerColumns: FooterSection[][] = [
  [
    {
      title: "Shop and Learn",
      links: [
        { label: "Store", href: "https://www.apple.com/us/shop/goto/store" },
        { label: "Mac", href: "https://www.apple.com/mac/" },
        { label: "iPad", href: "https://www.apple.com/ipad/" },
        { label: "iPhone", href: "https://www.apple.com/iphone/" },
        { label: "Watch", href: "https://www.apple.com/watch/" },
        { label: "Vision", href: "https://www.apple.com/apple-vision-pro/" },
        { label: "AirPods", href: "https://www.apple.com/airpods/" },
        { label: "TV &amp; Home", href: "https://www.apple.com/tv-home/" },
        { label: "AirTag", href: "https://www.apple.com/airtag/" },
        { label: "Accessories", href: "https://www.apple.com/us/shop/goto/buy_accessories" },
        { label: "Gift Cards", href: "https://www.apple.com/us/shop/goto/giftcards" },
      ],
    },
    {
      title: "Apple Wallet",
      links: [
        { label: "Wallet", href: "https://www.apple.com/wallet/" },
        { label: "Apple&nbsp;Card", href: "https://www.apple.com/apple-card/" },
        { label: "Apple&nbsp;Pay", href: "https://www.apple.com/apple-pay/" },
        { label: "Apple&nbsp;Cash", href: "https://www.apple.com/apple-cash/" },
      ],
    },
  ],
  [
    {
      title: "Account",
      links: [
        { label: "Manage Your Apple Account", href: "https://account.apple.com/" },
        { label: "Apple Store Account", href: "https://www.apple.com/us/shop/goto/account" },
        { label: "iCloud.com", href: "https://www.icloud.com/" },
      ],
    },
    {
      title: "Entertainment",
      links: [
        { label: "Apple&nbsp;One", href: "https://www.apple.com/apple-one/" },
        { label: "Apple&nbsp;TV", href: "https://www.apple.com/apple-tv/" },
        { label: "Apple&nbsp;Music", href: "https://www.apple.com/apple-music/" },
        { label: "Apple&nbsp;Arcade", href: "https://www.apple.com/apple-arcade/" },
        { label: "Apple&nbsp;Fitness+", href: "https://www.apple.com/apple-fitness-plus/" },
        { label: "Apple&nbsp;News+", href: "https://www.apple.com/apple-news/" },
        { label: "Apple Podcasts", href: "https://www.apple.com/apple-podcasts/" },
        { label: "Apple&nbsp;Books", href: "https://www.apple.com/apple-books/" },
        { label: "App&nbsp;Store", href: "https://www.apple.com/app-store/" },
      ],
    },
  ],
  [
    {
      title: "Apple Store",
      links: [
        { label: "Find a Store", href: "https://www.apple.com/retail/" },
        { label: "Genius Bar", href: "https://www.apple.com/retail/geniusbar/" },
        { label: "Today at Apple", href: "https://www.apple.com/today/" },
        { label: "Group Reservations", href: "https://www.apple.com/today/groups/" },
        { label: "Apple Camp", href: "https://www.apple.com/today/camp/" },
        { label: "Apple Store App", href: "https://apps.apple.com/us/app/apple-store/id375380948" },
        { label: "Certified Refurbished", href: "https://www.apple.com/us/shop/goto/special_deals" },
        { label: "Apple&nbsp;Trade&nbsp;In", href: "https://www.apple.com/us/shop/goto/trade_in" },
        { label: "Financing", href: "https://www.apple.com/us/shop/goto/payment_plan" },
        { label: "Carrier Deals at Apple", href: "https://www.apple.com/us/shop/goto/buy_iphone/carrier_offers" },
        { label: "Order Status", href: "https://www.apple.com/us/shop/goto/order/list" },
        { label: "Shopping Help", href: "https://www.apple.com/us/shop/goto/help" },
      ],
    },
  ],
  [
    {
      title: "For Business",
      links: [
        { label: "Apple and Business", href: "https://www.apple.com/business/" },
        { label: "Shop for Business", href: "https://www.apple.com/retail/business/" },
      ],
    },
    {
      title: "For Education",
      links: [
        { label: "Apple and Education", href: "https://www.apple.com/education/" },
        { label: "Shop for K-12", href: "https://www.apple.com/education/k12/how-to-buy/" },
        { label: "Shop for College", href: "https://www.apple.com/us/shop/goto/educationrouting" },
      ],
    },
    {
      title: "For Healthcare",
      links: [
        { label: "Apple and Healthcare", href: "https://www.apple.com/healthcare/" },
      ],
    },
    {
      title: "For Government",
      links: [
        { label: "Apple and Government", href: "https://www.apple.com/government/" },
        { label: "Shop for Veterans and Military", href: "https://www.apple.com/us/shop/goto/eppstore/veteransandmilitary" },
        { label: "Shop for State and Local Employees", href: "https://www.apple.com/us_epp_67909/store" },
        { label: "Shop for Federal Employees", href: "https://www.apple.com/us_epp_55499/store" },
      ],
    },
  ],
  [
    {
      title: "Apple Values",
      links: [
        { label: "Accessibility", href: "https://www.apple.com/accessibility/" },
        { label: "Education", href: "https://www.apple.com/education-initiative/" },
        { label: "Environment", href: "https://www.apple.com/environment/" },
        { label: "Inclusion and Diversity", href: "https://www.apple.com/diversity/" },
        { label: "Privacy", href: "https://www.apple.com/privacy/" },
        { label: "Racial Equity and Justice", href: "https://www.apple.com/racial-equity-justice-initiative/" },
        { label: "Supply Chain Innovation", href: "https://www.apple.com/supply-chain/" },
      ],
    },
    {
      title: "About Apple",
      links: [
        { label: "Newsroom", href: "https://www.apple.com/newsroom/" },
        { label: "Apple Leadership", href: "https://www.apple.com/leadership/" },
        { label: "Career Opportunities", href: "https://www.apple.com/careers/us/" },
        { label: "Investors", href: "https://investor.apple.com/" },
        { label: "Ethics &amp; Compliance", href: "https://www.apple.com/compliance/" },
        { label: "Events", href: "https://www.apple.com/apple-events/" },
        { label: "Contact Apple", href: "https://www.apple.com/contact/" },
      ],
    },
  ],
];

const footerChevron = `
<svg class="footer-links-chevron" width="11" height="6" viewBox="0 0 11 6" aria-hidden="true">
  <polyline stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none" fill-rule="evenodd" points="10.075 0.675 5.5 5.323 0.925 0.675"></polyline>
</svg>`;

function renderFooterSection(section: FooterSection): string {
  return `
  <section class="footer-links-section">
    <h3 class="footer-links-heading">
      <span class="footer-links-heading-text">${section.title}</span>
      <button disabled class="footer-links-toggle" type="button">
        <span>${section.title}</span>
        <span class="footer-links-toggle-icon">${footerChevron}</span>
      </button>
    </h3>
    <ul role="list" class="footer-links-list">
      ${section.links.map(link => `
      <li role="listitem" class="footer-links-item">
        <a href="${link.href}" class="footer-links-anchor">${link.label}</a>
      </li>`).join("")}
    </ul>
  </section>`;
}

export function renderFooterLinks(): string {
  return `
<footer class="footer-links" aria-label="Footer Links">
  <nav aria-label="Apple Directory" role="navigation" class="footer-links-directory">
    ${footerColumns.map(column => `
    <div class="footer-links-column">
      ${column.map(renderFooterSection).join("")}
    </div>`).join("")}
  </nav>
</footer>`;
}
