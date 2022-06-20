import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName("unlink")
    .setDescription("Unlinks your Minecraft account on the server.")

export const execute = async interaction => {
    console.log(interaction);

    const { username, discriminator } = interaction.user;

    interaction.client.database[`${username}#${discriminator}`].linked_username = null;
    write_db(interaction.client.database, interaction.client.database_location);

    await interaction.reply(`Linked Discord user @${username}#${discriminator} with ${mc_username}.`);
}
