const { seedRole } = require("./roleSeeder");
const { seedUserProjectTask } = require("./userProjectTaskSeeder");
const initSeed = async () => {
  try {
    await seedRole();
    await seedUserProjectTask();
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = {
  initSeed,
};
