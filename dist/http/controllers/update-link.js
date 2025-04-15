"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLinks = updateLinks;
const prisma_1 = require("@/lib/prisma");
const zod_1 = require("zod");
async function updateLinks(request, reply) {
    const updateLinkParamsSchema = zod_1.z.object({
        linkId: zod_1.z.string(),
    });
    const updateLinkBodySchema = zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        url: zod_1.z.string().optional(),
        icon_url: zod_1.z.string().optional(),
        order: zod_1.z.number().optional(),
    });
    const { linkId } = updateLinkParamsSchema.parse(request.params);
    const updateData = updateLinkBodySchema.parse(request.body);
    console.log(updateData);
    const linkExists = await prisma_1.prisma.links.findUnique({
        where: { id: linkId },
    });
    if (!linkExists) {
        return reply.status(404).send({ error: 'Link não encontrado' });
    }
    const updatedLink = await prisma_1.prisma.links.update({
        where: { id: linkId },
        data: updateData,
    });
    return reply.status(200).send(updatedLink);
}
