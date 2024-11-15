// включения алиаса
require("module-alias/register");
const express = require("express");
const sequelize = require("@config/database");
const { Op } = require("sequelize");
const { Lesson, Teacher, Student } = require("@models/index.js");

const app = express();
app.use(express.json());

app.get("/lessons", async (req, res) => {
  try {
    const {
      date,
      status,
      teacherIds,
      studentsCount,
      page = 1,
      lessonsPerPage = 5,
    } = req.query;

    // Условия фильтрации
    let where = {};
    const include = [
      {
        model: Student,
        through: {
          attributes: ["visit"],
        },
      },
    ];

    if (date) {
      const dates = date.split(",");

      if (dates.length === 1) {
        where.date = dates[0];
      } else if (dates.length === 2) {
        where.date = { [Op.between]: dates };
      } else {
        return res
          .status(400)
          .json({ error: "Некорректный формат параметра date" });
      }
    }

    // Фильтруем по статусу
    if (status) {
      if (status !== "0" && status !== "1") {
        return res.status(400).json({ error: "Некорректный параметр status" });
      }
      where.status = +status;
    }

    // Фильтруем по учителям
    if (teacherIds) {
      const teacherIdsList = teacherIds.split(",").map((id) => +id);
      // если хотя бы один id не валиден
      if (teacherIdsList.some(isNaN)) {
        return res
          .status(400)
          .json({ error: "Некорректный параметр teacherIds" });
      }

      include.push({
        model: Teacher,
        where: {
          id: teacherIdsList, // фильтрация по списку ID учителей
        },
        through: {
          attributes: [],
        },
      });
    } else {
      include.push({
        model: Teacher,
        through: {
          attributes: [],
        },
      });
    }

    // studentsCount Не получилось реализовать!

    // const studentsCountList = studentsCount.split(",").map((c) => +c);

    //   if (studentsCountList.some(isNaN) || studentsCountList.length > 2) {
    //     return res
    //       .status(400)
    //       .json({ error: "Некорректный параметр studentsCount" });
    //   }

    // Пагинация
    const limit = parseInt(lessonsPerPage, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    let que = {
      where,
      include: include,
      limit,
      offset,
    };

    const lessons = await Lesson.findAll(que);
    res.setHeader('Content-Type', 'application/json')
    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Подключение к базе данных и запуск сервера
sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Сервер запущен на порту 3000!");
    });
  })
  .catch((err) => {
    console.error("Ошибка соединения с бд:", err);
  });
