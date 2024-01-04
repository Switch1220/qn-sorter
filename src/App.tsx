import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/lib/useLocalStorage";

import * as R from "remeda";

import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";

import "@src/styles/globals.css";
import { Switch } from "@/components/ui/Switch";

const parseText = (text: string) =>
  text
    .split(" ")
    .flatMap((s) => s.split(","))
    .flatMap((s) => s.split("\n"))
    .map((s) => s.replace(/^\D+/g, ""))
    .map((s) => Number(s))
    // filter only numbers
    .filter((s) => !isNaN(s))
    .filter((s) => s !== 0);

const useCursor = () =>
  useLocalStorage("cursor", 0, {
    encode: (value) => value.toString(),
    decode: (raw) => parseInt(raw),
  });
const useQns = () =>
  useLocalStorage("qns", [] as Array<number>, {
    encode: (value) => JSON.stringify(value),
    decode: (raw) => JSON.parse(raw),
  });
const useMode = () => useLocalStorage("auto-mode", true);

function App() {
  const [cursor, setCursor] = useCursor();
  const [qns, setQns] = useQns();
  const [text, setText] = useState("");
  const [isModeActive, setIsModeActive] = useMode();

  const canMoveNext = useMemo(() => cursor < qns.length - 1, [cursor, qns]);
  const canMovePrev = useMemo(() => cursor > 0, [cursor]);

  const clearQns = () => setQns([]);
  const clearCursor = () => setCursor(0);
  const clearText = () => setText("");

  useEffect(() => {
    if (isModeActive === false) {
      window.onfocus = null;
      return;
    } else {
      window.onfocus = () => {
        setCursor((prev) => {
          return Math.min(prev + 1, qns.length === 0 ? 0 : qns.length - 1);
        });
      };
    }
  }, [isModeActive]);

  const onAdd: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    setQns((old) =>
      R.pipe(
        parseText(text),

        R.concat(old),
        R.uniq(),
        R.sort((a, b) => a - b)
      )
    );
    clearText();
  };

  const onClear: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    clearQns();
    clearCursor();
  };

  const onTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setText(e.target.value);
  };

  const onPrev: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (canMovePrev) {
      setCursor((prevCursor) => Math.max(prevCursor - 1, 0));
    }
  };

  const onNext: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (canMoveNext) {
      setCursor((prevCursor) =>
        Math.min(prevCursor + 1, qns.length === 0 ? 0 : qns.length - 1)
      );
    }
  };

  const onCheckedChange = (checked: boolean) => {
    setIsModeActive(checked);
  };

  return (
    <div className="h-screen flex flex-col items-center lg:justify-center bg-background">
      <main className="m-10 flex flex-col lg:flex-row justify-between gap-20 w-4/5 lg:w-2/3">
        {qns.length === 0 ? (
          <div className="lg:w-5/12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
              문제번호를 추가하세요
            </h1>
          </div>
        ) : (
          <div className="flex flex-col items-center lg:items-start lg:w-5/12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
              Up Next
            </h1>

            <Nav cursor={cursor} qns={qns} />

            <div className="mt-4">
              {qns.map((qn, i) => (i !== qns.length - 1 ? qn + ", " : qn))}
            </div>

            <div className="mt-5 mr-auto flex flex-row gap-1">
              <Button onClick={onPrev} disabled={!canMovePrev}>
                Prev
              </Button>
              <Button onClick={onNext} disabled={!canMoveNext}>
                Next
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:w-5/12">
          <Progress value={(cursor / (qns.length - 1)) * 100} />

          {/* <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Enter question numbers
          </h2> */}
          <Textarea
            className="mt-2 h-2/5"
            placeholder="Enter copied kakaotalk chat or numbers."
            onChange={onTextChange}
            value={text}
          />
          <Button className="mt-3" onClick={onAdd}>
            Add
          </Button>

          <Button className="mt-2" onClick={onClear}>
            Clear
          </Button>

          <div className="mt-4 flex items-center space-x-2">
            <Switch
              id="auto-increase"
              checked={isModeActive}
              onCheckedChange={onCheckedChange}
            />
            <label htmlFor="auto-increase">Auto increase</label>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

function Nav({ cursor, qns }: { cursor: number; qns: number[] }) {
  const prev: number | null = useMemo(() => {
    const prevIndex = cursor - 1;
    return prevIndex >= 0 && prevIndex < qns.length ? qns[prevIndex] : null;
  }, [cursor, qns]);

  const next: number | null = useMemo(() => {
    const nextIndex = cursor + 1;
    return nextIndex >= 0 && nextIndex < qns.length ? qns[nextIndex] : null;
  }, [cursor, qns]);

  const current: number | null = useMemo(() => {
    return cursor >= 0 && cursor < qns.length ? qns[cursor] : null;
  }, [cursor, qns]);

  return (
    <section className="grid grid-cols-5 place-items-center mt-4 backdrop-blur-md bg-black/10 px-8 py-5 rounded-full w-full">
      <p className="text-2xl text-primary text-opacity-80 tracking-tight transition-colors">
        {prev}
      </p>
      {prev === null ? (
        <div />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-right"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      )}
      <p className="text-5xl font-black tracking-tight transition-colors">
        {current ?? <div />}
      </p>
      {next === null ? (
        <div />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-right"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      )}
      <p className="text-2xl tracking-tight transition-colors">{next}</p>
    </section>
  );
}
