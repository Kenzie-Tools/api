import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../../types/discord";

export default {
    name: "scpsl",
    role: "CHAT_INPUT",
    description: "Run commands based off of SCP:SL",
    options: [],
    run: async (interaction) => {
        const button = new ButtonBuilder()
            .setCustomId("blah")
            .setLabel("Blah")
            .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button);
        await interaction.reply({ content: "blah", components: [row] });
    },
} satisfies Command;