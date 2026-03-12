const bot = require('./telegram_bot');

const sendMessage = async (chatId, message) => {
    try {
        await bot.telegram.sendMessage(chatId, message);
        console.log(`Message sent to chat ID ${chatId}`);
    } catch (error) {
        console.error(`Failed to send message to chat ID ${chatId}:`, error);
    }
};

module.exports = {
    sendMessage,
};