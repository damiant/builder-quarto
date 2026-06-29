export type Store = {
  title: string;
  address: string;
  phone?: string;
  hours?: string;
  image?: string;
  state?: string;
  country?: string;
};

export function getStoreSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function StoreCard({ title, address, phone, hours, image, state, country }: Store) {
  const location = [address, state, country].filter(Boolean).join(", ");
  const storeSlug = getStoreSlug(title);

  return (
    <article className="store-card">
      <a className="store-card-link" href={`/stores/${storeSlug}`} aria-label={`View ${title}`}>
        {image ? (
          <img className="store-card-image" src={image} alt={title} loading="lazy" />
        ) : (
          <div className="store-card-image store-card-image-placeholder" aria-hidden="true">
            <span className="store-card-image-initial">{title.charAt(0)}</span>
          </div>
        )}
        <div className="store-card-details">
          <h3 className="store-card-title">{title}</h3>
          <p className="store-card-location">{location}</p>
          {phone && <p className="store-card-phone">{phone}</p>}
          {hours && <p className="store-card-hours">{hours}</p>}
        </div>
      </a>
    </article>
  );
}
