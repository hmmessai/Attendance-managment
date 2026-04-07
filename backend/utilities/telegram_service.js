const bot = require('./telegram_bot');

const sendMessage = async (chatId, message) => {
    try {
        await bot.telegram.sendMessage(chatId, message);
        console.log(`Message sent to chat ID ${chatId}`);
    } catch (error) {
        console.error(`Failed to send message to chat ID ${chatId}:`, error);
    }
};

function toEthiopianDate(gregDate) {
    const date = new Date(gregDate);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const jd =
        Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
        Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
        Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) +
        day - 32075;

    const r = (jd - 1723856) % 1461;
    const n = r % 365 + 365 * Math.floor(r / 1460);

    const ethYear = 4 * Math.floor((jd - 1723856) / 1461) +
        Math.floor(r / 365) - Math.floor(r / 1460);

    const ethMonth = Math.floor(n / 30) + 1;
    const ethDay = (n % 30) + 1;

    return {
        year: ethYear,
        month: ethMonth,
        day: ethDay
    };
}

module.exports = {
    sendMessage,
    toEthiopianDate
};