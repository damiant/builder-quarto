type Product = {
  title: string;
  price: string;
  primaryColor: string;
  secondaryColor: string;
};

const products: Product[] = [
  {
    title: "Quarto Starter Kit",
    price: "$24.00",
    primaryColor: "#005dab",
    secondaryColor: "#d7ecff",
  },
  { title: "Notebook Pro", price: "$48.00", primaryColor: "#1f2937", secondaryColor: "#e5e7eb" },
  {
    title: "Presentation Deck",
    price: "$36.00",
    primaryColor: "#7c3aed",
    secondaryColor: "#ede9fe",
  },
  {
    title: "Dashboard Builder",
    price: "$64.00",
    primaryColor: "#047857",
    secondaryColor: "#d1fae5",
  },
  {
    title: "Authoring Toolkit",
    price: "$42.00",
    primaryColor: "#b45309",
    secondaryColor: "#fef3c7",
  },
  { title: "Publishing Pack", price: "$58.00", primaryColor: "#be123c", secondaryColor: "#ffe4e6" },
  {
    title: "Manuscript Bundle",
    price: "$52.00",
    primaryColor: "#334155",
    secondaryColor: "#e2e8f0",
  },
  {
    title: "Interactive Charts",
    price: "$46.00",
    primaryColor: "#0f766e",
    secondaryColor: "#ccfbf1",
  },
  { title: "Website Studio", price: "$72.00", primaryColor: "#2563eb", secondaryColor: "#dbeafe" },
  {
    title: "Reference Library",
    price: "$30.00",
    primaryColor: "#9333ea",
    secondaryColor: "#f3e8ff",
  },
  { title: "Extensions Set", price: "$40.00", primaryColor: "#c2410c", secondaryColor: "#ffedd5" },
  {
    title: "Project Templates",
    price: "$34.00",
    primaryColor: "#0369a1",
    secondaryColor: "#e0f2fe",
  },
  { title: "Book Builder", price: "$66.00", primaryColor: "#4d7c0f", secondaryColor: "#ecfccb" },
  {
    title: "Format Converter",
    price: "$28.00",
    primaryColor: "#6d28d9",
    secondaryColor: "#ede9fe",
  },
];

function createProductImage(product: Product): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><rect width="320" height="240" rx="24" fill="${product.secondaryColor}"/><rect x="64" y="48" width="192" height="144" rx="18" fill="${product.primaryColor}" opacity="0.16"/><rect x="96" y="70" width="128" height="100" rx="14" fill="${product.primaryColor}"/><circle cx="128" cy="104" r="12" fill="${product.secondaryColor}"/><path d="M112 146h96l-28-34-20 24-16-18z" fill="${product.secondaryColor}"/></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function renderProductCard(product: Product): string {
  return `
    <article class="product-card">
      <div class="product-card-media">
        <img class="product-card-image" src="${createProductImage(product)}" alt="${product.title}" loading="lazy">
      </div>
      <div class="product-card-details">
        <h3 class="product-card-title">${product.title}</h3>
        <p class="product-card-price">${product.price}</p>
      </div>
    </article>
  `;
}

export function renderFeaturedProducts(): string {
  const featuredProducts = products.slice(0, 12);

  return `
    <section class="featured-products" aria-labelledby="featured-products-title">
      <div class="featured-products-header">
        <p class="featured-products-eyebrow">Featured products</p>
        <h2 id="featured-products-title" class="featured-products-title">Shop our latest essentials</h2>
      </div>
      <div class="featured-products-grid">
        ${featuredProducts.map(renderProductCard).join("")}
      </div>
    </section>
  `;
}
