import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName("price")
    .setDescription("Displays the current price and revenue split.");

export const execute = async interaction => {
    const { commission } = interaction.client.price.value;
    await interaction.reply(`The current commission is ${commission}.`);
}
