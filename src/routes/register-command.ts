import { Hono } from "hono";
import { ApplicationCommand, ApplicationCommandOption, Client, REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { ChatInput, Command, CommandAddon } from "../types/discord";

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

        if(!commandsFolder || commandsFolder.length === 0) {
            c.status(404);
            return c.json({ error: "No commands found" });
        }

        const commandBody = commandsFolder.find((file) => file === `${command}.ts`);

        if(!commandBody) {
            c.status(404);
            return c.json({ error: "Command not found" });
        }
        const cmd = (await import(path.join(process.cwd(), `/src/interactions/${game}/${command}`))).default as CommandAddon;
        const indexCmd = (await import(path.join(process.cwd(), `/src/interactions/${game}/index`))).default as ChatInput;

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN as string);

        let oldCommand = (await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID as string, id)
        ) as ApplicationCommand[]).find((cmd) => cmd.name === game);

        if(!oldCommand) {
            await rest.post(
                Routes.applicationGuildCommands(process.env.CLIENT_ID as string, id),
                { body: JSON.parse(JSON.stringify(indexCmd)) }
            )
            oldCommand = (await rest.get(
                Routes.applicationGuildCommands(process.env.CLIENT_ID as string, id)
            ) as ApplicationCommand[]).find((cmd) => cmd.name === game) as ApplicationCommand;
        }

        oldCommand.options = [...oldCommand?.options, cmd.option];

        await rest.post(
            Routes.applicationGuildCommands(process.env.CLIENT_ID as string, id),
            { body: commandBody}
        );
    });
}