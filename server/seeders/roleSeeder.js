const roles = require("./roles.json");
const Role = require("../models/role");

async function seedRole() {
  try {
    const roleBulkOps = roles.map((item) => {
      return {
        updateOne: {
          filter: {
            code: item.code,
          },
          update: {
            $set: {
              ...item,
            },
          },
          upsert: true,
        },
      };
    });
    await Role.bulkWrite(roleBulkOps);
    console.log("role successfully seeded in database!");
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = { seedRole };
