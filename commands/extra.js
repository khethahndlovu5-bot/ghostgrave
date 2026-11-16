const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;
const tls = require('tls');
const settings = require('../settings');
const DATA = path.join(__dirname, '..', 'data');
const NOTES = path.join(DATA, 'group-notes.json');
const RULES = path.join(DATA, 'group-rules.json');
function readJson(file, fallback = {}) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } }
function writeJson(file, data) { if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, {recursive:true}); fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
function getQuotedJid(message) { const c = message.message?.extendedTextMessage?.contextInfo || {}; return c.mentionedJid?.[0] || c.participant || null; }
function antiStateFile(name) { return path.join(DATA, `${name}.json`); }
function parseToggle(value) { const v=String(value||'').toLowerCase(); if(['on','enable','enabled','1','yes'].includes(v)) return true; if(['off','disable','disabled','0','no'].includes(v)) return false; return null; }
async function reply(sock, chatId, message, text) { return sock.sendMessage(chatId, {text}, {quoted:message}); }
async function requireGroupAdmin(sock, chatId, message) {
  if (!chatId.endsWith('@g.us')) { await reply(sock, chatId, message, 'This command works inside a WhatsApp group.'); return false; }
  const sender = message.key.participant || message.key.remoteJid;
  const status = await require('../lib/isAdmin')(sock, chatId, sender);
  if (!status.isSenderAdmin && !message.key.fromMe) { await reply(sock, chatId, message, 'Sorry, only group admins can use this command.'); return false; }
  if (!status.isBotAdmin && !message.key.fromMe) { await reply(sock, chatId, message, 'Please make the bot an admin first.'); return false; }
  return true;
}
async function antiToggle(sock, chatId, message, name, arg) {
  if (!(await requireGroupAdmin(sock, chatId, message))) return true;
  const all = readJson(antiStateFile(name)); const value = parseToggle(arg);
  if (value === null) return reply(sock, chatId, message, `.${name} is currently ${all[chatId] ? 'ON' : 'OFF'}. Use .${name} on or .${name} off.`);
  all[chatId] = value; writeJson(antiStateFile(name), all);
  return reply(sock, chatId, message, `✅ .${name} ${value ? 'enabled' : 'disabled'} for this group.`);
}
async function runExtra(sock, chatId, message, userMessage, context = {}) {
  const [raw, ...args] = userMessage.trim().split(/\s+/); const cmd = raw.slice(1).toLowerCase(); const q = args.join(' ').trim();
  const isGroup = chatId.endsWith('@g.us');
  const owner = !!(context.isOwner || message.key.fromMe);
  const groupOnly = ['grouprules','rules','note','topmembers','active','groupstatus'];
  if (groupOnly.includes(cmd) && !isGroup) return reply(sock, chatId, message, 'This command works inside a WhatsApp group.');
  switch (cmd) {
    case 'prefix': return reply(sock, chatId, message, 'Current command prefix: .\nExample: .menu');
    case 'time': return reply(sock, chatId, message, `🕒 ${new Date().toLocaleString('en-ZA', {timeZone:'Africa/Johannesburg', dateStyle:'full', timeStyle:'long'})} (South Africa)`);
    case 'country': return reply(sock, chatId, message, q ? `Country lookup for “${q}” is not connected to a country database yet.` : 'Usage: .country <country name or calling code>');
    case 'speedtest': { const start=Date.now(); await dns.lookup('whatsapp.com'); return reply(sock, chatId, message, `🌐 Bot network check completed. DNS response: ${Date.now()-start} ms. This is not a full internet speed test.`); }
    case 'dns': { if(!q) return reply(sock,chatId,message,'Usage: .dns example.com'); const host=q.replace(/^https?:\/\//,'').split('/')[0]; try { const records=await dns.lookup(host,{all:true}); return reply(sock,chatId,message,`DNS for ${host}:\n${records.map(r=>`${r.address} (IPv${r.family})`).join('\n')}`); } catch(e){ return reply(sock,chatId,message,`DNS lookup failed: ${e.message}`); } }
    case 'ssl': { if(!q) return reply(sock,chatId,message,'Usage: .ssl example.com'); const host=q.replace(/^https?:\/\//,'').split('/')[0]; return new Promise(resolve=>{ const s=tls.connect(443,host,{servername:host,timeout:8000},()=>{ const c=s.getPeerCertificate(); const text=`🔒 TLS certificate for ${host}\nValid: ${s.authorized ? 'Yes' : 'No'}\nIssuer: ${c.issuer?.O || c.issuer?.CN || 'Unknown'}\nExpires: ${c.valid_to || 'Unknown'}`; s.end(); resolve(reply(sock,chatId,message,text)); }); s.on('error',e=>resolve(reply(sock,chatId,message,`TLS check failed: ${e.message}`))); s.on('timeout',()=>{s.destroy();resolve(reply(sock,chatId,message,'TLS check timed out.'));}); }); }
    case 'whois': { if(!q) return reply(sock,chatId,message,'Usage: .whois @member or reply to their message.'); const jid=getQuotedJid(message); if(!jid) return reply(sock,chatId,message,'Mention a member or reply to their message.'); try { const r=await sock.onWhatsApp(jid); return reply(sock,chatId,message,`WhatsApp account: ${r?.[0]?.exists ? 'Registered' : 'Not confirmed'}\nJID: ${jid}`); } catch { return reply(sock,chatId,message,`Member JID: ${jid}`); } }
    case 'note': { const all=readJson(NOTES); const key=chatId; if(!q || q==='list'){ const entries=all[key]||{}; return reply(sock,chatId,message,Object.keys(entries).length ? '📝 Group notes:\n'+Object.entries(entries).map(([k,v])=>`• ${k}: ${v}`).join('\n') : 'No notes saved. Use .note add <name> <text>'); } const [sub,...rest]=args; const name=rest.shift(); if(sub==='add' && name && rest.length){ all[key]=all[key]||{}; all[key][name]=rest.join(' '); writeJson(NOTES,all); return reply(sock,chatId,message,`Saved note: ${name}`); } if(sub==='del' && name && all[key]){ delete all[key][name]; writeJson(NOTES,all); return reply(sock,chatId,message,`Deleted note: ${name}`); } return reply(sock,chatId,message,'Usage: .note add <name> <text> | .note list | .note del <name>'); }
    case 'grouprules': case 'rules': { const all=readJson(RULES); if(q.startsWith('set ') && owner){ all[chatId]=q.slice(4); writeJson(RULES,all); return reply(sock,chatId,message,'✅ Group rules saved.'); } return reply(sock,chatId,message,`📜 GROUP RULES\n${all[chatId] || 'No custom rules saved. Owner can set them with .rules set <rules>.'}`); }
    case 'active': { const { topMembers } = require('./topmembers'); return topMembers(sock, chatId, true); }
    case 'block': { if(!owner) return reply(sock,chatId,message,'Only the bot owner can use .block.'); const jid=getQuotedJid(message); if(!jid) return reply(sock,chatId,message,'Reply to a person or mention them: .block'); try { await sock.updateBlockStatus(jid,'block'); return reply(sock,chatId,message,'Contact blocked.'); } catch(e){ return reply(sock,chatId,message,`Could not block contact: ${e.message}`); } }
    case 'devicecheck': return reply(sock,chatId,message,'WhatsApp does not provide bots with a reliable way to identify another member’s phone model or device.');
    case 'font': case 'color': case 'theme': return reply(sock,chatId,message,'Text styling commands are available in .menu under Textmaker (for example .neon <text>, .fire <text>, .metallic <text>).');
    case 'logo': return reply(sock,chatId,message,'Use .imagine <description> to create a logo concept, or .metallic <name> for a text logo.');
    case 'textsticker': return reply(sock,chatId,message,'Use .attp <text> to create an animated text sticker.');
    case 'utility': case 'utilitytool': return reply(sock,chatId,message,'🧰 Utility commands: .time, .dns <domain>, .ssl <domain>, .speedtest, .whois @member, .country <name>.');
    case 'entertainment': return reply(sock,chatId,message,'🎮 Entertainment commands: .joke, .meme, .truth, .dare, .trivia, .anime, .compliment, .8ball.');
    case 'kid': return reply(sock,chatId,message,'🧒 Kid-friendly mode: try .joke, .fact, .meme, .trivia, or .anime.');
    case 'converter': case 'concerter': return reply(sock,chatId,message,'Converter module is not configured yet. Supported bot tools: .translate <text> <language> and .time.');
    case 'mediafire': case 'apk': case 'gdrive': case 'carbon': case 'stickersearch': case 'uploader': return reply(sock,chatId,message,`${cmd} needs a compatible external API/service key, which is not configured in this bot yet. I have not added a fake downloader.`);
    case 'antispam': case 'antifake': case 'antiscam': return reply(sock,chatId,message,`${cmd} is not a standalone protection module yet. Existing protections: .antilink, .antibadword, .antibot, and .antitag.`);
    case 'mutemember': return reply(sock,chatId,message,'WhatsApp group bots cannot silence only one member using the standard group API. Use group admin moderation or .mute to close group messaging for everyone.');
    case 'password': return reply(sock,chatId,message,'For safety, this bot does not collect, store, or send passwords. Use a trusted password manager instead.');
    case 'getcode': return reply(sock,chatId,message,'For safety, this bot cannot retrieve or forward login codes or one-time passwords.');
    case 'eval': case 'devtools': return reply(sock,chatId,message,'This command is disabled because remote code execution can compromise the bot and its WhatsApp session.');
    case 'pair': return reply(sock,chatId,message,'Use .pair <your WhatsApp number with country code> to request a pairing code. Never share the code with anyone.');
    case 'antimedia': return antiToggle(sock, chatId, message, 'antimedia', args[0]);
    case 'antisticker': return antiToggle(sock, chatId, message, 'antisticker', args[0]);
    case 'antigroupstatus': return antiToggle(sock, chatId, message, 'antigroupstatus', args[0]);
    case 'getpp': {
      const jid = getQuotedJid(message) || message.key.participant || chatId;
      try { const url = await sock.profilePictureUrl(jid, 'image'); return sock.sendMessage(chatId, { image: { url }, caption: `Profile picture: ${jid.split('@')[0]}` }, { quoted: message }); }
      catch { return reply(sock, chatId, message, 'This contact does not have a publicly available profile picture.'); }
    }
    case 'add': {
      if (!(await requireGroupAdmin(sock, chatId, message))) return true;
      const number = (args[0] || '').replace(/[^0-9]/g, '');
      if (!number || number.length < 7) return reply(sock, chatId, message, 'Usage: .add <country-code-and-number>');
      try { const result = await sock.groupParticipantsUpdate(chatId, [`${number}@s.whatsapp.net`], 'add'); return reply(sock, chatId, message, result?.[0]?.status === '403' ? 'WhatsApp did not allow adding this contact. They may need an invite link.' : '✅ Add request sent.'); }
      catch (e) { return reply(sock, chatId, message, `Could not add this contact: ${e.message}`); }
    }
    case 'app': {
      if (!(await requireGroupAdmin(sock, chatId, message))) return true;
      try {
        const requests = await sock.groupRequestParticipantsList(chatId);
        if (!requests?.length) return reply(sock, chatId, message, 'There are no pending join requests.');
        const selected = getQuotedJid(message);
        const jids = selected ? requests.filter(r => (r.jid || r.id) === selected).map(r => r.jid || r.id) : requests.map(r => r.jid || r.id);
        if (!jids.length) return reply(sock, chatId, message, 'That member has no pending join request.');
        await sock.groupParticipantsUpdate(chatId, jids, 'approve');
        return reply(sock, chatId, message, `✅ Approved ${jids.length} pending join request${jids.length === 1 ? '' : 's'}.`);
      } catch (e) { return reply(sock, chatId, message, `Could not approve join requests: ${e.message}`); }
    }
    default: return false;
  }
}
module.exports = { runExtra };
