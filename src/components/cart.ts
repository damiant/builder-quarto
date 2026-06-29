export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
};

const cartStorageKey = "quarto-cart";
const cartChangedEvent = "quarto-cart-changed";

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const storedCart = window.localStorage.getItem(cartStorageKey);
    if (!storedCart) return [];

    const parsedCart = JSON.parse(storedCart);
    if (!Array.isArray(parsedCart)) return [];

    return parsedCart.filter(
      (item): item is CartItem =>
        typeof item?.id === "string" &&
        typeof item.title === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number",
    );
  } catch {
    return [];
  }
}

function writeStoredCart(cartItems: CartItem[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  window.dispatchEvent(new Event(cartChangedEvent));
}

export function getCartItems(): CartItem[] {
  return readStoredCart();
}

export function getCartItemCount(cartItems: CartItem[]): number {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

export function addCartItem(item: Omit<CartItem, "quantity">) {
  const cartItems = readStoredCart();
  const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...item, quantity: 1 });
  }

  writeStoredCart(cartItems);
}

export function subscribeToCartChanges(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(cartChangedEvent, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(cartChangedEvent, listener);
    window.removeEventListener("storage", listener);
  };
}
