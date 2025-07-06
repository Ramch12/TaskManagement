const User = require("../models/user");
const { Project } = require("../models/project");
const { Task } = require("../models/task");

async function seedUserProjectTask() {
  try {
    const userData = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "Test@123",
      mobile: "1234567890"
    };
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = await User.create(userData);
      console.log("User created");
    } else {
      console.log("User already exists");
    }

    const projectsData = [
      {
        title: "Project Alpha",
        description: "First seeded project",
        status: "active",
        createdBy: user._id
      },
      {
        title: "Project Beta",
        description: "Second seeded project",
        status: "active",
        createdBy: user._id
      }
    ];
    const projects = [];
    for (const projData of projectsData) {
      let project = await Project.findOne({ title: projData.title, createdBy: user._id });
      if (!project) {
        project = await Project.create(projData);
        console.log(`Project '${projData.title}' created`);
      } else {
        console.log(`Project '${projData.title}' already exists`);
      }
      projects.push(project);
    }

    const taskTemplates = [
      { title: "Task 1", description: "First task", status: "todo" },
      { title: "Task 2", description: "Second task", status: "in-progress" },
      { title: "Task 3", description: "Third task", status: "done" }
    ];
    for (const project of projects) {
      for (const tmpl of taskTemplates) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // 1 week from now
        let task = await Task.findOne({ title: tmpl.title, projectId: project._id });
        if (!task) {
          await Task.create({
            ...tmpl,
            dueDate,
            projectId: project._id,
            createdBy: user._id
          });
          console.log(`Task '${tmpl.title}' created for project '${project.title}'`);
        } else {
          console.log(`Task '${tmpl.title}' already exists for project '${project.title}'`);
        }
      }
    }
    console.log("User, projects, and tasks seeded successfully!");
  } catch (error) {
    console.error("Error seeding user, projects, and tasks:", error);
  }
}

module.exports = { seedUserProjectTask }; 