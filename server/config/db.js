const mongoose = require("mongoose");
const { initSeed } = require("../seeders/index");
console.log('`mongodb://${process.env.dbhost}/${process.env.db}', `mongodb://${process.env.dbhost}/${process.env.db}`);

mongoose
  .connect(`mongodb://${process.env.dbhost}/${process.env.db}`)
  .then(() => {
    initSeed()
      .then(() => {
        console.log("seeder operation successfully completed!");
      })
      .catch(() => {
        console.log("Error while seeding");
      });
  })
  .catch((error) => {
    console.log("Error", error);
    process.exit(1);
  });
