"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompany = updateCompany;
const prisma_1 = require("@/lib/prisma");
const zod_1 = require("zod");
async function updateCompany(request, reply) {
    const updateBodySchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string().optional(),
        logo: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        subname: zod_1.z.string().optional(),
        instagram: zod_1.z.string().optional(),
        linkedin: zod_1.z.string().optional(),
        whatsapp: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        links: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string().uuid().optional(),
            title: zod_1.z.string().optional(),
            description: zod_1.z.string().optional(),
            url: zod_1.z.string().optional(),
            icon_url: zod_1.z.string().optional(),
            order: zod_1.z.number().optional(),
        })).optional(),
    });
    const { id, name, logo, description, links, subname, instagram, linkedin, whatsapp, email } = updateBodySchema.parse(request.body);
    // Verificar se a empresa existe
    const company = await prisma_1.prisma.company.findUnique({
        where: { id },
    });
    if (!company) {
        return reply.status(404).send({ error: 'Company not found' });
    }
    // Atualizar a empresa
    const updatedCompany = await prisma_1.prisma.company.update({
        where: { id },
        data: {
            name,
            logo,
            description,
            subname,
            instagram,
            linkedin,
            whatsapp,
            email,
        },
    });
    // Atualizar os links
    if (links) {
        for (const link of links) {
            if (link.id) {
                // Atualizar link existente
                await prisma_1.prisma.links.update({
                    where: { id: link.id },
                    data: {
                        title: link.title,
                        description: link.description,
                        url: link.url,
                        icon_url: link.icon_url,
                        order: link.order,
                    },
                });
            }
            else {
                // Criar novo link
                await prisma_1.prisma.links.create({
                    data: {
                        title: link.title ?? '',
                        description: link.description ?? '',
                        url: link.url ?? '',
                        icon_url: link.icon_url ?? '',
                        order: link.order ?? 0,
                        company_id: id,
                    },
                });
            }
        }
    }
    return reply.status(200).send(updatedCompany);
}
