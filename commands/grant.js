import { SlashCommandBuilder } from "@discordjs/builders";
import { GrantEvent } from "../utils/LogEvent.js";
import { write_db } from "../utils/WriteDB.js";

export const data = new SlashCommandBuilder()
    .setName("grant")
    .setDescription("Grants a user the totems they have requested.")
    .addUserOption(option =>
		option.setName("user")
			.setDescription("The user to grant totems to")
			.setRequired(true));

export const execute = async interaction => {

    let { username, discriminator, id } = interaction.user;

    const granter = `${username}#${discriminator}`;

    ({ username, discriminator, id } = interaction.options.getUser("user"));

    const { commission } = interaction.client.price.value;

    const granted = parseInt(interaction.client.database[`${username}#${discriminator}`].requested_totems);

    if (!interaction.member.roles.cache.some(role => role.name === 'Supplier')) {
        await interaction.reply("You do not have access to that command!");
        interaction.client.database[granter].history.push(new GrantEvent(
            `${username}#${discriminator}`,
            false,
            granter,
            granted,
            0,
            parseInt(interaction.client.database[`${username}#${discriminator}`].debt),
        ).getGranter());
        write_db(interaction.client.database, interaction.client.database_location);
        return;
    }

    interaction.client.database[`${username}#${discriminator}`].requested_totems = 0;

    const grantEvent = new GrantEvent(
        `${username}#${discriminator}`,
        true,
        granter,
        granted,
        granted * commission,
        parseInt(interaction.client.database[`${username}#${discriminator}`].debt),
    );

    const old_debt = parseInt(interaction.client.database[`${username}#${discriminator}`].debt); 
    interaction.client.database[`${username}#${discriminator}`].debt = old_debt + granted * commission;

    interaction.client.database[`${username}#${discriminator}`].history.push(grantEvent.getGrantee());
    interaction.client.database[granter].history.push(grantEvent.getGranter());

    write_db(interaction.client.database, interaction.client.database_location);

    await interaction.reply(`Granted ${granted} totems to <@${id}>.`);
}
