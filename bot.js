const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const express = require('express');

// ───────────── WEB SERVER (Keeps Render happy) ─────────────
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('✅ Discord Bot is running!');
});

app.listen(PORT, () => {
    console.log(`🌐 Web server running on port ${PORT}`);
});

// ───────────── DISCORD BOT ─────────────
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

const TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

client.once('ready', async () => {
    await client.application.commands.set([
        {
            name: 'embed',
            description: 'Create and send a custom embed to any channel',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to send the embed to',
                    type: 7,
                    required: true
                }
            ]
        }
    ]);
    console.log('✅ /embed command ready!');
});

client.on('interactionCreate', async (interaction) => {
    // Handle /embed command
    if (interaction.isChatInputCommand() && interaction.commandName === 'embed') {
        const targetChannel = interaction.options.getChannel('channel');

        const modal = new ModalBuilder()
            .setCustomId(`embed_${targetChannel.id}`)
            .setTitle('📝 Create Custom Embed');

        const titleInput = new TextInputBuilder()
            .setCustomId('title')
            .setLabel('📌 Title')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const descInput = new TextInputBuilder()
            .setCustomId('description')
            .setLabel('📝 Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const colorInput = new TextInputBuilder()
            .setCustomId('color')
            .setLabel('🎨 Color (hex)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('#2b2d31')
            .setRequired(false);

        const footerInput = new TextInputBuilder()
            .setCustomId('footer')
            .setLabel('📎 Footer')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(descInput),
            new ActionRowBuilder().addComponents(colorInput),
            new ActionRowBuilder().addComponents(footerInput)
        );

        await interaction.showModal(modal);
    }
    
    // Handle modal submit
    if (interaction.isModalSubmit()) {
        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');
        const color = interaction.fields.getTextInputValue('color') || '#2b2d31';
        const footer = interaction.fields.getTextInputValue('footer');

        const channelId = interaction.customId.replace('embed_', '');
        const targetChannel = await client.channels.fetch(channelId);

        const embed = new EmbedBuilder()
            .setTitle(title || ' ')
            .setDescription(description || ' ')
            .setColor(color);

        if (footer) embed.setFooter({ text: footer });

        await targetChannel.send({ embeds: [embed] });
        await interaction.reply({ 
            content: `✅ Embed sent to ${targetChannel}!`, 
            ephemeral: true 
        });
    }
});

client.login(TOKEN);
