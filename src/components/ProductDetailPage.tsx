import { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "./FeaturedProducts.tsx";
import { currencyFormatter, getProductImageUrl, type Product } from "./ProductCard.tsx";

type ProductDetailPageProps = {
  productId: string;
};

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    fetchFeaturedProducts(50)
      .then((products) =>
        setProduct(
          products.find((item) => item.sku === productId || item.slug === productId) ?? null,
        ),
      )
      .catch(() => setProduct(null));
  }, [productId]);

  if (product === undefined) return null;

  if (product === null) {
    return (
      <main className="product-detail-status" aria-labelledby="product-detail-status-title">
        <p className="product-detail-eyebrow">Product not found</p>
        <h1 id="product-detail-status-title" className="product-detail-status-title">
          We couldn't find that product.
        </h1>
        <a className="product-detail-back-link" href="/">
          Back to featured products
        </a>
      </main>
    );
  }

  return (
    <main className="product-detail-page" aria-labelledby="product-detail-title">
      <a className="product-detail-back-link" href="/">
        Back to featured products
      </a>
      <section className="product-detail-layout">
        <div className="product-detail-media">
          {product.image ? (
            <img
              className="product-detail-image"
              src={getProductImageUrl(product.image)}
              alt={product.title}
            />
          ) : (
            <div
              className="product-detail-image product-detail-image-placeholder"
              aria-hidden="true"
            >
              <span className="product-detail-image-initial">{product.title.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="product-detail-content">
          <p className="product-detail-eyebrow">Quarto product</p>
          <h1 id="product-detail-title" className="product-detail-title">
            {product.title}
          </h1>
          {product.description && (
            <p className="product-detail-description">{product.description}</p>
          )}
          <p className="product-detail-price">{currencyFormatter.format(product.price)}</p>
          <button className="product-detail-button" type="button">
            Add to cart
          </button>
        </div>
      </section>
    </main>
  );
}
