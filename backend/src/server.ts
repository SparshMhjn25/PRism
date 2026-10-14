import express from 'express'; 
import router from './routers/index.js';
const app = express();
app.use(router);

app.listen(process.env.PORT, ()=> console.log("Server started..."));