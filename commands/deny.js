import { SlashCommandBuilder } from "@discordjs/builders";
import { DenyEvent } from "../utils/LogEvent.js";
import { write_db } from "../utils/WriteDB.js";

export const data = new SlashCommandBuilder()
    .setName("deny")
    .setDescription("Denies a user's request.")
    .addUserOption(option =>
		option.setName("user")
			.setDescription("The user to check")
			.setRequired(true));

export const execute = async interaction => {

    let { username, discriminator } = interaction.user;

    const granter = `${username}#${discriminator}`;

    ({ username, discriminator, id } = interaction.options.getUser("user"));

    if (!interaction.member.roles.cache.some(role => role.name === 'Supplier')) {
        await interaction.reply("You do not have access to that command!");
        interaction.client.database[granter].history.push(new DenyEvent(
            `${username}#${discriminator}`,
            false,
            granter,
            interaction.client.database[`${username}#${discriminator}`].requested_totems,
        ).getGranter());
        write_db(interaction.client.database, interaction.client.database_location);
        return;
    }

    const denyEvent = new DenyEvent(
        `${username}#${discriminator}`,
        true,
        granter,
        interaction.client.database[`${username}#${discriminator}`].requested_totems,
    );

    await interaction.reply(`Denied <@${id}>'s request for ${interaction.client.database[`${username}#${discriminator}`].requested_totems} totems.`);

    interaction.client.database[`${username}#${discriminator}`].requested_totems = 0;
    interaction.client.database[`${username}#${discriminator}`].history.push(denyEvent.getGrantee());
    interaction.client.database[granter].history.push(denyEvent.getGranter());

    write_db(interaction.client.database, interaction.client.database_location);
}
