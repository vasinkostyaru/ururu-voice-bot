import config from "config";
import axios from 'axios';
import { code } from "telegraf/format";

export async function initCommand(ctx) {
  await ctx.reply('Пришли мне аудио и я его расшифрую в текст!');
}

export const getBalance = async (ctx) => {
  await ctx.reply(code(`загрузка баланса..`));
  try {
    const response = await axios.get('https://api.proxyapi.ru/proxyapi/balance', {
      headers: {
        Authorization: `Bearer ${config.get('OPENAI_KEY')}`
      }
    });
    await ctx.reply(code(`Баланс: ${response.data.balance.toFixed(2)} ₽`));
  } catch (error) {
    console.error(error.message);
  }
};
