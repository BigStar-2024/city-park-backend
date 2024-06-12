import express, { Application } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import http from 'http'
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import connectToMongodb from './db/mongodb';
import { authEndUserMiddleware, authSenderMiddleware } from './middleware/auth';
import endUserRouter from './routers/end';
import senderRouter from './routers/sender';
import payingAppRouter from './routers/payingapp';
import paymentLog from './models/paymentLog';
dotenv.config();
connectToMongodb()

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(morgan('dev'))
app.use(express.json());
app.use(cors());
// Use CORS middleware 
  app.use(cors({
    origin: ['http://localhost:3000', 'https://car-park-payingapp-front.vercel.app/', 'https://park-charge-management-front.vercel.app/'],// Replace with your client's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

endUserRouter.use('/public', express.static(path.join(__dirname, process.env.NODE_ENV === "production" ? '../public' : 'public')))
const mainRouter = express.Router();
mainRouter.use('/end-user', authEndUserMiddleware, endUserRouter)
mainRouter.use('/sender', authSenderMiddleware, senderRouter)
mainRouter.use('/payingapp', payingAppRouter)
app.use(process.env.NODE_ENV === "production" ? '/city-park-lot/api' : '/', mainRouter)

app.get('/city-park-lot/api/end-user/getPassDataCount', async (req, res) => {
    // console.log("getPassDataCount");
    try {

        await mongoose.connect(process.env.MONGO_URI || "");

        const myCollection = mongoose.model('Data');
        const documentCount = await myCollection.countDocuments({});
        console.log("getPassDataCount", documentCount);
        res.json(documentCount);        
    } catch (error: any) {
        console.log(`Error connecting to DB: ${(error).message}`);
        res.status(500).send('Internal Server Error');
        process.exit(1);
    }
});

app.get('/city-park-lot/api/end-user/getPaidData', async (req, res) => {
    // console.log("getPassDataCount");
    try {
        const paidData = await paymentLog.find({});

        res.json(paidData);        
    } catch (error: any) {
        console.log(`Error connecting to DB: ${(error).message}`);
        res.status(500).send('Internal Server Error');
        process.exit(1);
    }
});

app.post('/city-park-lot/api/violation/list-save', async (req, res) => {
    // console.log("getPassDataCount");
    try {
        console.log("volation😂")     
    } catch (error: any) {
        console.log(`Error😢`);
    }
});

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO server with CORS
const io = new Server(server, {
  cors: {
    origin: 'https://city-park-lot.run.place', // Replace with your client's origin
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('send_message', (message: string) => {
        io.emit('receive_message', message);
    });
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


export{ io };