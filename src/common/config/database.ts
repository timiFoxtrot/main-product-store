import mongoose from 'mongoose';

async function connect() {
  try {
    console.log('Db trying to connect');
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log('DB connected');
  } catch (error) {
    console.log({ error });
    console.log('Could not connect to db');
    process.exit(1);
  }
}

export default connect;
