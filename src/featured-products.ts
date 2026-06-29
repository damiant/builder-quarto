import { BUILDER_PUBLIC_API_KEY } from "./builder-page.ts";

type Product = {
  title: string;
  description?: string;
  image?: string;
  price: number;
};

type BuilderProductContent = {
  data?: Partial<Product>;
};

type BuilderProductsResponse = {
  results?: BuilderProductContent[];
};

const PRODUCT_COUNT = 12;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

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

function formatPrice(price: number): string {
  return currencyFormatter.format(price);
}

function getProductImageUrl(image: string): string {
  const imageUrl = new URL(image);
  imageUrl.searchParams.set("width", "520");
  imageUrl.searchParams.set("quality", "85");
  imageUrl.searchParams.set("format", "webp");

  return imageUrl.toString();
}

function normalizeProduct(content: BuilderProductContent): Product | null {
  const { title, description, image, price } = content.data ?? {};

  if (!title || typeof price !== "number") {
    return null;
  }

  return {
    title,
    description,
    image,
    price,
  };
}

async function getFeaturedProducts(): Promise<Product[]> {
  const productsUrl = new URL("https://cdn.builder.io/api/v3/content/products");
  productsUrl.searchParams.set("apiKey", BUILDER_PUBLIC_API_KEY);
  productsUrl.searchParams.set("limit", PRODUCT_COUNT.toString());
  productsUrl.searchParams.set("fields", "data.title,data.description,data.image,data.price");

  const response = await fetch(productsUrl);

  if (!response.ok) {
    throw new Error(`Failed to load products: ${response.status}`);
  }

  const productsResponse = (await response.json()) as BuilderProductsResponse;

  return (productsResponse.results ?? [])
    .map(normalizeProduct)
    .filter((product): product is Product => Boolean(product));
}

function renderProductImage(product: Product): string {
  if (!product.image) {
    return `
      <div class="product-card-image product-card-image-placeholder" aria-hidden="true">
        <span class="product-card-image-initial">${escapeHtml(product.title.charAt(0))}</span>
      </div>
    `;
  }

  return `<img class="product-card-image" src="${escapeHtml(getProductImageUrl(product.image))}" alt="${escapeHtml(product.title)}" loading="lazy">`;
}

function renderProductCard(product: Product): string {
  const description = product.description
    ? `<p class="product-card-description">${escapeHtml(product.description)}</p>`
    : "";

  return `
    <article class="product-card">
      <div class="product-card-media">
        ${renderProductImage(product)}
      </div>
      <div class="product-card-details">
        <h3 class="product-card-title">${escapeHtml(product.title)}</h3>
        ${description}
        <p class="product-card-price">${escapeHtml(formatPrice(product.price))}</p>
      </div>
    </article>
  `;
}

export async function renderFeaturedProducts(): Promise<string> {
  const featuredProducts = await getFeaturedProducts();

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
