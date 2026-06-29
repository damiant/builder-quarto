type LargeStaticCardProps = {
  image: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaLink: string;
};

export function LargeStaticCard({ image, title, text, ctaLabel, ctaLink }: LargeStaticCardProps) {
  return (
    <article className="static-business-card">
      {image ? (
        <img loading="lazy" alt={title} src={image} className="static-business-image" />
      ) : null}
      <div className="static-business-content">
        <h3 className="static-feature-title">{title}</h3>
        <p className="static-feature-text">{text}</p>
        {ctaLabel ? (
          <a className="static-button" href={ctaLink}>
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}
