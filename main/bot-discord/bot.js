require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// CONFIGURACIÓN: Cambia esto por el nombre exacto de tu ROL
const NOMBRE_ROL_VERIFICADO = process.env.NOMBRE_ROL_VERIFICADO;

client.on('ready', () => {
    console.log(`✅ Bot EduConnect encendido como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    // Ignorar si es un bot o si no es un mensaje privado (DM) para mayor privacidad
    if (message.author.bot) return;

    // Lógica de verificación
    if (message.content.includes('@')) {
        const email = message.content.trim().toLowerCase();

        if (email.endsWith('@inspedralbes.cat')) {
            // Buscamos al usuario en el servidor
            const guild = client.guilds.cache.first(); // Asume que el bot está en 1 solo server
            const member = await guild.members.fetch(message.author.id);
            const role = guild.roles.cache.find(r => r.name === NOMBRE_ROL_VERIFICADO);

            if (role) {
                await member.roles.add(role);
                message.reply(`¡Perfecto! Tu correo **${email}** es válido. Ya tienes el rol **${NOMBRE_ROL_VERIFICADO}**.`);
            } else {
                message.reply("Error: No encuentro el rol en el servidor. Avisa a un admin.");
            }
        } else {
            message.reply("❌ Lo siento, solo se permiten correos de **@inspedralbes.cat**.");
        }
    }
});

client.login(process.env.DISCORD_TOKEN);