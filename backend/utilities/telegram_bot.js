import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.TG_BOT_TOKEN;

export const sendTelegramMessage = async (chatId, text) => {
  await axios.post(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      chat_id: chatId,
      text: text
    }
  );
};
