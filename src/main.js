import { Telegraf, session } from "telegraf";
import { code } from 'telegraf/format';
import { message } from 'telegraf/filters';
import config from 'config';
import { ogg } from './ogg.js';
import { openai } from './openai.js'
import { removeFile } from "./utils.js";
import { initCommand, getBalance } from "./logic.js";

const bot = new  Telegraf(config.get('TELEGRAM_TOKEN'));

bot.use(session());

bot.command('start', initCommand);
bot.command('balance', getBalance);

bot.on(message('voice'), async (ctx) => {
  try {
    if(ctx.message.from.id !== config.get('MY_ID')) {
      await ctx.reply(code(`Ты не пройдешь!`));
      return;
    }

    await ctx.reply(code('Обработка сообщения.. пару сек..'));
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = String(ctx.message.from.id);
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);
    await removeFile(oggPath);

    const text = await openai.transcription(mp3Path);

    await ctx.reply(text);
  } catch (e) {
    console.log('Error voice:', e.message);
  }
})

bot.on(message('text'), async (ctx) => {
  try {
    if(ctx.message.from.id !== config.get('MY_ID')) {
      await ctx.reply(code(`Ты не пройдешь!`));
      return;
    }

    await ctx.reply(code('я обрабатываю только аудио('));
  } catch (e) {
    console.log('Error text:', e);
  }
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
