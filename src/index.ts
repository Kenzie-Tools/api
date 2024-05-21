import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { readdirSync } from 'fs'
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { Command } from "./types/discord";
import path from "path";
import checkServer from './routes/check-server';
import registerCommand from './routes/register-command';
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export const commands = new Map<string, Command>();

const eventFolders = readdirSync('src/events');
for (const folder of eventFolders) {
    switch (folder) {
        case "discord": {
            readdirSync(
                'src/events/discord',
            ).forEach((file) => {
                import(`./events/${folder}/${file}`).then((event) => {
                    event.default(client);
                });
            });
            break;
        }
        default: {
            readdirSync(
                `src/events/${folder}`,
            ).forEach((file) => {
                import(`./events/${folder}/${file}`).then((event) => {
                    event.default();
                });
            });
            break;
        }
    }
}

client.login(process.env.TOKEN);

const app = new Hono()

app.get('/', (c) => {
  return c.redirect('https://kenzie.wtf')
})

checkServer(app, client)
registerCommand(app, client)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
