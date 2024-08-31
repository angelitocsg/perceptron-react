import "./switch.css";

type IProps = {
  name: string;
  checked: boolean;
  onChange: () => void;
};

function Switch({ name, checked, onChange }: IProps) {
  function handleChange() {
    onChange && onChange();
  }
  return (
    <div className="d-flex flex-column align-items-center">
      <label className="switch">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleChange}
        />
        <span className="slider round"></span>
      </label>
      <div>{checked ? 1 : 0}</div>
    </div>
  );
}

export default Switch;
