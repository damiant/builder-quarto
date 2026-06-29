import { useEffect, useState } from "react";
import { BUILDER_PUBLIC_API_KEY } from "../builder-page.ts";
import { type Store } from "./StoreCard.tsx";
import { getStoreSlug } from "./StoreCard.tsx";

type BuilderStoreContent = {
  data?: Partial<Store>;
};

type BuilderStoresResponse = {
  results?: BuilderStoreContent[];
};

async function fetchAllStores(): Promise<Store[]> {
  const storesUrl = new URL("https://cdn.builder.io/api/v3/content/stores");
  storesUrl.searchParams.set("apiKey", BUILDER_PUBLIC_API_KEY);
  storesUrl.searchParams.set("limit", "100");
  storesUrl.searchParams.set(
    "fields",
    "data.title,data.address,data.phone,data.hours,data.image,data.state,data.country",
  );

  const response = await fetch(storesUrl);
  if (!response.ok) throw new Error(`Failed to load stores: ${response.status}`);

  const data = (await response.json()) as BuilderStoresResponse;
  const stores = (data.results ?? [])
    .map((content): Store | null => {
      const { title, address } = content.data ?? {};
      if (!title || !address) return null;
      return {
        title,
        address,
        phone: content.data?.phone,
        hours: content.data?.hours,
        image: content.data?.image,
        state: content.data?.state,
        country: content.data?.country,
      };
    })
    .filter((s): s is Store => s !== null);

  return stores;
}

function StoreNotFound({ storeSlug }: { storeSlug: string }) {
  return (
    <main className="store-detail-page store-detail-status" aria-labelledby="store-detail-title">
      <p className="store-detail-status-eyebrow">Store not found</p>
      <h1 id="store-detail-title" className="store-detail-status-title">
        No store found for {storeSlug}
      </h1>
      <a href="/stores" className="store-detail-back-link">
        Back to all stores
      </a>
    </main>
  );
}

function StoreDetailError() {
  return (
    <main className="store-detail-page store-detail-status" aria-labelledby="store-detail-title">
      <p className="store-detail-status-eyebrow">Store page</p>
      <h1 id="store-detail-title" className="store-detail-status-title">
        This store could not be loaded right now.
      </h1>
      <a href="/stores" className="store-detail-back-link">
        Back to all stores
      </a>
    </main>
  );
}

export function StoreDetailPage({ storeSlug }: { storeSlug: string }) {
  const [store, setStore] = useState<Store | null | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAllStores()
      .then((stores) => {
        const found = stores.find((s) => getStoreSlug(s.title) === storeSlug);
        setStore(found ?? null);
        if (found) {
          document.title = found.title;
        }
      })
      .catch(() => setError(true));
  }, [storeSlug]);

  if (error) return <StoreDetailError />;
  if (store === undefined) return null;
  if (store === null) return <StoreNotFound storeSlug={storeSlug} />;

  return (
    <main className="store-detail-page" aria-labelledby="store-detail-title">
      <div className="store-detail-inner">
        <a href="/stores" className="store-detail-back-link">
          ← Back to all stores
        </a>

        <div className="store-detail-header">
          {store.image && (
            <img
              className="store-detail-image"
              src={store.image}
              alt={store.title}
              loading="lazy"
            />
          )}
          <div className="store-detail-content">
            <h1 id="store-detail-title" className="store-detail-title">
              {store.title}
            </h1>

            <div className="store-detail-section">
              <h2 className="store-detail-section-title">Location</h2>
              <p className="store-detail-text">{store.address}</p>
              {store.state && <p className="store-detail-text">{store.state}</p>}
              {store.country && <p className="store-detail-text">{store.country}</p>}
            </div>

            {store.phone && (
              <div className="store-detail-section">
                <h2 className="store-detail-section-title">Phone</h2>
                <a href={`tel:${store.phone}`} className="store-detail-link">
                  {store.phone}
                </a>
              </div>
            )}

            {store.hours && (
              <div className="store-detail-section">
                <h2 className="store-detail-section-title">Hours</h2>
                <p className="store-detail-text">{store.hours}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
