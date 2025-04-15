"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors")); // Importe o plugin CORS
const register_1 = require("./http/controllers/register");
const delete_1 = require("./http/controllers/delete");
const update_1 = require("./http/controllers/update");
const list_1 = require("./http/controllers/list");
const create_link_1 = require("./http/controllers/create-link");
const delete_link_1 = require("./http/controllers/delete-link");
const update_link_1 = require("./http/controllers/update-link");
const multipart_1 = __importDefault(require("@fastify/multipart")); // Importe o plugin multipart
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env"); // Certifique-se de que seu env.ts carrega as variáveis de ambiente
const registerCompany_1 = require("./http/controllers/registerCompany");
exports.app = (0, fastify_1.default)();
cloudinary_1.v2.config({
    cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.env.CLOUDINARY_API_KEY,
    api_secret: env_1.env.CLOUDINARY_API_SECRET,
});
exports.app.register(cors_1.default, {
    origin: true, // Ou true para permitir todas as origens (não recomendado para produção)
});
exports.app.register(multipart_1.default, {
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
    },
});
exports.app.get("/", (request, reply) => {
    return reply.send(`
    <h1 style='font-family: sans-serif'>
        API do Sistema de vagas ASSUMTEK!!!
    <h1>
  `);
});
exports.app.post('/uploadimagem', registerCompany_1.enviarImagem);
exports.app.post('/panel', register_1.register);
exports.app.delete('/panel', delete_1.deleteCompany);
exports.app.post('/editcompany', update_1.updateCompany);
exports.app.post('/empresa', list_1.listCompany);
exports.app.post('/links', create_link_1.createLinks);
exports.app.post('/linksdelete', delete_link_1.deleteLinks);
exports.app.patch('/links', update_link_1.updateLinks);
