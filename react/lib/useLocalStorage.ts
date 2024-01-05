import { useEffect, useState } from "react";

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
  fn?: { encode: (value: T) => string; decode: (raw: string) => T }
) => {
  const { encode, decode } = fn ?? {
    encode: (value) => JSON.stringify(value),
    decode: (raw) => JSON.parse(raw),
  };

  const [value, setValue] = useState<T>(() =>
    key in localStorage ? decode(localStorage.getItem(key)!) : defaultValue
  );

  useEffect(() => {
    // storing input
    localStorage.setItem(key, encode(value));
  }, [key, value]);

  return [value, setValue] as const;
};
