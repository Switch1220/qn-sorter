import { io } from "socket.io-client";

export const socket = io(
  import.meta.env.DEV ? "http://localhost:3000" : "https://qn-server.deno.dev",
);
