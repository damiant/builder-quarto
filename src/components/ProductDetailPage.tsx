import { useEffect, useRef, useState } from "react";
import { addCartItem } from "./cart.ts";
import { fetchProductBySku } from "./FeaturedProducts.tsx";
import { currencyFormatter, getProductImageUrl } from "./ProductCard.tsx";

type ProductDetailPageProps = {
  productId: string;
};

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [cartButtonDisabled, setCartButtonDisabled] = useState(false);
  const cartButtonTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(cartButtonTimer.current);
  }, []);

  useEffect(() => {
    fetchProductBySku(productId)
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [productId]);

  if (product === undefined) return null;

  function handleAddToCart() {
    if (cartButtonDisabled) return;

    addCartItem({
      id: product?.sku ?? product?.slug ?? productId,
      title: product?.title ?? productId,
      price: product?.price ?? 0,
      image: product?.image,
    });

    setCartButtonDisabled(true);
    window.clearTimeout(cartButtonTimer.current);
    cartButtonTimer.current = window.setTimeout(() => setCartButtonDisabled(false), 1000);
  }

  if (product === null) {
    return (
      <main className="product-detail-status" aria-labelledby="product-detail-status-title">
        <p className="product-detail-eyebrow">Product not found</p>
        <h1 id="product-detail-status-title" className="product-detail-status-title">
          We couldn't find that product.
        </h1>
        <button
          className="product-detail-back-link"
          type="button"
          onClick={() => (history.length > 1 ? history.back() : (location.href = "/"))}
        >
          Back
        </button>
      </main>
    );
  }

  return (
    <main className="product-detail-page" aria-labelledby="product-detail-title">
      <button
        className="product-detail-back-link"
        type="button"
        onClick={() => (history.length > 1 ? history.back() : (location.href = "/"))}
      >
        Back
      </button>
      <section className="product-detail-layout">
        <div className="product-detail-media">
          {product.image ? (
            <img
              className="product-detail-image"
              src={getProductImageUrl(product.image)}
              alt={product.title}
              loading="lazy"
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
          <button
            className="product-detail-btn"
            type="button"
            onClick={handleAddToCart}
            disabled={cartButtonDisabled}
          >
            {cartButtonDisabled ? "Added to cart" : "Add to cart"}
          </button>
        </div>
      </section>
    </main>
  );
}
