import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

const app = express();
app.use(express.json())
// ----------------
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())

app.use(helmet());
const allowed_origins = [config.security.cors_origin];

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
    console.log(`Server running at http://localhost:${config.PORT}`);
}

databaseService.connect()
.then(()=>{
    app.listen(config.PORT,onListening);
}).catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
})