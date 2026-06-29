import { useEffect, useMemo, useState } from "react";
import { BUILDER_PUBLIC_API_KEY } from "../builder-page.ts";
import { getCategorySlug } from "./FeaturedProducts.tsx";

type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

type BuilderCategoryContent = {
  data?: {
    title?: string;
  };
};

type BuilderCategoriesResponse = {
  results?: BuilderCategoryContent[];
};

function normalizeCategory(content: BuilderCategoryContent): FooterLink | null {
  const title = content.data?.title;
  if (!title) return null;
  return { label: title, href: `/categories/${getCategorySlug(title)}` };
}

async function fetchCategoryLinks(): Promise<FooterLink[]> {
  const categoriesUrl = new URL("https://cdn.builder.io/api/v3/content/categories");
  categoriesUrl.searchParams.set("apiKey", BUILDER_PUBLIC_API_KEY);
  categoriesUrl.searchParams.set("limit", "20");
  categoriesUrl.searchParams.set("fields", "data.title");

  const response = await fetch(categoriesUrl);
  if (!response.ok) throw new Error(`Failed to load categories: ${response.status}`);

  const data = (await response.json()) as BuilderCategoriesResponse;
  return (data.results ?? [])
    .map(normalizeCategory)
    .filter((link): link is FooterLink => Boolean(link));
}

const footerColumns: FooterSection[][] = [
  [
    {
      title: "Shop Gadgets",
      links: [
        { label: "New Arrivals", href: "/discover/new-arrivals" },
        { label: "Smart Home", href: "#smart-home" },
        { label: "Wearable Tech", href: "#wearable-tech" },
        { label: "Audio Gadgets", href: "#audio-gadgets" },
        { label: "Gaming Gear", href: "#gaming-gear" },
        { label: "Travel Tech", href: "#travel-tech" },
        { label: "Desktop Gadgets", href: "#desktop-gadgets" },
        { label: "Kitchen Tech", href: "#kitchen-tech" },
        { label: "Charge & Power", href: "#charge-power" },
        { label: "Quarto Exclusives", href: "#quarto-exclusives" },
        { label: "Gift Cards", href: "#gift-cards" },
      ],
    },
    {
      title: "Deals & Drops",
      links: [
        { label: "Daily Deals", href: "/discover/daily-deal" },
        { label: "Limited Drops", href: "/discover/limited-drop" },
        { label: "Bundle Savings", href: "#bundle-savings" },
        { label: "Clearance Finds", href: "/discover/clearance" },
      ],
    },
  ],
  [
    {
      title: "Account",
      links: [
        { label: "Manage Your Account", href: "/account" },
        { label: "Order History", href: "#order-history" },
        { label: "Saved Gadgets", href: "#saved-gadgets" },
      ],
    },
    {
      title: "Discover",
      links: [
        { label: "Buying Guides", href: "#buying-guides" },
        { label: "Staff Picks", href: "/discover/staff-pick" },
        { label: "Tech Trends", href: "/discover/tech-trend" },
        { label: "Gift Ideas", href: "/discover/gift-idea" },
        { label: "Setup Inspiration", href: "#setup-inspiration" },
        { label: "How-To Videos", href: "#how-to-videos" },
        { label: "Compare Gadgets", href: "#compare-gadgets" },
        { label: "Quarto Blog", href: "#quarto-blog" },
        { label: "Rewards", href: "#rewards" },
      ],
    },
  ],
  [
    {
      title: "Quarto Store",
      links: [
        { label: "Find a Store", href: "/stores" },
        { label: "Store Events", href: "#store-events" },
        { label: "Product Demos", href: "#product-demos" },
        { label: "Personal Shopping", href: "#personal-shopping" },
        { label: "Quarto App", href: "#quarto-app" },
        { label: "Certified Refurbished", href: "#refurbished" },
        { label: "Trade-In Program", href: "#trade-in" },
        { label: "Financing", href: "#financing" },
        { label: "Protection Plans", href: "#protection-plans" },
        { label: "Order Status", href: "#order-status" },
        { label: "Shipping Options", href: "#shipping-options" },
        { label: "Shopping Help", href: "#shopping-help" },
      ],
    },
  ],
  [
    {
      title: "For Work",
      links: [
        { label: "Quarto for Business", href: "#business" },
        { label: "Bulk Orders", href: "#bulk-orders" },
      ],
    },
    {
      title: "For Creators",
      links: [
        { label: "Creator Kits", href: "#creator-kits" },
        { label: "Studio Gear", href: "#studio-gear" },
        { label: "Streaming Setups", href: "#streaming-setups" },
      ],
    },
    {
      title: "For Students",
      links: [{ label: "Student Tech", href: "#student-tech" }],
    },
    {
      title: "For Teams",
      links: [
        { label: "Team Essentials", href: "#team-essentials" },
        { label: "Office Upgrades", href: "#office-upgrades" },
        { label: "Remote Work Gear", href: "#remote-work-gear" },
        { label: "Corporate Gifts", href: "#corporate-gifts" },
      ],
    },
  ],
  [
    {
      title: "Quarto Values",
      links: [
        { label: "Sustainability", href: "/sustainability" },
        { label: "Responsible Sourcing", href: "#responsible-sourcing" },
        { label: "Accessibility", href: "/accessibility" },
        { label: "Privacy", href: "/privacy" },
        { label: "Product Safety", href: "#product-safety" },
        { label: "Repair & Reuse", href: "#repair-reuse" },
        { label: "Community Impact", href: "#community-impact" },
      ],
    },
    {
      title: "About Quarto",
      links: [
        { label: "Our Story", href: "#our-story" },
        { label: "Careers", href: "#careers" },
        { label: "Press", href: "#press" },
        { label: "Partner With Us", href: "#partners" },
        { label: "Ethics & Compliance", href: "#compliance" },
        { label: "Events", href: "#events" },
        { label: "Contact Quarto", href: "#contact" },
      ],
    },
  ],
];

const footerChevron = (
  <svg className="footer-links-chevron" width="11" height="6" viewBox="0 0 11 6" aria-hidden="true">
    <polyline
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      fillRule="evenodd"
      points="10.075 0.675 5.5 5.323 0.925 0.675"
    />
  </svg>
);

function FooterSection({ title, links }: FooterSection) {
  return (
    <section className="footer-links-section">
      <h3 className="footer-links-heading">
        <span className="footer-links-heading-text">{title}</span>
        <button disabled className="footer-links-toggle-btn" type="button">
          <span>{title}</span>
          <span className="footer-links-toggle-icon">{footerChevron}</span>
        </button>
      </h3>
      <ul role="list" className="footer-links-list">
        {links.map((link) => (
          <li key={link.href} role="listitem" className="footer-links-item">
            <a href={link.href} className="footer-links-anchor">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FooterLinks() {
  const [categoryLinks, setCategoryLinks] = useState<FooterLink[]>([]);

  useEffect(() => {
    fetchCategoryLinks().then(setCategoryLinks).catch(console.error);
  }, []);

  const columns = useMemo(
    () =>
      footerColumns.map((column) =>
        column.map((section) =>
          section.title === "Quarto Store" && categoryLinks.length > 0
            ? { ...section, links: categoryLinks }
            : section,
        ),
      ),
    [categoryLinks],
  );

  return (
    <footer className="footer-links" aria-label="Footer Links">
      <nav aria-label="Quarto Directory" role="navigation" className="footer-links-directory">
        {columns.map((column, i) => (
          <div key={i} className="footer-links-column">
            {column.map((section) => (
              <FooterSection key={section.title} {...section} />
            ))}
          </div>
        ))}
      </nav>
    </footer>
  );
}
