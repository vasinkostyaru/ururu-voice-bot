import OpenAI from "openai";
import config from "config";
import { createReadStream } from "fs";

class OpenAIClass {
  roles = {
    ASSISTANT: 'assistant',
    USER: 'user',
    SYSTEM: 'system',
  }

  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey,
      baseURL: 'https://api.proxyapi.ru/openai/v1'
    });
  }

  async transcription(filepath) {
    try {
      const response = await this.openai.audio.transcriptions.create({
        file: createReadStream(filepath),
        model: 'whisper-1'
      });

      return response.text;
    } catch (e) {
      console.log('Error while transcription', e.message)
    }
  }
}
export const openai = new OpenAIClass(config.get('OPENAI_KEY'))
