export type Product = {
  title: string;
  slug?: string;
  sku?: string;
  description?: string;
  image?: string;
  price: number;
  categoryId?: string;
};

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function getProductSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getProductImageUrl(image: string): string {
  const imageUrl = new URL(image);
  imageUrl.searchParams.set("width", "520");
  imageUrl.searchParams.set("quality", "85");
  imageUrl.searchParams.set("format", "webp");
  return imageUrl.toString();
}

export const productCardBuilderConfig = {
  name: "Featured Product Card",
  inputs: [
    { name: "title", type: "text", defaultValue: "Featured gadget" },
    {
      name: "description",
      type: "longText",
      defaultValue: "A curated Quarto product ready to feature on your page.",
    },
    { name: "image", type: "file" },
    { name: "price", type: "number", defaultValue: 99 },
  ],
};

export function ProductCard({ title, slug, sku, description, image, price }: Product) {
  const productPath = sku ?? slug ?? getProductSlug(title);

  return (
    <article className="product-card">
      <a
        className="product-card-link"
        href={`/products/${productPath}`}
        aria-label={`View ${title}`}
      >
        <div className="product-card-media">
          {image ? (
            <img
              className="product-card-image"
              src={getProductImageUrl(image)}
              alt={title}
              loading="lazy"
            />
          ) : (
            <div className="product-card-image product-card-image-placeholder" aria-hidden="true">
              <span className="product-card-image-initial">{title.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="product-card-details">
          <h3 className="product-card-title">{title}</h3>
          {description && <p className="product-card-description">{description}</p>}
          <p className="product-card-price">{currencyFormatter.format(price)}</p>
        </div>
      </a>
    </article>
  );
}
