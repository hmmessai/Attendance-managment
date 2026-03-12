require("dotenv").config(); // load .env
const { Telegraf, Markup } = require("telegraf");
const Student = require("../Models/Student");

// Create bot instance
const bot = new Telegraf(process.env.TG_BOT_TOKEN);

// Commands
bot.command("chatid", (ctx) => {
  ctx.reply(`Your chat ID is: ${ctx.chat.id}`);
});

// Start command with inline buttons
bot.start((ctx) => {
  ctx.reply(
    "Welcome! Choose an option:",
    Markup.keyboard([
      ["Subscribe", "Help"],   // first row
      ["Settings", "About"] // second row
    ])
      .resize() // makes buttons smaller
      .oneTime(false) // set false if you want them permanent
  );
});

bot.hears("Subscribe", (ctx) => {
  const chat_id = ctx.chat.id;
  ctx.reply("Please choose the method of your subscription:",
  Markup.inlineKeyboard([
    Markup.button.callback("Parent/Guardian", "PARENT"),
    Markup.button.callback("Student", "STUDENT")
  ]));
})

// Inline button actions
bot.action("PARENT", async (ctx) => {
  ctx.reply("Choose the grade of your child:",
    Markup.inlineKeyboard([
    [
      Markup.button.callback("Grade 1", "GRADE_1"),
      Markup.button.callback("Grade 2", "GRADE_2"),
      Markup.button.callback("Grade 3", "GRADE_3"),
      Markup.button.callback("Grade 4", "GRADE_4"),
    ],
    [
      Markup.button.callback("Grade 5", "GRADE_5"),
      Markup.button.callback("Grade 6", "GRADE_6"),
      Markup.button.callback("Grade 7", "GRADE_7"),
      Markup.button.callback("Grade 8", "GRADE_8")
    ],
    [
      Markup.button.callback("Grade 9", "GRADE_9"),
      Markup.button.callback("Grade 10", "GRADE_10"),
      Markup.button.callback("Grade 11", "GRADE_11"),
      Markup.button.callback("Grade 12", "GRADE_12")
    ]
    ]))
});

bot.action(/GRADE_\d+/, async (ctx) => {
  const grade = ctx.callbackQuery.data; // e.g., "GRADE_5"
  
  // Call backend function
  const students = await Student.find({"section": grade.split("_")[1]})

  await ctx.answerCbQuery();
  await ctx.reply(`Grade ${grade.split("_")[1]}`, students.map((s) => Markup.button.callback(s.name, `STUDENT_${s._id}`)));
});

bot.action(/STUDENT_\w+/, async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("All systems operational 🚀");
});

bot.action("HELP", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("Available commands are /chatid and /start 🚀");
});


// Export the bot instance
module.exports = bot;
