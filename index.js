import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import routes from './app.js';
import dotenv from 'dotenv';
import cors from 'cors'

const app = express()
const port = 3000
dotenv.config();
app.get('/', (req, res) => {
  res.send('Hello World!')
})

mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB successfully');
  app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});




app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/',routes)