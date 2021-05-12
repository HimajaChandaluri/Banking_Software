import React, { Component } from "react";
import Joi from "joi-browser";
import { isEmpty } from "lodash";
import Input from "./Input";
import Select from "./Select";
import "../../App.css";
import { format, add, subYears } from "date-fns";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const errors = { ...this.state.errors };

    const result = Joi.validate(this.state.data, this.schema, {
      abortEarly: false,
    });

    if (!result.error && !this.state.errors) return null;
    else {
      if (result?.error) {
        const validationErrors = {};
        for (let item of result.error.details)
          validationErrors[item.path[0]] = item.message;
        return { ...validationErrors, ...errors };
      }
      return errors;
    }
  };

  validateProperty = (input) => {
    const obj = { [input.name]: input.value };

    const schema = { [input.name]: this.schema[input.name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();

    this.setState({ errors: errors || {} });
    if (!isEmpty(errors)) return;

    this.doSubmit();
  };

  handleChange = (e) => {
    const errors = { ...this.state.errors };

    const errorMessage = this.validateProperty(e.currentTarget);
    if (errorMessage) errors[e.currentTarget.name] = errorMessage;
    else delete errors[e.currentTarget.name];

    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ data, errors });
  };

  handleConfirmPassword = (e) => {
    const data = { ...this.state.data };
    const errors = { ...this.state.errors };
    data[e.currentTarget.name] = e.currentTarget.value;

    if (e.currentTarget.value !== this.state.data.password)
      errors[e.currentTarget.name] = "passwords do not match";
    else delete errors[e.currentTarget.name];

    this.setState({ data, errors });
  };

  renderInput = (name, label, type) => {
    return (
      <Input
        name={name}
        label={label}
        value={this.state.data[name]}
        onChange={this.handleChange}
        error={this.state.errors[name]}
        type={type}
      />
    );
  };

  renderDateInput = (name, label, type) => {
    return (
      <Input
        name={name}
        label={label}
        value={this.state.data[name]}
        onChange={this.handleChange}
        error={this.state.errors[name]}
        type={type}
        min={format(
          add(new Date(), {
            days: 1,
          }),
          "yyyy-MM-dd"
        )}
      />
    );
  };

  renderDateOfBirthInput = (name, label, type) => {
    return (
      <Input
        name={name}
        label={label}
        value={this.state.data[name]}
        onChange={this.handleChange}
        error={this.state.errors[name]}
        type={type}
        max={format(subYears(new Date(), 18), "yyyy-MM-dd")}
      />
    );
  };

  renderSelect = (name, label, options) => {
    return (
      <Select
        name={name}
        label={label}
        options={options}
        onChange={this.handleChange}
        value={this.state.data[name]}
        error={this.state.errors[name]}
      />
    );
  };

  renderRadioOptions = (name, label, type, isDisabled, selected) => {
    return (
      <div className="form-check">
        <label
          className={`form-check-label ${isDisabled ? "disabled-label" : ""}`}
        >
          <input
            className="form-check-input"
            type={type}
            value={label}
            onChange={this.handleChange}
            name={name}
            disabled={isDisabled}
            checked={selected && label === selected}
          ></input>
          {label}
        </label>
      </div>
    );
  };

  renderButton = (label, onClick) => {
    return (
      <button
        disabled={!isEmpty(this.validate())}
        className="btn btn-custom "
        onClick={onClick}
      >
        {label}
      </button>
    );
  };
}
export default Form;
