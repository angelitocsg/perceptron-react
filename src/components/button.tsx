import { useEffect, useRef, useState } from "react";

type TColors =
  | "primary"
  | "secondary"
  | "warning"
  | "bg-dark-subtle"
  | "link";

type IProps = {
  label: string;
  disabled?: boolean;
  minWidth?: number;
  color?: TColors;
  onClick: () => void;
};

function Button({ label, disabled, minWidth, color, onClick }: IProps) {
  const [cssBg, setCssBg] = useState("primary");

  function handleOnClick() {
    onClick && onClick();
  }

  const btnBackground = useRef(color);
  useEffect(() => {
    const custom = btnBackground.current?.indexOf("bg-") ?? -1;
    if (custom > -1) setCssBg(color ?? "primary");
    else setCssBg(`btn-${color}`);
  }, [color]);

  return (
    <button
      disabled={disabled}
      className={`btn ${cssBg}`}
      type="button"
      style={{ minWidth: minWidth }}
      onClick={handleOnClick}
    >
      {label}
    </button>
  );
}

export default Button;
