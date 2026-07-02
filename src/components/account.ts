const accountEmailStorageKey = "quarto-account-email";
const accountChangedEvent = "quarto-account-changed";

export function getStoredAccountEmail(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const email = window.localStorage.getItem(accountEmailStorageKey);
    return email?.trim() || null;
  } catch {
    return null;
  }
}

export function signInAccount(email: string) {
  if (typeof window === "undefined") return false;

  const trimmedEmail = email.trim();
  if (!trimmedEmail) return false;

  try {
    window.localStorage.setItem(accountEmailStorageKey, trimmedEmail);
  } catch {
    return false;
  }

  window.dispatchEvent(new Event(accountChangedEvent));
  return true;
}

export function signOutAccount() {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.removeItem(accountEmailStorageKey);
  } catch {
    return false;
  }

  window.dispatchEvent(new Event(accountChangedEvent));
  return true;
}

export function subscribeToAccountChanges(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(accountChangedEvent, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(accountChangedEvent, listener);
    window.removeEventListener("storage", listener);
  };
}
