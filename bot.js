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
const APPLICATIONS_CHANNEL_ID = 'YOUR_APPLICATIONS_CHANNEL_ID'; // Set this
const SUGGESTIONS_CHANNEL_ID = 'YOUR_SUGGESTIONS_CHANNEL_ID'; // Set this
const REPORTS_CHANNEL_ID = 'YOUR_REPORTS_CHANNEL_ID'; // Set this
const TICKET_CATEGORY_ID = null;

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

// Register all slash commands
client.once('ready', async () => {
    await client.application.commands.set([
        // Existing commands
        { name: 'embed', description: 'Create and send a custom embed to any channel', options: [{ name: 'channel', description: 'The channel to send the embed to', type: 7, required: true }] },
        { name: 'order', description: 'Place an order with DIGITAL HUB' },
        { name: 'ping', description: 'Check if the bot is responsive' },
        { name: 'socials', description: 'View all DIGITAL HUB social media links' },
        { name: 'portfolio', description: 'View our recent work and projects' },
        { name: 'feedback', description: 'Leave feedback or a review for DIGITAL HUB' },
        { name: 'ticket', description: 'Create a support ticket' },
        { name: 'rules', description: 'View the server rules' },
        { name: 'staff', description: 'View the DIGITAL HUB staff team' },
        { name: 'website', description: 'Get the DIGITAL HUB website link' },
        { name: 'status', description: 'Check bot and server status' },
        // NEW COMMANDS
        { name: 'announce', description: '[STAFF] Make an announcement' },
        { name: 'apply', description: 'Apply for staff position' },
        { name: 'suggest', description: 'Submit a suggestion for the server' },
        { name: 'vote', description: 'Get voting links for the server' },
        { name: 'boost', description: 'Show boost perks and progress' },
        { name: 'partner', description: 'Partnership request form' },
        { name: 'report', description: 'Report a user or issue' },
        { name: 'faq', description: 'Frequently asked questions' },
        { name: 'close', description: '[STAFF] Close a support ticket' },
        { name: 'addmember', description: '[STAFF] Add a member to a ticket', options: [{ name: 'user', description: 'User to add', type: 6, required: true }] },
        { name: 'giveaway', description: '[STAFF] Start a giveaway', options: [{ name: 'prize', description: 'Giveaway prize', type: 3, required: true }, { name: 'duration', description: 'Duration in hours', type: 4, required: true }] },
        { name: 'poll', description: 'Create a poll' },
        { name: 'reminder', description: 'Set a reminder', options: [{ name: 'time', description: 'Minutes from now', type: 4, required: true }, { name: 'message', description: 'Reminder message', type: 3, required: true }] },
        { name: 'countdown', description: 'Create a countdown to an event', options: [{ name: 'event', description: 'Event name', type: 3, required: true }, { name: 'days', description: 'Days from now', type: 4, required: true }] },
        { name: 'quote', description: 'Save or view a random quote', options: [{ name: 'quote', description: 'Quote to save (optional)', type: 3, required: false }] },
        { name: 'avatar', description: 'View a user\'s avatar', options: [{ name: 'user', description: 'User to view', type: 6, required: false }] },
        { name: 'serverinfo', description: 'View server information' },
        { name: 'userinfo', description: 'View user information', options: [{ name: 'user', description: 'User to view', type: 6, required: false }] },
        { name: 'help', description: 'Show all available commands' }
    ]);
    console.log('✅ All 25+ commands ready!');
});

// Store for quotes
let quotes = [];

// ========== HANDLE COMMANDS ==========
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // ---------- PING ----------
    if (interaction.commandName === 'ping') {
        await interaction.reply({ content: `🏓 Pong! ${client.ws.ping}ms`, ephemeral: true });
    }

    // ---------- HELP ----------
    if (interaction.commandName === 'help') {
        const embed = new EmbedBuilder()
            .setTitle('📖 DIGITAL HUB - Help Center')
            .setDescription('Here are all available commands!')
            .setColor('#00a8ff')
            .addFields(
                { name: '🛒 Order & Services', value: '`/order` `/portfolio` `/socials` `/website`', inline: false },
                { name: '📝 Feedback & Support', value: '`/feedback` `/ticket` `/suggest` `/report`', inline: false },
                { name: '👑 Staff Commands', value: '`/announce` `/apply` `/close` `/addmember` `/giveaway`', inline: false },
                { name: 'ℹ️ Information', value: '`/rules` `/staff` `/status` `/ping` `/serverinfo` `/userinfo` `/help`', inline: false },
                { name: '🎮 Fun & Utility', value: '`/poll` `/quote` `/avatar` `/reminder` `/countdown` `/vote` `/boost` `/faq`', inline: false }
            )
            .setFooter({ text: 'Need more help? Open a ticket with /ticket' })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
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
            .addFields({ name: '🔗 Link', value: 'https://www.digitalhub.com', inline: false })
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
                { name: '🔧 Moderators', value: 'Mod 1, Mod 2, Mod 3', inline: true }
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
                { name: '👥 Server Members', value: `${interaction.guild.memberCount}`, inline: true }
            )
            .setFooter({ text: 'All systems operational!' })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- SERVERINFO ----------
    if (interaction.commandName === 'serverinfo') {
        const embed = new EmbedBuilder()
            .setTitle(`📊 ${interaction.guild.name} - Server Info`)
            .setColor('#00a8ff')
            .addFields(
                { name: '👑 Owner', value: `<@${interaction.guild.ownerId}>`, inline: true },
                { name: '👥 Members', value: `${interaction.guild.memberCount}`, inline: true },
                { name: '📅 Created', value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- USERINFO ----------
    if (interaction.commandName === 'userinfo') {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new EmbedBuilder()
            .setTitle(`👤 ${user.username} - User Info`)
            .setColor('#00a8ff')
            .addFields(
                { name: '🆔 ID', value: user.id, inline: true },
                { name: '📅 Joined Discord', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- AVATAR ----------
    if (interaction.commandName === 'avatar') {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new EmbedBuilder()
            .setTitle(`🖼️ ${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ size: 1024 }))
            .setColor('#00a8ff');
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- VOTE ----------
    if (interaction.commandName === 'vote') {
        const embed = new EmbedBuilder()
            .setTitle('🗳️ Vote for DIGITAL HUB')
            .setDescription('Support us by voting on these platforms!')
            .setColor('#f1c40f')
            .addFields(
                { name: '⭐ Top.gg', value: '[Click here to vote](https://top.gg)', inline: true },
                { name: '⭐ Discord Servers', value: '[Click here to vote](https://discordservers.com)', inline: true },
                { name: '⭐ Discord Bot List', value: '[Click here to vote](https://discordbotlist.com)', inline: true }
            )
            .setFooter({ text: 'Vote daily for rewards!' });
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- BOOST ----------
    if (interaction.commandName === 'boost') {
        const embed = new EmbedBuilder()
            .setTitle('✨ Server Boost Perks')
            .setDescription('Thank you for boosting! Here are your perks:')
            .setColor('#f47fff')
            .addFields(
                { name: '🎁 Perk 1', value: 'Access to exclusive boosters-only channel', inline: false },
                { name: '🎁 Perk 2', value: 'Custom role with unique color', inline: false },
                { name: '🎁 Perk 3', value: 'Priority support in tickets', inline: false }
            );
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- FAQ ----------
    if (interaction.commandName === 'faq') {
        const embed = new EmbedBuilder()
            .setTitle('❓ Frequently Asked Questions')
            .setColor('#00a8ff')
            .addFields(
                { name: '❓ How do I place an order?', value: 'Use `/order` and fill out the form', inline: false },
                { name: '❓ How long does delivery take?', value: 'Usually 2-7 days depending on the project', inline: false },
                { name: '❓ What payment methods?', value: 'PayPal, Crypto, Discord Nitro, Robux', inline: false },
                { name: '❓ Can I get a refund?', value: 'Yes, within 24 hours of order if work not started', inline: false }
            );
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- ANNOUNCE (Staff Only) ----------
    if (interaction.commandName === 'announce') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Only staff can use this command!', ephemeral: true });
        }
        const modal = new ModalBuilder().setCustomId('announce_modal').setTitle('Make an Announcement');
        const titleInput = new TextInputBuilder().setCustomId('title').setLabel('Announcement Title').setStyle(TextInputStyle.Short).setRequired(true);
        const messageInput = new TextInputBuilder().setCustomId('message').setLabel('Announcement Message').setStyle(TextInputStyle.Paragraph).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(titleInput), new ActionRowBuilder().addComponents(messageInput));
        await interaction.showModal(modal);
    }

    // ---------- APPLY ----------
    if (interaction.commandName === 'apply') {
        const modal = new ModalBuilder().setCustomId('apply_modal').setTitle('DIGITAL HUB - Staff Application');
        const nameInput = new TextInputBuilder().setCustomId('name').setLabel('Your Discord Name').setStyle(TextInputStyle.Short).setRequired(true);
        const ageInput = new TextInputBuilder().setCustomId('age').setLabel('Your Age').setStyle(TextInputStyle.Short).setRequired(true);
        const experienceInput = new TextInputBuilder().setCustomId('experience').setLabel('Staff Experience').setStyle(TextInputStyle.Paragraph).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(nameInput), new ActionRowBuilder().addComponents(ageInput), new ActionRowBuilder().addComponents(experienceInput));
        await interaction.showModal(modal);
    }

    // ---------- SUGGEST ----------
    if (interaction.commandName === 'suggest') {
        const modal = new ModalBuilder().setCustomId('suggest_modal').setTitle('DIGITAL HUB - Suggestion');
        const titleInput = new TextInputBuilder().setCustomId('title').setLabel('Suggestion Title').setStyle(TextInputStyle.Short).setRequired(true);
        const suggestionInput = new TextInputBuilder().setCustomId('suggestion').setLabel('Your Suggestion').setStyle(TextInputStyle.Paragraph).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(titleInput), new ActionRowBuilder().addComponents(suggestionInput));
        await interaction.showModal(modal);
    }

    // ---------- REPORT ----------
    if (interaction.commandName === 'report') {
        const modal = new ModalBuilder().setCustomId('report_modal').setTitle('Report a User');
        const userInput = new TextInputBuilder().setCustomId('user').setLabel('User being reported').setStyle(TextInputStyle.Short).setRequired(true);
        const reasonInput = new TextInputBuilder().setCustomId('reason').setLabel('Reason for report').setStyle(TextInputStyle.Paragraph).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(userInput), new ActionRowBuilder().addComponents(reasonInput));
        await interaction.showModal(modal);
    }

    // ---------- POLL ----------
    if (interaction.commandName === 'poll') {
        const modal = new ModalBuilder().setCustomId('poll_modal').setTitle('Create a Poll');
        const questionInput = new TextInputBuilder().setCustomId('question').setLabel('Poll Question').setStyle(TextInputStyle.Short).setRequired(true);
        const option1Input = new TextInputBuilder().setCustomId('option1').setLabel('Option 1').setStyle(TextInputStyle.Short).setRequired(true);
        const option2Input = new TextInputBuilder().setCustomId('option2').setLabel('Option 2').setStyle(TextInputStyle.Short).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(questionInput), new ActionRowBuilder().addComponents(option1Input), new ActionRowBuilder().addComponents(option2Input));
        await interaction.showModal(modal);
    }

    // ---------- QUOTE ----------
    if (interaction.commandName === 'quote') {
        const newQuote = interaction.options.getString('quote');
        if (newQuote) {
            quotes.push({ text: newQuote, author: interaction.user.tag });
            await interaction.reply({ content: `✅ Quote saved!`, ephemeral: true });
        } else if (quotes.length > 0) {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            await interaction.reply({ content: `📝 "${randomQuote.text}" - ${randomQuote.author}` });
        } else {
            await interaction.reply({ content: 'No quotes saved yet! Use `/quote "your quote"` to add one.' });
        }
    }

    // ---------- REMINDER ----------
    if (interaction.commandName === 'reminder') {
        const minutes = interaction.options.getInteger('time');
        const message = interaction.options.getString('message');
        await interaction.reply({ content: `⏰ I'll remind you in ${minutes} minutes!`, ephemeral: true });
        setTimeout(async () => {
            await interaction.user.send(`⏰ Reminder: ${message}`);
        }, minutes * 60 * 1000);
    }

    // ---------- COUNTDOWN ----------
    if (interaction.commandName === 'countdown') {
        const event = interaction.options.getString('event');
        const days = interaction.options.getInteger('days');
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        const embed = new EmbedBuilder()
            .setTitle(`⏰ Countdown to ${event}`)
            .setDescription(`${days} days remaining!`)
            .addFields({ name: '📅 Date', value: targetDate.toLocaleDateString(), inline: true })
            .setColor('#00a8ff');
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- GIVEAWAY (Staff Only) ----------
    if (interaction.commandName === 'giveaway') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Only staff can use this command!', ephemeral: true });
        }
        const prize = interaction.options.getString('prize');
        const duration = interaction.options.getInteger('duration');
        const embed = new EmbedBuilder()
            .setTitle('🎉 GIVEAWAY 🎉')
            .setDescription(`**Prize:** ${prize}\n**Duration:** ${duration} hours\n\nReact with 🎉 to enter!`)
            .setColor('#57f287')
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }

    // ---------- PARTNER ----------
    if (interaction.commandName === 'partner') {
        const modal = new ModalBuilder().setCustomId('partner_modal').setTitle('Partnership Request');
        const serverInput = new TextInputBuilder().setCustomId('server').setLabel('Your Server Name').setStyle(TextInputStyle.Short).setRequired(true);
        const membersInput = new TextInputBuilder().setCustomId('members').setLabel('Member Count').setStyle(TextInputStyle.Short).setRequired(true);
        const whyInput = new TextInputBuilder().setCustomId('why').setLabel('Why partner with us?').setStyle(TextInputStyle.Paragraph).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(serverInput), new ActionRowBuilder().addComponents(membersInput), new ActionRowBuilder().addComponents(whyInput));
        await interaction.showModal(modal);
    }

    // ---------- EMBED ----------
    if (interaction.commandName === 'embed') {
        const targetChannel = interaction.options.getChannel('channel');
        const modal = new ModalBuilder().setCustomId(`embed_${targetChannel.id}`).setTitle('Create Custom Embed');
        const titleInput = new TextInputBuilder().setCustomId('title').setLabel('Title').setStyle(TextInputStyle.Short).setRequired(false);
        const descInput = new TextInputBuilder().setCustomId('description').setLabel('Description').setStyle(TextInputStyle.Paragraph).setRequired(false);
        const colorInput = new TextInputBuilder().setCustomId('color').setLabel('Color (hex)').setStyle(TextInputStyle.Short).setPlaceholder('#2b2d31').setRequired(false);
        const footerInput = new TextInputBuilder().setCustomId('footer').setLabel('Footer').setStyle(TextInputStyle.Short).setRequired(false);
        modal.addComponents(new ActionRowBuilder().addComponents(titleInput), new ActionRowBuilder().addComponents(descInput), new ActionRowBuilder().addComponents(colorInput), new ActionRowBuilder().addComponents(footerInput));
        await interaction.showModal(modal);
    }

    // ---------- ORDER ----------
    if (interaction.commandName === 'order') {
        const modal = new ModalBuilder().setCustomId('order_modal').setTitle('DIGITAL HUB - Order');
        const nameInput = new TextInputBuilder().setCustomId('name').setLabel('Full Name').setStyle(TextInputStyle.Short).setRequired(true);
        const serviceInput = new TextInputBuilder().setCustomId('service').setLabel('What service do you need?').setStyle(TextInputStyle.Short).setRequired(true);
        const detailsInput = new TextInputBuilder().setCustomId('details').setLabel('Project Details').setStyle(TextInputStyle.Paragraph).setRequired(true);
        const budgetInput = new TextInputBuilder().setCustomId('budget').setLabel('Budget (USD)').setStyle(TextInputStyle.Short).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(nameInput), new ActionRowBuilder().addComponents(serviceInput), new ActionRowBuilder().addComponents(detailsInput), new ActionRowBuilder().addComponents(budgetInput));
        await interaction.showModal(modal);
    }

    // ---------- FEEDBACK ----------
    if (interaction.commandName === 'feedback') {
        const modal = new ModalBuilder().setCustomId('feedback_modal').setTitle('DIGITAL HUB - Feedback');
        const nameInput = new TextInputBuilder().setCustomId('name').setLabel('Your Name').setStyle(TextInputStyle.Short).setRequired(true);
        const ratingInput = new TextInputBuilder().setCustomId('rating').setLabel('Rating (1-5)').setStyle(TextInputStyle.Short).setPlaceholder('5 = Excellent').setRequired(true);
        const feedbackInput = new TextInputBuilder().setCustomId('feedback').setLabel('Your Feedback').setStyle(TextInputStyle.Paragraph).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(nameInput), new ActionRowBuilder().addComponents(ratingInput), new ActionRowBuilder().addComponents(feedbackInput));
        await interaction.showModal(modal);
    }

    // ---------- TICKET ----------
    if (interaction.commandName === 'ticket') {
        const embed = new EmbedBuilder().setTitle('🎫 Create a Support Ticket').setDescription('Click the button below to open a private support ticket.').setColor('#23a55a');
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('create_ticket').setLabel('📩 Create Ticket').setStyle(ButtonStyle.Primary));
        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

    // ---------- CLOSE TICKET (Staff Only) ----------
    if (interaction.commandName === 'close') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: '❌ Only staff can close tickets!', ephemeral: true });
        }
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ This command can only be used in ticket channels!', ephemeral: true });
        }
        await interaction.reply({ content: '✅ Ticket will be deleted in 5 seconds...' });
        setTimeout(() => interaction.channel.delete(), 5000);
    }

    // ---------- ADDMEMBER (Staff Only) ----------
    if (interaction.commandName === 'addmember') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: '❌ Only staff can use this command!', ephemeral: true });
        }
        const user = interaction.options.getUser('user');
        await interaction.channel.permissionOverwrites.edit(user, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true });
        await interaction.reply({ content: `✅ Added ${user} to this ticket!`, ephemeral: true });
    }
});

// ========== HANDLE MODAL SUBMISSIONS ==========
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    // Embed Submit
    if (interaction.customId.startsWith('embed_')) {
        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');
        const color = interaction.fields.getTextInputValue('color') || '#2b2d31';
        const footer = interaction.fields.getTextInputValue('footer');
        const channelId = interaction.customId.replace('embed_', '');
        const targetChannel = await client.channels.fetch(channelId);
        const embed = new EmbedBuilder().setTitle(title || ' ').setDescription(description || ' ').setColor(color);
        if (footer) embed.setFooter({ text: footer });
        await targetChannel.send({ embeds: [embed] });
        await interaction.reply({ content: `✅ Embed sent to ${targetChannel}!`, ephemeral: true });
    }

    // Order Submit
    if (interaction.customId === 'order_modal') {
        const name = interaction.fields.getTextInputValue('name');
        const service = interaction.fields.getTextInputValue('service');
        const details = interaction.fields.getTextInputValue('details');
        const budget = interaction.fields.getTextInputValue('budget');
        try {
            const orderChannel = await client.channels.fetch(ORDER_CHANNEL_ID);
            const orderEmbed = new EmbedBuilder().setTitle('🆕 NEW ORDER - DIGITAL HUB').setColor('#00a8ff').addFields({ name: '👤 Customer', value: name, inline: true }, { name: '💰 Budget', value: budget, inline: true }, { name: '📦 Service', value: service, inline: false }, { name: '📝 Details', value: details, inline: false }).setFooter({ text: `From: ${interaction.user.tag}` }).setTimestamp();
            await orderChannel.send({ embeds: [orderEmbed] });
        } catch (error) { console.log('Error:', error.message); }
        await interaction.reply({ content: `✅ **Order submitted!**\n\nThank you ${name}! A staff member will contact you within 24 hours.`, ephemeral: true });
    }

    // Feedback Submit
    if (interaction.customId === 'feedback_modal') {
        const name = interaction.fields.getTextInputValue('name');
        const rating = interaction.fields.getTextInputValue('rating');
        const feedback = interaction.fields.getTextInputValue('feedback');
        const stars = '⭐'.repeat(parseInt(rating) || 0);
        try {
            const feedbackChannel = await client.channels.fetch(FEEDBACK_CHANNEL_ID);
            const feedbackEmbed = new EmbedBuilder().setTitle('📝 NEW CLIENT REVIEW').setColor('#f1c40f').addFields({ name: '👤 Client', value: name, inline: true }, { name: '⭐ Rating', value: `${stars} (${rating}/5)`, inline: true }, { name: '💬 Review', value: feedback, inline: false }).setTimestamp();
            await feedbackChannel.send({ embeds: [feedbackEmbed] });
        } catch (error) { console.log('Error:', error.message); }
        await interaction.reply({ content: `✅ Thank you for your review! ${stars}`, ephemeral: true });
    }

    // Announce Submit
    if (interaction.customId === 'announce_modal') {
        const title = interaction.fields.getTextInputValue('title');
        const message = interaction.fields.getTextInputValue('message');
        const embed = new EmbedBuilder().setTitle(`📢 ${title}`).setDescription(message).setColor('#57f287').setTimestamp();
        await interaction.reply({ content: '✅ Announcement sent!', ephemeral: true });
        await interaction.channel.send({ embeds: [embed] });
    }

    // Poll Submit
    if (interaction.customId === 'poll_modal') {
        const question = interaction.fields.getTextInputValue('question');
        const option1 = interaction.fields.getTextInputValue('option1');
        const option2 = interaction.fields.getTextInputValue('option2');
        const embed = new EmbedBuilder().setTitle('📊 POLL').setDescription(`**${question}**\n\n✅ ${option1}\n❌ ${option2}`).setColor('#00a8ff');
        const pollMsg = await interaction.reply({ embeds: [embed], fetchReply: true });
        await pollMsg.react('✅');
        await pollMsg.react('❌');
    }
});

// ========== HANDLE TICKET BUTTON ==========
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'create_ticket') {
        const existingChannel = interaction.guild.channels.cache.find(channel => channel.name === `ticket-${interaction.user.id}`);
        if (existingChannel) return interaction.reply({ content: `❌ You already have an open ticket: ${existingChannel}`, ephemeral: true });
        try {
            const ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: 0,
                parent: TICKET_CATEGORY_ID,
                permissionOverwrites: [{ id: interaction.guild.id, deny: ['ViewChannel'] }, { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles'] }, { id: client.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }]
            });
            const welcomeEmbed = new EmbedBuilder().setTitle('🎫 Support Ticket').setDescription(`Hello ${interaction.user.username}!\n\nPlease describe your issue and a staff member will assist you.`).setColor('#23a55a');
            await ticketChannel.send({ embeds: [welcomeEmbed] });
            await interaction.reply({ content: `✅ Ticket created: ${ticketChannel}`, ephemeral: true });
        } catch (error) { await interaction.reply({ content: '❌ Failed to create ticket.', ephemeral: true }); }
    }
});

client.login(TOKEN);
