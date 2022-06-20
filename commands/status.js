import { SlashCommandBuilder } from "@discordjs/builders";
import { write_db } from "../utils/WriteDB.js";

export const data = new SlashCommandBuilder()
    .setName("status")
    .setDescription("Displays your status.")

export const execute = async interaction => {

    const { username, discriminator, id } = interaction.user;

    const { linked_username, requested_totems, debt } = interaction.client.database[`${username}#${discriminator}`];

    await interaction.reply({ 
        content: `User <@${id}> => ${linked_username}:
        Requested Totems: ${requested_totems}
        Debt: ${debt}`, 
        ephemeral: true 
    });
}
