type PageHeroProps = {
  title: string;
  text: string;
  image: string;
};

export function PageHero({ title, text, image }: PageHeroProps) {
  return (
    <section className="privacy-hero" aria-labelledby="test-page-title">
      <div className="privacy-section-inner">
        <div className="privacy-heading-block">
          <h1 id="test-page-title" className="privacy-hero-title">
            {title}
          </h1>
          <p className="privacy-hero-subtitle">{text}</p>
        </div>
        {image ? (
          <img
            loading="lazy"
            alt="A collage of graphical user interface elements, including message bubbles, notification panels, and app screens."
            src={image}
            className="privacy-hero-image"
          />
        ) : null}
      </div>
    </section>
  );
}
