require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

// Lógica de validación por mensaje
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@inspedralbes\.cat$/;

    if (message.content.includes('@')) {
        if (emailRegex.test(message.content)) {
            message.reply("✅ Verificado. ¡Bienvenido a EduConnect!");
            // Aquí añadirías la lógica para dar el rol (que ya tienes configurada)
        } else {
            message.reply("❌ Error: Solo se permiten correos @inspedralbes.cat");
        }
    }
});

client.login(process.env.DISCORD_TOKEN);