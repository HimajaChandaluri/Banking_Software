import "../../App.css";

const Select = (props) => {
  return (
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}</label>
      <select
        className="form-control form-element"
        name={props.name}
        id={props.name}
        onChange={props.onChange}
        value={props.value}
      >
        <option value="" />
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {props.error && <div className="alert alert-danger">{props.error}</div>}
    </div>
  );
};

export default Select;
