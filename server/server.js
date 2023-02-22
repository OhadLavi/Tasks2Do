import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import listRoutes from './routes/listRoutes.js';

// Create an instance of the Express application
const app = express();

// Enable CORS with credentials
app.use(cors({ credentials: true }));

// Parse JSON and URL-encoded request bodies
app.use(express.json({ limit: '24mb', extended: true }));
app.use(express.urlencoded({ limit: '24mb', extended: true }));

// Register user, task, and list routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/lists', listRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));

app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
);

// Define a basic route for testing
app.get('/', (req, res) => {
  res.send('Hello world');
});

// Load environment variables from config file
dotenv.config({ path: './config.env' });

// Define the port number to use
const PORT = process.env.PORT || 5000;

// Disable strict mode for queries in Mongoose
mongoose.set('strictQuery', false);

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGO_DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection succesfully');
  })
  .catch((err) => {
    console.log(err);
  });

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
