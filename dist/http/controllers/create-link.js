"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLinks = createLinks;
const config_1 = require("@/config");
const prisma_1 = require("@/lib/prisma");
async function createLinks(request, reply) {
    if (!request.isMultipart()) {
        return reply.status(400).send({ message: 'Requisição não é multipart.' });
    }
    try {
        const parts = request.parts();
        const data = {};
        let iconBuffer;
        for await (const part of parts) {
            if (part.type === 'field') {
                data[part.fieldname] = String(part.value);
            }
            else if (part.fieldname === 'icon' && part.type === 'file') {
                const file = part;
                iconBuffer = await file.toBuffer();
            }
        }
        if (!iconBuffer) {
            return reply.status(400).send({ message: 'Nenhuma imagem enviada no campo "icon".' });
        }
        // Upload da imagem do ícone
        let iconUrl;
        await new Promise((resolve, reject) => {
            config_1.cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) {
                    console.error('Erro ao fazer upload do ícone:', error);
                    return reject(error);
                }
                iconUrl = result?.secure_url;
                resolve();
            }).end(iconBuffer);
        });
        if (!iconUrl) {
            return reply.status(500).send({ message: 'Erro ao obter URL do ícone.' });
        }
        // Verificação se empresa existe
        const company = await prisma_1.prisma.company.findUnique({
            where: { id: data.companyId },
        });
        if (!company) {
            return reply.status(404).send({ error: 'Empresa não encontrada' });
        }
        const order = parseInt(data.order || "0");
        const link = await prisma_1.prisma.links.create({
            data: {
                title: data.title,
                description: data.description,
                url: data.url,
                icon_url: iconUrl,
                order,
                company_id: data.companyId,
            }
        });
        return reply.status(201).send(link);
    }
    catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return reply.status(500).send({ message: 'Erro ao processar a requisição.' });
    }
}
