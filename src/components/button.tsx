type IProps = {
  label: string;
  disabled?: boolean;
  minWidth?: number;
  color?: "primary" | "secondary" | "warning";
  onClick: () => void;
};

function Button({ label, disabled, minWidth, color, onClick }: IProps) {
  function handleOnClick() {
    onClick && onClick();
  }

  return (
    <button
      disabled={disabled}
      className={`btn btn-${color}`}
      type="button"
      style={{ minWidth: minWidth }}
      onClick={handleOnClick}
    >
      {label}
    </button>
  );
}

export default Button;
