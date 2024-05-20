import { APIApplicationCommandInteractionDataSubcommandOption, ApplicationCommandOption } from "discord.js"

export default {
    option: {
        type: 1,
        name: "ban",
        description: "Ban a user from the server",
        options: [
            {
                type: 3,
                name: "user",
                description: "The user to ban, by name or Steam64ID",
                required: true
            }
        ]
    }
} as {
    option: ApplicationCommandOption
}