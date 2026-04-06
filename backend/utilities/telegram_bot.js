require("dotenv").config();
const bcrypt = require("bcrypt");
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

bot.action("STUDENT", async (ctx) => {
  ctx.editMessageText("በሰንበት ት/ቤቱ ውስጥ ትምህርት የሚክታተሉበትን ጉባኤ ይምረጡ",
    Markup.keyboard(
      [Markup.button.callback("BACK", "Subscribe")],
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [ማዕከላዊ, ሳልሳይ, ካልዐይ, ቀዳማይ]
    )
  )
})

// Inline button actions
bot.action("PARENT", async (ctx) => {
  ctx.editMessageText("Choose the grade of your child:",
    Markup.inlineKeyboard([
    [Markup.button.callback("BACK", "Subscribe")],
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

const gradeMap = {
  "1": "1ኛ ክፍል",
  "2": "2ኛ ክፍል",
  "3": "3ኛ ክፍል",
  "4": "4ኛ ክፍል",
  "5": "5ኛ ክፍል",
  "6": "6ኛ ክፍል",
  "7": "7ኛ ክፍል",
  "8": "8ኛ ክፍል",
  "9": "9ኛ ክፍል",
  "10": "10ኛ ክፍል",
  "11": "ዮሐንስ ቀዳማይ",
  "12": "ዮሐንስ ካልዐይ"
};

bot.action(/GRADE_\d+/, async (ctx) => {
  try {
    const grade = ctx.callbackQuery.data;
    const [, gradeNumber] = grade.split("_");

    const sectionValue = gradeMap[gradeNumber];

    if (!sectionValue) {
      await ctx.answerCbQuery();
      return ctx.editMessageText("Invalid grade selected.");
    }

    const students = await Student.find({ section: sectionValue });

    if (!students.length) {
      await ctx.answerCbQuery();
      return ctx.editMessageText(`No students found in ${sectionValue}`);
    }

    const keyboard = Markup.inlineKeyboard(
      students.map(s => [
        Markup.button.callback("BACK", "PARENT"),
        Markup.button.callback(s.name, `STUDENT_${s._id}`)
      ])
    );

    await ctx.answerCbQuery();
    await ctx.editMessageText(
      "Choose the name of your child from the list:",
      keyboard
    );
  } catch (err) {
    console.error(err);
    await ctx.editMessageText("Something went wrong while fetching students.");
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
      return ctx.editMessageText("Student not found.");
    }
    const userExists = await User.findOne({ email: `${ctx.from.id}@hass.et` });
    if (userExists) {
      if (!userExists.student_id.includes(student._id)) {
        userExists.student_id.push(student._id);
        await userExists.save();
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ctx.from.username || " ", salt);
      const user = await User.create({
        "name": ctx.from.first_name || ctx.from.id,
        "email": `${ctx.from.id}@hass.et`,
        "password": hashedPassword,
        "telegram_id": ctx.chat.id,
      });
      user.student_id.push(student._id);
      await user.save();
    }

    await ctx.answerCbQuery();
    await ctx.editMessageText(`You have successfully subscribed to updates regarding ${student.name} 🚀
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
