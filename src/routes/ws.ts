import { Client } from 'discord.js';
import { Application } from "express-ws";

export default async function (app: Application, client: Client) {
    app.ws("/ws", (ws, req) => {
        ws.on("message", (msg: unknown) => {
            ws.send(msg)
        })
    })
}