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
    <label className="switch">
      <input type="checkbox" name={name} checked={checked} onChange={handleChange}/>
      <span className="slider round"></span>
    </label>
  );
}

export default Switch;
