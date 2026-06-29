export type Product = {
  title: string;
  description?: string;
  image?: string;
  price: number;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function getProductImageUrl(image: string): string {
  const imageUrl = new URL(image);
  imageUrl.searchParams.set("width", "520");
  imageUrl.searchParams.set("quality", "85");
  imageUrl.searchParams.set("format", "webp");
  return imageUrl.toString();
}

export function ProductCard({ title, description, image, price }: Product) {
  return (
    <article className="product-card">
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
    </article>
  );
}
