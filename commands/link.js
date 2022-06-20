import { SlashCommandBuilder } from "@discordjs/builders";
import { LinkEvent } from "../utils/LogEvent.js";
import { write_db } from "../utils/WriteDB.js";

export const data = new SlashCommandBuilder()
    .setName("link")
    .setDescription("Links your Minecraft account on the server.")
    .addStringOption(option =>
		option.setName("username")
			.setDescription("Your Minecraft username")
			.setRequired(true));

export const execute = async interaction => {

    const { username, discriminator, id } = interaction.user;
    const mc_username = interaction.options.getString("username");

    interaction.client.database[`${username}#${discriminator}`].history.push(new LinkEvent(
        `${username}#${discriminator}`,
        interaction.client.database[`${username}#${discriminator}`].linked_username === null,
        interaction.client.database[`${username}#${discriminator}`].linked_username,
        mc_username,
    ).get())

    interaction.client.database[`${username}#${discriminator}`].linked_username = mc_username;

    write_db(interaction.client.database, interaction.client.database_location);

    await interaction.reply(`Linked Discord user <@${id}> with ${mc_username}.`);
}
