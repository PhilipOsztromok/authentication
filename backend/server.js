import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet'
import config from './config/config.js';
import databaseService from './services/database_services.js';
import router from './router/api_router.js';


const app = express();
app.use(express.json())
// ----------------
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())

app.use(helmet());
const allowed_origins = [config.security.corsOrigin];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowed_origins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use('/api/v1', router)

app.get('/',(req,res)=>{
    return res
    .status(200)
    .json({
        success: true,
        message: "Server is running up!"
    })
})

const onListening = () => {
    console.log(`Server running at http://localhost:${config.server.port}`);
}

databaseService.connect()
.then(()=>{
    app.listen(config.PORT,onListening);
}).catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
})