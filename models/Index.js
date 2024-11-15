const { DataTypes } = require("sequelize");
const sequelize = require("@config/database");

const Lesson = sequelize.define(
  "lessons",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const LessonStudent = sequelize.define(
  "lesson_students",
  {
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

const LessonTeacher = sequelize.define(
  "lesson_teachers",
  {
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Student = sequelize.define(
  "students",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Teacher = sequelize.define(
  "teachers",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Lesson.belongsToMany(Teacher, {
  through: "lesson_teachers",
  foreignKey: "lesson_id",
  otherKey: "teacher_id",
});

Teacher.belongsToMany(Lesson, {
  through: "lesson_teachers",
  foreignKey: "teacher_id",
  otherKey: "lesson_id",
});

Lesson.belongsToMany(Student, {
  through: "lesson_students",
  foreignKey: "lesson_id",
  otherKey: "student_id",
});

Student.belongsToMany(Lesson, {
  through: "lesson_students",
  foreignKey: "student_id",
  otherKey: "lesson_id",
});


module.exports = {
  Lesson,
  LessonStudent,
  LessonTeacher,
  Student,
  Teacher,
};
