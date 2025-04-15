"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = deleteCompany;
const prisma_1 = require("@/lib/prisma");
const zod_1 = require("zod");
async function deleteCompany(request, reply) {
    const deleteBodySchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
    });
    const { id } = deleteBodySchema.parse(request.body);
    const company = await prisma_1.prisma.company.findUnique({
        where: { id }
    });
    if (!company) {
        return reply.status(404).send({ error: 'Company not found' });
    }
    await prisma_1.prisma.company.delete({
        where: { id },
    });
    return reply.status(204).send();
}
