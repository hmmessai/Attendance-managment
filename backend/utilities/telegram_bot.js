require("dotenv").config(); // load .env
const { Telegraf, Markup } = require("telegraf");
const Student = require("../Models/Student");
const User = require("../Models/User");

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
  try {
    const grade = ctx.callbackQuery.data; // e.g., "GRADE_5"
    const [, gradeNumber] = grade.split("_"); // gets "5"

    // Fetch students from DB
    const students = await Student.find({ section: gradeNumber });

    if (students.length === 0) {
      await ctx.answerCbQuery();
      return ctx.reply(`No students found in Grade ${gradeNumber}`);
    }

    // Create inline keyboard
    const buttons = students.map(s =>
      Markup.button.callback(s.name, `STUDENT_${s._id}`)
    );

    const keyboard = Markup.inlineKeyboard(
      buttons.map(b => [b]) // each button on a separate row
    );

    await ctx.answerCbQuery();
    await ctx.reply(`Choose the name of your child from the list:`, keyboard);
  } catch (err) {
    console.error(err);
    await ctx.reply("Something went wrong while fetching students.");
  }
});

bot.action(/STUDENT_\w+/, async (ctx) => {
  try {
    const studentdata = ctx.callbackQuery.data;
    const [, studentId] = studentdata.split("_"); // gets the student ID

    // Fetch the student from the database
    const student = await Student.findById(studentId);

    if (!student) {
      await ctx.answerCbQuery();
      return ctx.reply("Student not found.");
    }
    const userExists = await User.findOne({ email: `${ctx.from.id}@hass.et` });
    if (userExists) {
      if (!userExists.student_id.includes(student._id)) {
        userExists.student_id.push(student._id);
        await userExists.save();
      }
    } else {
      const user = await User.create({
        "name": ctx.from.first_name || ctx.from.id,
        "email": `${ctx.from.id}@hass.et`,
        "password": ctx.from.username || " ",
        "telegram_id": ctx.chat.id,
      });
      user.student_id.push(student._id);
      await user.save();
    }

    await ctx.answerCbQuery();
    await ctx.reply(`You have successfully subscribed to updates regarding ${student.name} 🚀
      የመርሃ ግብር ለውጦች ሲኖሩ እንዲሁም ከልጅዎ ጋር በተያያዘ ጉዳይ ማስተላለፍ የምንፈልገው መልእክት ሲኖር በዚህ የምናሳውቅ ይሆናል።
      ከታች ባሉት ኢሜይልና ፓስወርድ በመጠቀም በድረ ገጻችን ላይ ገብተው የልጅዎን ሙሉ መረጃ ማግኘት ይችላሉ።
      email: ${ctx.from.id}@hass.et
      password: ${ctx.from.username || " "}`
    );
  } catch (err) {
    console.error(err);
    await ctx.reply("Something went wrong while subscribing.");
  }
  
});

bot.action("HELP", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("Available commands are /chatid and /start 🚀");
});


// Export the bot instance
module.exports = bot;
