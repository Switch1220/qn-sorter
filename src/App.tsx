import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

import { socket } from "@/lib/socket";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";

import "@src/styles/globals.css";

const sort = (nums: number[]) => nums.sort((a, b) => a - b);

function App() {
  const [cursor, setCursor] = useState(0);
  const [qns, setQns] = useState<number[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("initial-qns", (list) => {
      setQns(sort(list ?? []));
    });

    socket.on("initial-cursor", (at) => {
      setCursor(at);
    });

    socket.on("qn-update", (list) => {
      setQns(sort(list ?? []));
    });

    socket.on("qn-clear", () => {
      setQns([]);
      setCursor(0);
    });

    socket.on("qn-cursor", (at) => {
      setCursor(at);
    });

    return () => {
      socket.off("initial");
      socket.off("qn-change");
      socket.off("qn-clear");
    };
  }, []);

  const onSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    socket.emit(
      "update-req",
      text,
    );

    setText("");
  };

  const onClear: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    socket.emit("clear-req");
    socket.emit("cursor-req", 0);
  };

  const onTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setText(e.target.value);
  };

  const onPrev: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    socket.emit("cursor-req", cursor - 1);

    setCursor((prev) => prev - 1);
  };

  const onNext: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    socket.emit("cursor-req", cursor + 1);

    setCursor((prev) => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col items-center lg:justify-center bg-background">
      <main className="m-10 flex flex-col lg:flex-row justify-between gap-20 lg:w-2/3">
        <div className="flex flex-col lg:w-5/12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            Up Next
          </h1>
          <Nav
            cursor={cursor}
            qns={qns}
          />

          <div className="mt-4">
            {qns.map((qn, i) => i !== qns.length - 1 ? qn + ", " : qn)}
          </div>

          <div className="mt-5 flex flex-row gap-1">
            <Button
              onClick={onPrev}
              disabled={cursor === 0}
            >
              Prev
            </Button>
            <Button
              onClick={onNext}
              disabled={qns.length === 0 || cursor === qns.length - 1}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:w-5/12">
          <Progress value={cursor / (qns.length - 1) * 100} />

          {
            /* <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Enter question numbers
          </h2> */
          }
          <Textarea
            className="mt-2 h-2/5"
            placeholder="Enter copied kakaotalk chat or numbers."
            onChange={onTextChange}
            value={text}
          />
          <Button className="mt-3" onClick={onSubmit}>Submit</Button>

          <Button className="mt-2" onClick={onClear}>Clear</Button>
        </div>
      </main>
    </div>
  );
}

export default App;

function Nav(
  { cursor, qns }: { cursor: number; qns: number[] },
) {
  const prev = cursor === 0 ? null : qns[cursor - 1];
  const next = cursor === qns.length - 1 ? null : qns[cursor + 1];

  const current = qns[cursor];

  return (
    <section className="flex flex-row items-center mt-1">
      <p className="text-3xl text-primary text-opacity-80 tracking-tight transition-colors">
        {prev ?? (
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
            className="lucide lucide-circle-off opacity-10"
          >
            <path d="m2 2 20 20"></path>
            <path d="M8.4 2.7c1.2-.4 2.4-.7 3.7-.7 5.5 0 10 4.5 10 10 0 1.3-.2 2.5-.7 3.6">
            </path>
            <path d="M19.1 19.1C17.3 20.9 14.8 22 12 22 6.5 22 2 17.5 2 12c0-2.7 1.2-5.2 3-7">
            </path>
          </svg>
        )}
      </p>
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
      <p className="text-5xl font-normal tracking-tight transition-colors">
        {current ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <line x1="18" x2="6" y1="6" y2="18"></line>
            <line x1="6" x2="18" y1="6" y2="18"></line>
          </svg>
        )}
      </p>
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
      <p className="text-3xl tracking-tight transition-colors">
        {next ?? (
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
            className="lucide lucide-circle-off opacity-10"
          >
            <path d="m2 2 20 20"></path>
            <path d="M8.4 2.7c1.2-.4 2.4-.7 3.7-.7 5.5 0 10 4.5 10 10 0 1.3-.2 2.5-.7 3.6">
            </path>
            <path d="M19.1 19.1C17.3 20.9 14.8 22 12 22 6.5 22 2 17.5 2 12c0-2.7 1.2-5.2 3-7">
            </path>
          </svg>
        )}
      </p>
    </section>
  );
}
