const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
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
const ORDER_CHANNEL_ID = '1509209386482929825';
const FEEDBACK_CHANNEL_ID = '1491721251985559573';
const TICKET_CATEGORY_ID = null;

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

// Register all slash commands
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
        },
        {
            name: 'socials',
            description: 'View all DIGITAL HUB social media links'
        },
        {
            name: 'portfolio',
            description: 'View our recent work and projects'
        },
        {
            name: 'feedback',
            description: 'Leave feedback or a review for DIGITAL HUB'
        },
        {
            name: 'ticket',
            description: 'Create a support ticket'
        },
        {
            name: 'rules',
            description: 'View the server rules'
        },
        {
            name: 'staff',
            description: 'View the DIGITAL HUB staff team'
        },
        {
            name: 'website',
            description: 'Get the DIGITAL HUB website link'
        },
        {
            name: 'status',
            description: 'Check bot and server status'
        }
    ]);
    console.log('✅ All 10 commands ready!');
});

// ========== HANDLE COMMANDS ==========
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // ---------- PING ----------
    if (interaction.commandName === 'ping') {
        await interaction.reply({ 
            content: `🏓 Pong! ${client.ws.ping}ms`, 
            ephemeral: true 
        });
    }

    // ---------- SOCIALS ----------
    if (interaction.commandName === 'socials') {
        const embed = new EmbedBuilder()
            .setTitle('🔗 DIGITAL HUB - Social Links')
            .setDescription('Connect with us on all platforms!')
            .setColor('#00a8ff')
            .addFields(
                { name: '📧 Email', value: 'contact@digitalhub.com', inline: true },
                { name: '🌐 Website', value: 'www.digitalhub.com', inline: true },
                { name: '💬 Discord', value: 'discord.gg/digitalhub', inline: true },
                { name: '📷 Instagram', value: '@digitalhub', inline: true },
                { name: '🐦 Twitter', value: '@digitalhub', inline: true },
                { name: '🎵 TikTok', value: '@digitalhub', inline: true },
                { name: '📹 YouTube', value: '@digitalhub', inline: true }
            )
            .setFooter({ text: 'DIGITAL HUB - Your creative partner' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- PORTFOLIO ----------
    if (interaction.commandName === 'portfolio') {
        const embed = new EmbedBuilder()
            .setTitle('🎨 DIGITAL HUB - Portfolio')
            .setDescription('Check out our recent work!')
            .setColor('#9b59b6')
            .addFields(
                { name: '🎮 Minecraft Server', value: 'Full server setup + custom plugins\n**Price:** $300', inline: true },
                { name: '🤖 Discord Bot', value: 'Custom moderation bot with tickets\n**Price:** $150', inline: true },
                { name: '🎬 Trailer Edit', value: 'Cinematic Minecraft trailer\n**Price:** $100', inline: true },
                { name: '🎨 Branding Package', value: 'Complete visual identity\n**Price:** $250', inline: true },
                { name: '🌐 Website', value: 'Full business website\n**Price:** $600', inline: true },
                { name: '🖼️ Pixel Art', value: 'Custom emoji pack\n**Price:** $25', inline: true }
            )
            .setFooter({ text: 'Contact us for more examples!' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- WEBSITE ----------
    if (interaction.commandName === 'website') {
        const embed = new EmbedBuilder()
            .setTitle('🌐 DIGITAL HUB - Website')
            .setDescription('Check out our official website!')
            .setColor('#00a8ff')
            .addFields(
                { name: '🔗 Link', value: 'https://www.digitalhub.com', inline: false },
                { name: '📋 Services', value: 'See all our services and pricing', inline: true },
                { name: '📞 Contact', value: 'Get in touch with us', inline: true }
            )
            .setFooter({ text: 'Visit us today!' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- RULES ----------
    if (interaction.commandName === 'rules') {
        const embed = new EmbedBuilder()
            .setTitle('📜 DIGITAL HUB - Server Rules')
            .setDescription('Please follow these rules to keep our community safe!')
            .setColor('#ed4245')
            .addFields(
                { name: '1️⃣ Be Respectful', value: 'No harassment, hate speech, or toxic behavior', inline: false },
                { name: '2️⃣ No Spam', value: 'No excessive messages, links, or advertising', inline: false },
                { name: '3️⃣ No Scams', value: 'No fake services or fraudulent activities', inline: false },
                { name: '4️⃣ Use Correct Channels', value: 'Keep conversations in the right channels', inline: false },
                { name: '5️⃣ No NSFW', value: 'This is a safe-for-work server', inline: false },
                { name: '6️⃣ Respect Staff', value: 'Staff decisions are final', inline: false }
            )
            .setFooter({ text: 'Violations may result in warnings or bans' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- STAFF ----------
    if (interaction.commandName === 'staff') {
        const embed = new EmbedBuilder()
            .setTitle('👑 DIGITAL HUB - Staff Team')
            .setDescription('Meet our amazing team!')
            .setColor('#f1c40f')
            .addFields(
                { name: '👑 Owner', value: '<@OWNER_ID> - Server Owner', inline: true },
                { name: '🛡️ Admins', value: 'Admin 1, Admin 2', inline: true },
                { name: '🔧 Moderators', value: 'Mod 1, Mod 2, Mod 3', inline: true },
                { name: '🎨 Design Team', value: 'Designer 1, Designer 2', inline: true },
                { name: '💻 Dev Team', value: 'Dev 1, Dev 2', inline: true }
            )
            .setFooter({ text: 'Contact staff for any issues!' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- STATUS ----------
    if (interaction.commandName === 'status') {
        const uptime = Math.floor(client.uptime / 1000 / 60);
        const embed = new EmbedBuilder()
            .setTitle('📊 DIGITAL HUB - Status')
            .setColor('#57f287')
            .addFields(
                { name: '🤖 Bot Status', value: '🟢 Online', inline: true },
                { name: '📈 Bot Ping', value: `${client.ws.ping}ms`, inline: true },
                { name: '⏰ Bot Uptime', value: `${uptime} minutes`, inline: true },
                { name: '👥 Server Members', value: `${interaction.guild.memberCount}`, inline: true },
                { name: '⚙️ Commands', value: '10+ available', inline: true }
            )
            .setFooter({ text: 'All systems operational!' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- EMBED ----------
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

    // ---------- ORDER ----------
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

    // ---------- FEEDBACK ----------
    if (interaction.commandName === 'feedback') {
        
        const modal = new ModalBuilder()
            .setCustomId('feedback_modal')
            .setTitle('DIGITAL HUB - Feedback');

        const nameInput = new TextInputBuilder()
            .setCustomId('name')
            .setLabel('Your Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const ratingInput = new TextInputBuilder()
            .setCustomId('rating')
            .setLabel('Rating (1-5)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('5 = Excellent, 1 = Poor')
            .setRequired(true);

        const feedbackInput = new TextInputBuilder()
            .setCustomId('feedback')
            .setLabel('Your Feedback')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('What did you think of our service?')
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(ratingInput),
            new ActionRowBuilder().addComponents(feedbackInput)
        );

        await interaction.showModal(modal);
    }

    // ---------- TICKET ----------
    if (interaction.commandName === 'ticket') {
        
        const embed = new EmbedBuilder()
            .setTitle('🎫 Create a Support Ticket')
            .setDescription('Click the button below to open a private support ticket.\n\nA staff member will assist you as soon as possible.')
            .setColor('#23a55a')
            .setFooter({ text: 'DIGITAL HUB Support' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('📩 Create Ticket')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
});

// ========== HANDLE MODAL SUBMISSIONS ==========
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    // ---------- EMBED SUBMIT ----------
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

    // ---------- ORDER SUBMIT ----------
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
                .setFooter({ text: `From: ${interaction.user.tag} | ID: ${interaction.user.id}` })
                .setTimestamp();

            await orderChannel.send({ embeds: [orderEmbed] });
        } catch (error) {
            console.log('Error sending order:', error.message);
        }
        
        await interaction.reply({ 
            content: `✅ **Order submitted!**\n\nThank you ${name}! A DIGITAL HUB staff member will contact you within 24 hours.\n\n**Summary:**\n📦 Service: ${service}\n💰 Budget: ${budget}\n\nThank you for choosing DIGITAL HUB! 🚀`, 
            ephemeral: true 
        });
    }

    // ---------- FEEDBACK SUBMIT ----------
    if (interaction.customId === 'feedback_modal') {
        
        const name = interaction.fields.getTextInputValue('name');
        const rating = interaction.fields.getTextInputValue('rating');
        const feedback = interaction.fields.getTextInputValue('feedback');

        const stars = '⭐'.repeat(parseInt(rating) || 0);
        
        try {
            const feedbackChannel = await client.channels.fetch(FEEDBACK_CHANNEL_ID);
            
            const feedbackEmbed = new EmbedBuilder()
                .setTitle('📝 NEW CLIENT REVIEW')
                .setColor('#f1c40f')
                .addFields(
                    { name: '👤 Client', value: name, inline: true },
                    { name: '⭐ Rating', value: `${stars} (${rating}/5)`, inline: true },
                    { name: '💬 Review', value: feedback, inline: false }
                )
                .setFooter({ text: `From: ${interaction.user.tag}` })
                .setTimestamp();

            await feedbackChannel.send({ embeds: [feedbackEmbed] });
        } catch (error) {
            console.log('Error sending feedback:', error.message);
        }
        
        await interaction.reply({ 
            content: `✅ **Thank you for your review!**\n\n${stars}\n\nYour feedback helps us improve. We appreciate you! 🎉`, 
            ephemeral: true 
        });
    }
});

// ========== HANDLE TICKET BUTTON ==========
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    
    if (interaction.customId === 'create_ticket') {
        
        const existingChannel = interaction.guild.channels.cache.find(
            channel => channel.name === `ticket-${interaction.user.id}`
        );
        
        if (existingChannel) {
            await interaction.reply({ 
                content: `❌ You already have an open ticket: ${existingChannel}`, 
                ephemeral: true 
            });
            return;
        }
        
        try {
            const ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: 0,
                parent: TICKET_CATEGORY_ID,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles'],
                    },
                    {
                        id: client.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                    }
                ]
            });
            
            const welcomeEmbed = new EmbedBuilder()
                .setTitle('🎫 Support Ticket')
                .setDescription(`Hello ${interaction.user.username}!\n\nPlease describe your issue and a staff member will assist you shortly.`)
                .setColor('#23a55a')
                .addFields(
                    { name: '📌 Instructions', value: 'Be as detailed as possible about your request.' },
                    { name: '⏰ Response Time', value: 'Usually within 24 hours' },
                    { name: '🔒 Privacy', value: 'Only you and staff can see this channel.' }
                )
                .setFooter({ text: 'Type /close to close this ticket (staff only)' });
            
            await ticketChannel.send({ embeds: [welcomeEmbed] });
            
            await interaction.reply({ 
                content: `✅ Ticket created: ${ticketChannel}`, 
                ephemeral: true 
            });
            
        } catch (error) {
            console.log('Error creating ticket:', error);
            await interaction.reply({ 
                content: '❌ Failed to create ticket. Please make sure I have the correct permissions.', 
                ephemeral: true 
            });
        }
    }
});

client.login(TOKEN);
