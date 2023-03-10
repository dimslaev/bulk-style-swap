import React from "react";
import "figma-plugin-ds/dist/figma-plugin-ds.css";
import "./App.css";
import { FigmaStyleType } from "../plugin-src/types";

function RadioInput({
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

const radioInputs = [
  {
    value: "PAINT",
    label: "Color styles",
  },
  {
    value: "TEXT",
    label: "Text styles",
  },
  {
    value: "EFFECT",
    label: "Effect styles",
  },
  {
    value: "GRID",
    label: "Grid styles",
  },
];

function App() {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const [selectedStyleType, setSelectedStyleType] =
    React.useState<FigmaStyleType>("PAINT");

  const onStyleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStyleType(event.target.value);
  };

  const onSubmit = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: selectedStyleType,
          value: inputRef.current?.value,
        },
      },
      "*"
    );
  };

  React.useEffect(() => {
    window.onmessage = (event) => {
      console.log(
        event.data.pluginMessage.type,
        event.data.pluginMessage.value
      );
    };
  }, []);

  return (
    <div className="container">
      <section className="section">
        <div className="type type--large type--bold">Which styles to swap</div>

        <div className="radio-group">
          {radioInputs.map((input) => (
            <RadioInput
              name="styleType"
              key={input.value}
              value={input.value}
              defaultValue={selectedStyleType}
              label={input.label}
              onChange={onStyleTypeChange}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="type type--large type--bold">Your style map (JSON)</div>

        <textarea
          className="textarea type--xlarge"
          rows={9}
          ref={inputRef}
          defaultValue={JSON.stringify(
            { "old-style-name": "new-style-name" },
            null,
            2
          )}
        ></textarea>
      </section>

      <button className="button button--primary" onClick={onSubmit}>
        Swap styles
      </button>
    </div>
  );
}

export default App;
