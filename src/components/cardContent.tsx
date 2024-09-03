type IProps = {
  children: any;
  color?: string;
  maxWidth?: number;
  padding?: number | string;
};

function CardContent({ children, color = "light", maxWidth, padding }: IProps) {
  return (
    <div
      className={`card mb-4 bg-${color} ${color !== "light" ? "text-light-emphasis" : ""}`}
      style={{ maxWidth }}>
      <div className="card-body" style={{ padding }}>
        <div className="card-text">{children}</div>
      </div>
    </div>
  );
}

export default CardContent;
