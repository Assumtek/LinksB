import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function updateLinks(request: FastifyRequest, reply: FastifyReply) {
  const updateLinkParamsSchema = z.object({
    linkId: z.string(),
  });

  const updateLinkBodySchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    icon_url: z.string().optional(),
    order: z.number().optional(),
  });

  const { linkId } = updateLinkParamsSchema.parse(request.params);
  const updateData = updateLinkBodySchema.parse(request.body);
  console.log(updateData)

  const linkExists = await prisma.links.findUnique({
    where: { id: linkId },
  });

  if (!linkExists) {
    return reply.status(404).send({ error: 'Link não encontrado' });
  }

  const updatedLink = await prisma.links.update({
    where: { id: linkId },
    data: updateData,
  });

  return reply.status(200).send(updatedLink);
}