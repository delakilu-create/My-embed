const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('✅ DIGITAL HUB Bot is running!');
});

app.listen(PORT, () => {
    console.log(`🌐 Web server running on port ${PORT}`);
});

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

const TOKEN = process.env.DISCORD_TOKEN;
const ORDER_CHANNEL_ID = '1509209386482929825';  // YOUR NEW CHANNEL ID

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
        },
        {
            name: 'order',
            description: 'Place an order with DIGITAL HUB'
        },
        {
            name: 'ping',
            description: 'Check if the bot is responsive'
        }
    ]);
    console.log('✅ Commands ready');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // PING
    if (interaction.commandName === 'ping') {
        await interaction.reply({ 
            content: `🏓 Pong! ${client.ws.ping}ms`, 
            ephemeral: true 
        });
    }

    // EMBED
    if (interaction.commandName === 'embed') {
        const targetChannel = interaction.options.getChannel('channel');

        const modal = new ModalBuilder()
            .setCustomId(`embed_${targetChannel.id}`)
            .setTitle('Create Custom Embed');

        const titleInput = new TextInputBuilder()
            .setCustomId('title')
            .setLabel('Title')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const descInput = new TextInputBuilder()
            .setCustomId('description')
            .setLabel('Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const colorInput = new TextInputBuilder()
            .setCustomId('color')
            .setLabel('Color (hex)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('#2b2d31')
            .setRequired(false);

        const footerInput = new TextInputBuilder()
            .setCustomId('footer')
            .setLabel('Footer')
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

    // ORDER
    if (interaction.commandName === 'order') {
        
        const modal = new ModalBuilder()
            .setCustomId('order_modal')
            .setTitle('DIGITAL HUB - Order');

        const nameInput = new TextInputBuilder()
            .setCustomId('name')
            .setLabel('Full Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const serviceInput = new TextInputBuilder()
            .setCustomId('service')
            .setLabel('What service do you need?')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Branding, Pixel Art, Development, etc.')
            .setRequired(true);

        const detailsInput = new TextInputBuilder()
            .setCustomId('details')
            .setLabel('Project Details')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Describe what you need...')
            .setRequired(true);

        const budgetInput = new TextInputBuilder()
            .setCustomId('budget')
            .setLabel('Budget (USD)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('$250')
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(serviceInput),
            new ActionRowBuilder().addComponents(detailsInput),
            new ActionRowBuilder().addComponents(budgetInput)
        );

        await interaction.showModal(modal);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    // EMBED SUBMIT
    if (interaction.customId.startsWith('embed_')) {
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

    // ORDER SUBMIT
    if (interaction.customId === 'order_modal') {
        
        const name = interaction.fields.getTextInputValue('name');
        const service = interaction.fields.getTextInputValue('service');
        const details = interaction.fields.getTextInputValue('details');
        const budget = interaction.fields.getTextInputValue('budget');

        try {
            const orderChannel = await client.channels.fetch(ORDER_CHANNEL_ID);
            
            const orderEmbed = new EmbedBuilder()
                .setTitle('🆕 NEW ORDER - DIGITAL HUB')
                .setColor('#00a8ff')
                .addFields(
                    { name: '👤 Customer', value: name, inline: true },
                    { name: '💰 Budget', value: budget, inline: true },
                    { name: '📦 Service', value: service, inline: false },
                    { name: '📝 Details', value: details, inline: false }
                )
                .setFooter({ text: `From: ${interaction.user.tag}` })
                .setTimestamp();

            await orderChannel.send({ embeds: [orderEmbed] });
            console.log('✅ Order sent to channel');
        } catch (error) {
            console.log('Error sending to channel:', error.message);
        }
        
        await interaction.reply({ 
            content: `✅ **Order submitted!**\n\nThank you ${name}! A DIGITAL HUB staff member will contact you within 24 hours.\n\n**Summary:**\n📦 Service: ${service}\n💰 Budget: ${budget}\n\nThank you for choosing DIGITAL HUB! 🚀`, 
            ephemeral: true 
        });
    }
});

client.login(TOKEN);
