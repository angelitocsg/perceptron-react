type IProps = {
  group?: string;
  children: any;
};

function ButtonGroup({ group = "btn", children }: IProps) {
  return (
    <div className={`${group}-group justify-content-center`} role="group">
      {children}
    </div>
  );
}

export default ButtonGroup;
