import { SlashCommandBuilder } from "@discordjs/builders";
import { write_db } from "../utils/WriteDB.js";

export const data = new SlashCommandBuilder()
    .setName("check")
    .setDescription("Checks a user.")
    .addUserOption(option =>
		option.setName("user")
			.setDescription("The user to check")
			.setRequired(true));

export const execute = async interaction => {

    if (!interaction.member.roles.cache.some(role => role.name === 'Supplier')) {
        await interaction.reply("You do not have access to that command!");
        return;
    }

    const { username, discriminator } = interaction.options.getUser("user");

    const { linked_username, requested_totems, debt } = interaction.client.database[`${username}#${discriminator}`];

    await interaction.reply({ 
        content: `User ${username}#${discriminator} => ${linked_username}:
        Requested Totems: ${requested_totems}
        Debt: ${debt}`, 
        ephemeral: true 
    });
}
