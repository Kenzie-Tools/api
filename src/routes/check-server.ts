import { Client } from "discord.js";
import { Hono } from "hono";

export default async function (app: Hono, client: Client) {
    app.get("/check-server/:id", async (c) => {
        const { id } = c.req.param()

        const guild = await client.guilds.fetch(id)

        if (!guild) {
            c.status(404)
            return c.json({ error: "Guild not found" })
        }

        return c.json({ success: true })
    });
}