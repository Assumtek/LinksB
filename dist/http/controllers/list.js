"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCompany = listCompany;
const prisma_1 = require("../../lib/prisma");
const zod_1 = require("zod");
async function listCompany(request, reply) {
    console.log("Começou");
    const listBodySchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
    });
    try {
        const { id } = listBodySchema.parse(request.body); // Valida o corpo da requisição
        const company = await prisma_1.prisma.company.findUnique({
            where: { id },
            select: {
                name: true,
                description: true,
                logo: true,
                id: true,
                email: true,
                instagram: true,
                subname: true,
                linkedin: true,
                whatsapp: true,
                Links: {
                    orderBy: {
                        order: 'asc', // Ordena os links por 'order' em ordem crescente
                    },
                },
            }
        });
        if (!company) {
            return reply.status(404).send({ error: 'Company not found' });
        }
        console.log(company);
        return reply.status(200).send(company); // Envia a empresa no corpo da resposta
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return reply.status(400).send({ error: 'Invalid request body' }); // Erro de validação do schema
        }
        return reply.status(500).send({ error: 'Internal server error' }); // Outros erros
    }
}
