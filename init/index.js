const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/homeaway";

main()
  .then(() => {
    console.log("Connected with DB");
    initDB(); // Call initDB here
  })
  .catch((err) => {
    console.error(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    const updatedData = initData.data.map((object) => ({
      ...object,
      owner: new mongoose.Types.ObjectId("678932bf03b75c6faae0e348"), // Use 'new' here
    }));
    await Listing.insertMany(updatedData);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};

initDB();
