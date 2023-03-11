import React from "react";

export function RadioInput({
  name,
  value,
  defaultValue,
  label,
  onChange,
}: {
  name: string;
  value: string;
  defaultValue: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="radio">
      <input
        className="radio__button"
        type="radio"
        name={name}
        value={value}
        id={value}
        onChange={onChange}
        defaultChecked={value === defaultValue}
      />
      <label className="radio__label" htmlFor={value}>
        {label}
      </label>
    </div>
  );
}
