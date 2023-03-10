export const debug = (...msg: any) => {
  // @ts-ignore
  if (process.env.NODE_ENV === "development") {
    console.log(...msg);
  }
};

export const getParsedValue = (value: any) => {
  if (!value || typeof value !== "string") return;
  try {
    return JSON.parse(value);
  } catch (err) {}
};
