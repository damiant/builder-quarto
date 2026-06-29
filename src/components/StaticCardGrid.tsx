type StaticCard = {
  image: string;
  title: string;
  text: string;
};

type StaticCardGridProps = {
  cards: StaticCard[];
};

export const staticCardGridBuilderConfig = {
  name: "Static Card Grid",
  inputs: [
    {
      name: "cards",
      type: "list",
      defaultValue: [
        {
          title: "You control your information",
          text: "We give you the ability to control your data, along with clear and meaningful choices over how your data is used.",
          image:
            "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_01_CONTROL_NEW_2000x2000?wid=570&hei=570",
        },
        {
          title: "Your data is protected",
          text: "We rigorously protect your data using encryption and other security best practices.",
          image:
            "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSPrivacy_02_IMAGERY_PROTECTION_NEW_2000x2000?wid=570&hei=570",
        },
      ],
      subFields: [
        { name: "image", type: "file" },
        { name: "title", type: "text", defaultValue: "Card title" },
        { name: "text", type: "longText", defaultValue: "Card supporting text." },
      ],
    },
  ],
};

export function StaticCardGrid({ cards }: StaticCardGridProps) {
  return (
    <div className="static-card-grid static-card-grid-four">
      {cards.map((card) => (
        <article className="static-card" key={card.title}>
          {card.image ? (
            <img loading="lazy" alt={card.title} src={card.image} className="static-card-image" />
          ) : null}
          <div className="static-card-body">
            <h3 className="static-card-title">{card.title}</h3>
            <p className="static-card-text">{card.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
