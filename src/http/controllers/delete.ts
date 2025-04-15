import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function deleteCompany(request: FastifyRequest, reply: FastifyReply) {
  const deleteBodySchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteBodySchema.parse(request.body)

  const company = await prisma.company.findUnique({
    where: { id }
  })

  if (!company) {
    return reply.status(404).send({ error: 'Company not found' })
  }

  await prisma.company.delete({
    where: { id },
  })

  return reply.status(204).send()
}