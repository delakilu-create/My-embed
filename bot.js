const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const express = require('express');

// ───────────── WEB SERVER ─────────────
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('✅ DIGITAL HUB Bot is running!');
});

app.listen(PORT, () => {
    console.log(`🌐 Web server running on port ${PORT}`);
});

// ───────────── DISCORD BOT ─────────────
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

const TOKEN = process.env.DISCORD_TOKEN;
const ORDER_CHANNEL_ID = '1495456945279336490';

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

// Register slash commands
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
    console.log('✅ Commands ready: /embed , /order , /ping');
});

// ───────────── HANDLE COMMANDS ─────────────
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // PING COMMAND
    if (interaction.commandName === 'ping') {
        await interaction.reply({ 
            content: `🏓 Pong! Bot is online with ${client.ws.ping}ms latency.`, 
            ephemeral: true 
        });
    }

    // EMBED COMMAND
    if (interaction.commandName === 'embed') {
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

    // ORDER COMMAND - DIGITAL HUB
    if (interaction.commandName === 'order') {
        
        const modal = new ModalBuilder()
            .setCustomId('order_modal')
            .setTitle('📋 DIGITAL HUB - Order Form');

        const nameInput = new TextInputBuilder()
            .setCustomId('fullname')
            .setLabel('📝 Full Name')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('John Doe')
            .setRequired(true);

        const discordInput = new TextInputBuilder()
            .setCustomId('discord')
            .setLabel('💬 Discord Username')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('@username')
            .setRequired(true);

        const serviceTypeInput = new TextInputBuilder()
            .setCustomId('service_type')
            .setLabel('📦 Service Type')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Branding / Pixel / Dev / Web / Video / Game')
            .setRequired(true);

        const specificServiceInput = new TextInputBuilder()
            .setCustomId('specific_service')
            .setLabel('🎯 Specific Service')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Premium Branding - $250')
            .setRequired(true);

        const detailsInput = new TextInputBuilder()
            .setCustomId('details')
            .setLabel('📝 Project Details')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Describe what you need...')
            .setRequired(true);

        const budgetInput = new TextInputBuilder()
            .setCustomId('budget')
            .setLabel('💰 Budget (USD)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('$250')
            .setRequired(true);

        const deadlineInput = new TextInputBuilder()
            .setCustomId('deadline')
            .setLabel('⏰ Deadline')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('2 weeks / No deadline')
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(discordInput),
            new ActionRowBuilder().addComponents(serviceTypeInput),
            new ActionRowBuilder().addComponents(specificServiceInput),
            new ActionRowBuilder().addComponents(detailsInput),
            new ActionRowBuilder().addComponents(budgetInput),
            new ActionRowBuilder().addComponents(deadlineInput)
        );

        await interaction.showModal(modal);
    }
});

// ───────────── HANDLE MODAL SUBMISSIONS ─────────────
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    // EMBED MODAL
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

    // ORDER MODAL - DIGITAL HUB
    if (interaction.customId === 'order_modal') {
        
        const fullname = interaction.fields.getTextInputValue('fullname');
        const discord = interaction.fields.getTextInputValue('discord');
        const serviceType = interaction.fields.getTextInputValue('service_type');
        const specificService = interaction.fields.getTextInputValue('specific_service');
        const details = interaction.fields.getTextInputValue('details');
        const budget = interaction.fields.getTextInputValue('budget');
        const deadline = interaction.fields.getTextInputValue('deadline') || 'Not specified';

        const orderChannel = await client.channels.fetch(ORDER_CHANNEL_ID);
        
        const orderEmbed = new EmbedBuilder()
            .setTitle('🆕 NEW ORDER - DIGITAL HUB')
            .setColor('#00a8ff')
            .addFields(
                { name: '👤 Customer Name', value: fullname, inline: true },
                { name: '💬 Discord', value: discord, inline: true },
                { name: '📦 Service Type', value: serviceType, inline: true },
                { name: '🎯 Specific Service', value: specificService, inline: true },
                { name: '💰 Budget', value: budget, inline: true },
                { name: '⏰ Deadline', value: deadline, inline: true },
                { name: '📝 Project Details', value: details, inline: false }
            )
            .setFooter({ text: `Order from ${interaction.user.tag} | ID: ${interaction.user.id}` })
            .setTimestamp();

        await orderChannel.send({ embeds: [orderEmbed] });
        
        try {
            await interaction.user.send({
                content: `📋 **Order Confirmation - DIGITAL HUB**\n\nThank you for your order, ${fullname}!\n\n**Order Summary:**\n📦 Service: ${specificService}\n💰 Budget: ${budget}\n⏰ Deadline: ${deadline}\n\nA staff member will contact you at ${discord} within 24 hours.\n\nThank you for choosing DIGITAL HUB! 🚀`
            });
        } catch (error) {
            console.log('Could not DM user');
        }
        
        await interaction.reply({ 
            content: `✅ **Order submitted successfully!**\n\nYour order has been received. A DIGITAL HUB staff member will contact you at **${discord}** within 24 hours.\n\n**Order Summary:**\n📦 Service: ${specificService}\n💰 Budget: ${budget}\n⏰ Deadline: ${deadline}\n\nThank you for choosing DIGITAL HUB! 🚀`, 
            ephemeral: true 
        });
    }
});

client.login(TOKEN);
