import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import routes from './app.js';

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

async function main() {
    try {
        await mongoose.connect('mongodb+srv://gopikamurali8089:2RY4HuEphw0ONcMu@cluster0.mpf2v.mongodb.net/myDatabase?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
main()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
 
})

app.use(express.json());
app.use(cookieParser());
app.use('/',routes)