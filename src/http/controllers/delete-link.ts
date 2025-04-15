import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function deleteLinks(request: FastifyRequest, reply: FastifyReply) {
  const deleteLinkParamsSchema = z.object({
    linkId: z.string(),
  });

  const { linkId } = deleteLinkParamsSchema.parse(request.body);

  const linkExists = await prisma.links.findUnique({
    where: { id: linkId },
  });

  if (!linkExists) {
    return reply.status(404).send({ error: 'Link não encontrado' });
  }

  await prisma.links.delete({
    where: { id: linkId },
  });

  return reply.status(200).send({ message: 'Link excluído com sucesso' });
}