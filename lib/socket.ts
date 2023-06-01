import { io } from "socket.io-client";

export const socket = io(import.meta.env.URL ?? "http://172.30.1.55:3000");
