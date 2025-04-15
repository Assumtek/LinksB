"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLinks = deleteLinks;
const prisma_1 = require("@/lib/prisma");
const zod_1 = require("zod");
async function deleteLinks(request, reply) {
    const deleteLinkParamsSchema = zod_1.z.object({
        linkId: zod_1.z.string(),
    });
    const { linkId } = deleteLinkParamsSchema.parse(request.body);
    const linkExists = await prisma_1.prisma.links.findUnique({
        where: { id: linkId },
    });
    if (!linkExists) {
        return reply.status(404).send({ error: 'Link não encontrado' });
    }
    await prisma_1.prisma.links.delete({
        where: { id: linkId },
    });
    return reply.status(200).send({ message: 'Link excluído com sucesso' });
}
