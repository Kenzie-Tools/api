import { Hono } from "hono";
import { Client, REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import path from "path";

export default async function (app: Hono, client: Client) {
    app.post("/register-command/:id", async (c) => {
        const { id } = c.req.param();

        const { command, game } = await c.req.json() as { command: string; game: string }

        const guild = await client.guilds.fetch(id);

        if(!guild) {
            c.status(404);
            return c.json({ error: "Guild not found" });
        }

        const commandsFolder = readdirSync(path.join(process.cwd(), `/src/interactions/${game}`)).filter((file) => file.endsWith(".ts"));

        if(!commandsFolder.find((file) => file === `${command}.ts`)) {
            c.status(404);
            return c.json({ error: "Command not found" });
        }

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN as string);

        const commandBody = JSON.parse(JSON.stringify((await import(`../interactions/${game}/${command}`)).default))
        delete commandBody.role;

        const commands = await rest.post(
            Routes.applicationGuildCommands(process.env.CLIENT_ID as string, id),
            { body: commandBody}
        );
    });
}