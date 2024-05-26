import { ApplicationCommand, Client, REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { ChatInput, CommandAddon } from "../types/discord";
import { Express } from "express";

export default async function (app: Express, client: Client) {
    app.post("/register-command/:id", async (req, res) => {
        const { id } = req.params;

        const { command, game } = await req.body as { command: string; game: string }

        const guild = await client.guilds.fetch(id);

        if(!guild) {
            res.status(404);
            return res.json({ error: "Guild not found" });
        }

        const commandsFolder = readdirSync(`src/interactions/${game}`).filter((file) => file.endsWith(".ts"));

        if(!commandsFolder || commandsFolder.length === 0) {
            res.status(404);
            return res.json({ error: "No commands found" });
        }

        const commandBody = commandsFolder.find((file) => file === `${command}.ts`);

        if(!commandBody) {
            res.status(404);
            return res.json({ error: "Command not found" });
        }
        
        const cmd = (await import(`../interactions/${game}/${command}`)).default as CommandAddon;
        const indexCmd = (await import(`../interactions/${game}/index`)).default as ChatInput;

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN as string);

        let oldCommand = (await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID as string, id)
        ) as ApplicationCommand[]).find((cmd) => cmd.name === game);

        indexCmd.options = [...oldCommand?.options || [], cmd.option];

        const body = {
            name: indexCmd.name,
            description: indexCmd.description,
            options: indexCmd.options
        }

        await rest.post(
            Routes.applicationGuildCommands(process.env.CLIENT_ID as string, id),
            { body: body }
        ).catch((err) => {
            console.log(err)
            console.log(err.requestBody)
        });
    });
}