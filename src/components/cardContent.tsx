type IProps = {
  children: any;
  color?: string;
  maxWidth?: number;
};

function CardContent({ children, color = "light", maxWidth }: IProps) {
  return (
    <div className={`card mb-4 bg-${color}`} style={{ maxWidth: maxWidth }}>
      <div className="card-body">
        <div className="card-text">{children}</div>
      </div>
    </div>
  );
}

export default CardContent;
