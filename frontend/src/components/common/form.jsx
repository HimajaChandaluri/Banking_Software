import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./Input";
class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const result = Joi.validate(this.state.data, this.schema, {
      abortEarly: false,
    });
    debugger;
    if (!result.error) {
      if (!this.state.errors.confirmPassword) {
        return null;
      } else {
        return this.state.errors;
      }
    }
    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = (input) => {
    const obj = { [input.name]: input.value };

    const schema = { [input.name]: this.schema[input.name] };
    console.log("schema: ", schema);
    const { error } = Joi.validate(obj, schema);
    return error
      ? input.name === "dateOfBirth"
        ? "dateOfBirth should be of format mm/dd/yyyy"
        : error.details[0].message
      : null;
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

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
    this.setState({ data });
    if (e.currentTarget.value !== this.state.data.password) {
      errors[e.currentTarget.name] = "passwords do not match";
      this.setState({ errors });
    } else {
      errors[e.currentTarget.name] = undefined;
      this.setState({ errors });
    }
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
}
export default Form;
