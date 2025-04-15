import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function updateCompany(request: FastifyRequest, reply: FastifyReply) {
  const updateBodySchema = z.object({
    id: z.string().uuid(),
    name: z.string().optional(),
    logo: z.string().optional(),
    description: z.string().optional(),
    subname: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().optional(),

    links: z.array(z.object({
      id: z.string().uuid().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      url: z.string().optional(),
      icon_url: z.string().optional(),
      order: z.number().optional(),
    })).optional(),
  });

  const { id, name, logo, description, links, subname, instagram, linkedin, whatsapp, email } = updateBodySchema.parse(request.body);

  // Verificar se a empresa existe
  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (!company) {
    return reply.status(404).send({ error: 'Company not found' });
  }

  // Atualizar a empresa
  const updatedCompany = await prisma.company.update({
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
        await prisma.links.update({
          where: { id: link.id },
          data: {
            title: link.title,
            description: link.description,
            url: link.url,
            icon_url: link.icon_url,
            order: link.order,
          },
        });
      } else {
        // Criar novo link
        await prisma.links.create({
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