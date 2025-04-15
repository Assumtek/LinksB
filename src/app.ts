import fastify from "fastify"
import cors from '@fastify/cors' // Importe o plugin CORS
import { register } from "./http/controllers/register"
import { deleteCompany } from "./http/controllers/delete"
import { updateCompany } from "./http/controllers/update"
import { listCompany } from "./http/controllers/list"

import { createLinks } from "./http/controllers/create-link"
import { deleteLinks } from "./http/controllers/delete-link"
import { updateLinks } from "./http/controllers/update-link"

import multipart from '@fastify/multipart'; // Importe o plugin multipart

import { v2 as cloudinary } from 'cloudinary';
import { env } from './env'; // Certifique-se de que seu env.ts carrega as variáveis de ambiente

import { enviarImagem } from "./http/controllers/registerCompany"



export const app = fastify()

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

app.register(cors, {
  origin: true, // Ou true para permitir todas as origens (não recomendado para produção)
})

app.register(multipart, {
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
})


app.post('/uploadimagem', enviarImagem);

app.post('/panel', register)
app.delete('/panel', deleteCompany)
app.post('/editcompany', updateCompany)
app.post('/empresa', listCompany)

app.post('/links', createLinks)
app.post('/linksdelete', deleteLinks)
app.patch('/links', updateLinks)