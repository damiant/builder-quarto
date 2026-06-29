import { useEffect, useState } from "react";
import { BUILDER_PUBLIC_API_KEY } from "../builder-page.ts";
import { StoreCard, type Store } from "./StoreCard.tsx";

type BuilderStoreContent = {
  data?: Partial<Store>;
};

type BuilderStoresResponse = {
  results?: BuilderStoreContent[];
};

function normalizeStore(content: BuilderStoreContent): Store | null {
  const { title, address } = content.data ?? {};
  if (!title || !address) return null;
  return {
    title,
    address,
    phone: content.data?.phone,
    hours: content.data?.hours,
    image: content.data?.image,
  };
}

export async function fetchStores(): Promise<Store[]> {
  const storesUrl = new URL("https://cdn.builder.io/api/v3/content/stores");
  storesUrl.searchParams.set("apiKey", BUILDER_PUBLIC_API_KEY);
  storesUrl.searchParams.set("limit", "100");
  storesUrl.searchParams.set("fields", "data.title,data.address,data.phone,data.hours,data.image");

  const response = await fetch(storesUrl);
  if (!response.ok) throw new Error(`Failed to load stores: ${response.status}`);

  const data = (await response.json()) as BuilderStoresResponse;
  const stores = (data.results ?? []).map(normalizeStore).filter((s): s is Store => Boolean(s));

  return stores;
}

export function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStores()
      .then(setStores)
      .catch((err) => {
        console.error(err);
        setError("Failed to load stores");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="stores-page" aria-labelledby="stores-title">
        <div className="stores-page-inner">
          <div className="stores-header">
            <h1 id="stores-title" className="stores-title">
              Find a Store
            </h1>
          </div>
          <div className="stores-loading">Loading stores...</div>
        </div>
      </main>
    );
  }

  if (error || stores.length === 0) {
    return (
      <main className="stores-page" aria-labelledby="stores-title">
        <div className="stores-page-inner">
          <div className="stores-header">
            <h1 id="stores-title" className="stores-title">
              Find a Store
            </h1>
          </div>
          <div className="stores-empty">{error ? error : "No stores available"}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="stores-page" aria-labelledby="stores-title">
      <div className="stores-page-inner">
        <div className="stores-header">
          <h1 id="stores-title" className="stores-title">
            Find a Store
          </h1>
          <p className="stores-subtitle">Visit one of our locations near you</p>
        </div>
        <div className="stores-grid">
          {stores.map((store) => (
            <StoreCard key={store.title} {...store} />
          ))}
        </div>
      </div>
    </main>
  );
}
