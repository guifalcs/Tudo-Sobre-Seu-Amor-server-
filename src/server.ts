import express from "express";
import cors from 'cors';
import router from "./router";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const port = process.env.SERVER_PORT || 8081;

app.use(cors())
app.use(express.json())
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });