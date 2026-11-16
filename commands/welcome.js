const { handleWelcome } = require('../lib/welcome');
const { isWelcomeOn, getWelcome } = require('../lib/index');
const { channelInfo } = require('../lib/messageConfig');
const { lidToMention } = require('../lib/jidHelper');
const fetch = require('node-fetch');

function resolveParticipantIds(participant) {
    if (typeof participant === 'string') return [participant];
    if (!participant || typeof participant !== 'object') return [String(participant)];
    return [participant.phoneNumber, participant.jid, participant.id, participant.lid].filter(Boolean);
}

function memberLabel(jid) {
    return String(jid || 'user').split('@')[0].split(':')[0];
}

async function welcomeCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) {
        return sock.sendMessage(chatId, { text: 'This command can only be used in groups.' }, { quoted: message });
    }
    const raw = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    await handleWelcome(sock, chatId, message, raw.split(' ').slice(1).join(' '));
}

async function fetchProfilePhoto(sock, jid) {
    try {
        return await sock.profilePictureUrl(jid, 'image');
    } catch {
        return 'https://i.imgur.com/6VBx3io.png';
    }
}

async function makeWelcomeCard({ name, group, count, avatar }) {
    const endpoints = [
        `https://api.some-random-api.com/welcome/img/2/gaming3?type=join&textcolor=green&username=${encodeURIComponent(name)}&guildName=${encodeURIComponent(group)}&memberCount=${count}&avatar=${encodeURIComponent(avatar)}`,
        `https://api.some-random-api.com/welcome/img/2/gaming1?type=join&textcolor=white&username=${encodeURIComponent(name)}&guildName=${encodeURIComponent(group)}&memberCount=${count}&avatar=${encodeURIComponent(avatar)}`
    ];
    for (const url of endpoints) {
        try {
            const response = await fetch(url, { timeout: 20000 });
            if (response.ok) {
                const buffer = await response.buffer();
                if (buffer.length > 5000) return buffer;
            }
        } catch {}
    }
    return null;
}

async function handleJoinEvent(sock, id, participants) {
    if (!(await isWelcomeOn(id))) return;

    const customMessage = await getWelcome(id);
    const metadata = await sock.groupMetadata(id);
    const groupName = metadata.subject || 'our group';
    const groupDesc = metadata.desc || 'Please read the group rules and enjoy your stay.';

    for (const participant of participants) {
        try {
            const ids = resolveParticipantIds(participant);
            let freshMetadata = metadata;
            try { freshMetadata = await sock.groupMetadata(id); } catch {}
            const matched = freshMetadata.participants?.find(p => ids.some(candidate =>
                [p.id, p.lid, p.phoneNumber, p.jid].filter(Boolean).some(value =>
                    memberLabel(value) === memberLabel(candidate)
                )));

            const mention = lidToMention([matched?.phoneNumber, matched?.id, matched?.lid, ...ids]);
            const mentionJid = mention.jid || ids[0];
            const name = mention.number || memberLabel(mentionJid);
            const tag = `@${name}`;
            const mentions = mention.mentions?.length ? mention.mentions : [mentionJid].filter(Boolean);
            const count = freshMetadata.participants?.length || metadata.participants?.length || 0;
            const avatar = await fetchProfilePhoto(sock, mentionJid);

            const body = customMessage
                ? customMessage.replace(/{user}/gi, tag).replace(/{group}/gi, groupName).replace(/{description}/gi, groupDesc)
                : `🎉 HELLO ${tag} WELCOME TO ${groupName} OUR FAMILY 🎉\n\nWe're so happy to have you here! 🤗💛\nFeel free, laugh, chat, and have fun with us! 😄🔥\n\n⚠️ GROUP RULES ⚠️\n\n🚫 NO LINKS ALLOWED IN THIS GROUP! 🚫\n⛔ Do not post any links in the group\n⛔ No WhatsApp, Telegram, YouTube, or any other links\n\n🤖 If you break this rule, our Bot will automatically remove you from the group! 🚪👋\n\nThank you for respecting the rules 🙏❤️\nLet's all have fun! 🥳✨`;

            // Send the joined member's full profile picture, not a generated welcome card.
            if (avatar) {
                await sock.sendMessage(id, { image: { url: avatar }, caption: body, mentions, ...channelInfo });
            } else {
                await sock.sendMessage(id, { text: body, mentions, ...channelInfo });
            }
        } catch (error) {
            console.error('[welcome] join handler:', error.message);
            await sock.sendMessage(id, { text: `👋 Welcome to the group, @${memberLabel(resolveParticipantIds(participant)[0])}!`, mentions: resolveParticipantIds(participant).slice(0, 1), ...channelInfo });
        }
    }
}

module.exports = { welcomeCommand, handleJoinEvent };
