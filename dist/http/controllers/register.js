"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const config_1 = require("@/config");
const prisma_1 = require("@/lib/prisma");
async function register(request, reply) {
    if (!request.isMultipart()) {
        return reply.status(400).send({ message: 'Requisição não é multipart.' });
    }
    try {
        const parts = request.parts();
        const data = {};
        let fileBuffer;
        for await (const part of parts) {
            if (part.type === 'field') {
                data[part.fieldname] = String(part.value);
            }
            else if (part.fieldname === 'logo' && part.type === 'file') {
                const file = part;
                fileBuffer = await file.toBuffer();
            }
        }
        if (!fileBuffer) {
            return reply.status(400).send({ message: 'Nenhuma imagem enviada no campo "logo".' });
        }
        let imageUrl;
        await new Promise((resolve, reject) => {
            config_1.cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) {
                    console.error('Erro ao fazer upload para o Cloudinary:', error);
                    return reject(error);
                }
                imageUrl = result?.secure_url;
                resolve();
            }).end(fileBuffer);
        });
        if (!imageUrl) {
            return reply.status(500).send({ message: 'Falha ao obter URL da imagem.' });
        }
        // Salva no banco de dados
        const company = await prisma_1.prisma.company.create({
            data: {
                name: data.name,
                logo: imageUrl,
                description: data.description,
                subname: data.subname || "",
                instagram: data.instagram || "",
                linkedin: data.linkedin || "",
                whatsapp: data.whatsapp || "",
                email: data.email || "",
            }
        });
        return reply.status(201).send(company);
    }
    catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return reply.status(500).send({ message: 'Erro ao processar a requisição.' });
    }
}
