import React from 'react';
import PropTypes from 'prop-types';
import '../commonFormControlStyles.scss';
import './TextInput.scss';

export default function TextInput({ label, id, onChange, defaultValue }) {
  return (
    <div className="text-input form-control-container">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        onChange={onChange}
        className="form-control"
        defaultValue={defaultValue}
      />
    </div>
  );
}

TextInput.defaultProps = {
  defaultValue: undefined,
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
};
