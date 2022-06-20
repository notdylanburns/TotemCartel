import { SlashCommandBuilder } from "@discordjs/builders";
import { RequestEvent } from "../utils/LogEvent.js";
import { write_db } from "../utils/WriteDB.js";

export const data = new SlashCommandBuilder()
    .setName("request")
    .setDescription("Requests totems.")
    .addIntegerOption(option =>
		option.setName("number")
			.setDescription("The number of totems you wish to request")
			.setRequired(true));

export const execute = async interaction => {

    const { username, discriminator, id } = interaction.user;
    const totem_count = interaction.options.getInteger("number");

    const old_total = interaction.client.database[`${username}#${discriminator}`].requested_totems;

    if (interaction.client.database[`${username}#${discriminator}`].linked_username === null) {
        await interaction.reply("You must link an account first.");
        interaction.client.database[`${username}#${discriminator}`].history.push(new RequestEvent(
            `${username}#${discriminator}`,
            false,
            totem_count,
            old_total,
            old_total,
        ).get());
        write_db(interaction.client.database, interaction.client.database_location);
        return;
    }

    interaction.client.database[`${username}#${discriminator}`].requested_totems += totem_count;
    interaction.client.database[`${username}#${discriminator}`].history.push(new RequestEvent(
        `${username}#${discriminator}`,
        true,
        totem_count,
        old_total,
        interaction.client.database[`${username}#${discriminator}`].requested_totems,
    ).get())
    write_db(interaction.client.database, interaction.client.database_location);

    await interaction.reply(`<@${id}> has requested ${totem_count} totems.`);
}
