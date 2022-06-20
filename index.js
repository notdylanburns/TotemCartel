import { Client, Collection, Intents } from "discord.js";
import env from "./env.json" assert { type: "json" };

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { CachedValue } from "./utils/CachedValue.js";
import { write_db } from "./utils/WriteDB.js";
import { NewEmployee } from "./utils/Employee.js";

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });

client.database_location = path.join(path.dirname(fileURLToPath(import.meta.url)), "data/employees.json");
client.database = JSON.parse(fs.readFileSync(client.database_location, "utf-8"));

client.price = new CachedValue(60, () => JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "data/price.json")), "utf-8"));

client.commands = new Collection();
const commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once("ready", () => {
	console.log("Ready!");
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
	}
});

client.on("guildMemberAdd", member => {
    const { username, discriminator } = member.user;
    client.database[`${username}#${discriminator}`] = NewEmployee();
    write_db(client.database, client.database_location);
});

// Login to Discord with your client"s token
client.login(env.token);