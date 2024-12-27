import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.DB_URI, {
      dbName: "fxglobal",
    });

    console.log(
      `DB is connected to : "${db.connections[0].host}" and DB port is : ${db.connections[0].port}`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
