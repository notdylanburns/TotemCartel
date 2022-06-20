import { SlashCommandBuilder } from "@discordjs/builders";
import { ClaimEvent } from "../utils/LogEvent.js";
import { write_db } from "../utils/WriteDB.js";

export const data = new SlashCommandBuilder()
    .setName("claim")
    .setDescription("Claims debt from a user.")
    .addUserOption(option =>
		option.setName("user")
			.setDescription("The user to from which to claim")
			.setRequired(true))
    .addIntegerOption(option =>
        option.setName("amount")
            .setDescription("The amount of debt to reclaim")
            .setRequired(true));

export const execute = async interaction => {

    let { username, discriminator, id } = interaction.user;
    const claimer = `${username}#${discriminator}`;

    ({ username, discriminator, id } = interaction.options.getUser("user"));
    const amount = interaction.options.getInteger("amount");

    const old_debt = parseInt(interaction.client.database[`${username}#${discriminator}`].debt);

    if (!interaction.member.roles.cache.some(role => role.name === 'Supplier')) {
        await interaction.reply("You do not have access to that command!");
        interaction.client.database[granter].history.push(new ClaimEvent(
            `${username}#${discriminator}`,
            false,
            claimer,
            amount,
            old_debt,
        ).getGranter());
        write_db(interaction.client.database, interaction.client.database_location);
        return;
    }

    const claimEvent = new ClaimEvent(
        `${username}#${discriminator}`,
        false,
        claimer,
        amount,
        old_debt,
    );

    interaction.client.database[`${username}#${discriminator}`].debt = old_debt - amount;
    interaction.client.database[`${username}#${discriminator}`].history.push(claimEvent.getClaimee());
    interaction.client.database[claimer].history.push(claimEvent.getClaimer());

    write_db(interaction.client.database, interaction.client.database_location);

    await interaction.reply(`Claimed ${amount} of debt from <@${id}>.`);
}
