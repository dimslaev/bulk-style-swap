import React from "react";
import "figma-plugin-ds/dist/figma-plugin-ds.css";
import "./App.css";
import { PluginMessageAction } from "../plugin-src/types";
import { RadioInput } from "./RadioInput";

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
    React.useState<StyleType>("PAINT");

  const onStyleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStyleType(event.target.value as StyleType);
  };

  const postMessage = (type: StyleType, action: PluginMessageAction) => {
    parent.postMessage(
      {
        pluginMessage: { type, action },
      },
      "*"
    );
  };

  React.useEffect(() => {
    window.onmessage = (e) => {
      if (!inputRef.current) return;
      if (e.data.pluginMessage.type === "result") {
        inputRef.current.value = e.data.pluginMessage.value;
      }
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

      <div className="actions">
        <button
          className="button button--secondary"
          onClick={() => {
            postMessage(selectedStyleType, "get");
          }}
        >
          Get styles from page / selection
        </button>

        <button
          className="button button--primary"
          onClick={() => {
            postMessage(selectedStyleType, "swap");
          }}
        >
          Swap styles on page / selection
        </button>
      </div>
    </div>
  );
}

export default App;
