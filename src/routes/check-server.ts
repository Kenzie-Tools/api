import { Client } from "discord.js";
import { Express } from "express";

export default async function (app: Express, client: Client) {
    app.get("/check-server/:id", async (req, res) => {
        const { id } = req.params

        const guild = await client.guilds.fetch(id)

        if (!guild) {
            res.status(404)
            return res.json({ error: "Guild not found" })
        }

        return res.json({ success: true })
    });
}