import { APIApplicationCommandInteractionDataSubcommandOption, ApplicationCommandOption } from "discord.js"
import { CommandAddon } from "../../types/discord"

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
    },
    run: async (interaction) => {
        const user = interaction.options.getString("user", true)
        
    }
} satisfies CommandAddon