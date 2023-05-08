import React from "react";
import "figma-plugin-ds/dist/figma-plugin-ds.css";
import "./App.css";
import { PluginMessageAction } from "../plugin-src/types";
import { RadioInput } from "./RadioInput";
import * as mixpanel from "mixpanel-figma";

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

  const pro = false; // For now all users are pro

  const [selectedStyleType, setSelectedStyleType] =
    React.useState<StyleType>("PAINT");

  const onStyleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStyleType(event.target.value as StyleType);
  };

  const postMessage = (
    pro: boolean,
    action: PluginMessageAction,
    type?: StyleType,
    value?: string
  ) => {
    parent.postMessage(
      {
        pluginMessage: { pro, action, type, value },
      },
      "*"
    );
  };

  React.useEffect(() => {
    mixpanel.init("1f41c90b6061fd7cef3ad6cd7ced17b0", {
      debug: true,
    });

    postMessage(pro, "getUser");
  }, []);

  React.useEffect(() => {
    window.onmessage = (e) => {
      if (!inputRef.current) return;
      const { type, value } = e.data.pluginMessage;
      if (type === "result") {
        inputRef.current.value = value;
      }
      if (type === "user") {
        mixpanel.identify(value);
      }
      if (type === "needsPro") {
        mixpanel.track("needsPro");
      }
      if (type === "usage") {
        mixpanel.track("usage");
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
            postMessage(pro, "getStyles", selectedStyleType);
          }}
        >
          Get styles from page / selection
        </button>

        <button
          className="button button--primary"
          onClick={() => {
            postMessage(
              pro,
              "swapStyles",
              selectedStyleType,
              inputRef.current?.value
            );
          }}
        >
          Swap styles on page / selection
        </button>
      </div>
    </div>
  );
}

export default App;
