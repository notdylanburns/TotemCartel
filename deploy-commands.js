import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import env from "./env.json" assert { type: "json" };

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const commands = [];
const commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const exclude = ["unlink.js"]

for (const file of commandFiles.filter(file => !exclude.includes(file))) {
    console.log(file);
	const filePath = path.join(commandsPath, file);
	const command = await import(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(env.token);

rest.put(Routes.applicationGuildCommands(env.clientId, env.guildId), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);
