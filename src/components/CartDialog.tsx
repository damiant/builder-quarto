import { useEffect } from "react";
import { currencyFormatter, getProductImageUrl, type Product } from "./ProductCard.tsx";

export type CartItem = Product & {
  id: string;
  quantity: number;
};

type CartDialogProps = {
  items: CartItem[];
  open: boolean;
  onClose: () => void;
};

export function CartDialog({ items, open, onClose }: CartDialogProps) {
  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="cart-dialog-layer" onClick={onClose}>
      <section
        className="cart-dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-dialog-header">
          <h2 id="cart-dialog-title" className="cart-dialog-title">
            Shopping cart
          </h2>
          <button
            type="button"
            className="cart-dialog-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {items.length > 0 ? (
          <>
            <ul className="cart-dialog-list">
              {items.map((item) => (
                <li key={item.id} className="cart-dialog-item">
                  <div className="cart-dialog-media">
                    {item.image ? (
                      <img
                        className="cart-dialog-image"
                        src={getProductImageUrl(item.image)}
                        alt={item.title}
                      />
                    ) : (
                      <div
                        className="cart-dialog-image cart-dialog-image-placeholder"
                        aria-hidden="true"
                      >
                        <span className="cart-dialog-image-initial">{item.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="cart-dialog-details">
                    <h3 className="cart-dialog-item-title">{item.title}</h3>
                    <p className="cart-dialog-item-meta">
                      {item.quantity} × {currencyFormatter.format(item.price)}
                    </p>
                  </div>
                  <p className="cart-dialog-line-total">
                    {currencyFormatter.format(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="cart-dialog-summary">
              <span className="cart-dialog-total-label">Total</span>
              <span className="cart-dialog-total-value">{currencyFormatter.format(cartTotal)}</span>
            </div>
            <button type="button" className="cart-dialog-checkout">
              Checkout
            </button>
          </>
        ) : (
          <div className="cart-dialog-empty">
            <p className="cart-dialog-empty-title">Your cart is empty.</p>
            <p className="cart-dialog-empty-text">Add a product to see it here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
