type ContentHeaderProps = {
  title: string;
  text: string;
  titleId?: string;
};

export const contentHeaderBuilderConfig = {
  name: "Content Header",
  inputs: [
    { name: "title", type: "text", defaultValue: "Our commitment to privacy" },
    {
      name: "text",
      type: "longText",
      defaultValue:
        "We ground our privacy commitments in strong data governance practices, so you can trust that we'll protect the privacy and confidentiality of your data and will only use it in a way that's consistent with the reasons you provided it.",
    },
  ],
};

export function ContentHeader({ title, text, titleId }: ContentHeaderProps) {
  return (
    <div className="static-heading-block">
      <h2 id={titleId} className="static-section-title">
        {title}
      </h2>
      <p className="static-section-description">{text}</p>
    </div>
  );
}
