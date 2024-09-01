type IProps = {
  title: string;
  children: any;
};

function Widget({ title, children }: IProps) {
  return (
    <div className="d-flex flex-column align-items-center">
      <h2 className="mt-4">{title}</h2>
      {children}
    </div>
  );
}

export default Widget;
