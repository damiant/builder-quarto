type PrivacyCard = {
  image: string;
  title: string;
  text: string;
};

type PrivacyCardGridProps = {
  cards: PrivacyCard[];
};

export function PrivacyCardGrid({ cards }: PrivacyCardGridProps) {
  return (
    <div className="privacy-card-grid privacy-card-grid-four">
      {cards.map((card) => (
        <article className="privacy-card" key={card.title}>
          {card.image ? (
            <img loading="lazy" alt={card.title} src={card.image} className="privacy-card-image" />
          ) : null}
          <div className="privacy-card-body">
            <h3 className="privacy-card-title">{card.title}</h3>
            <p className="privacy-card-text">{card.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
