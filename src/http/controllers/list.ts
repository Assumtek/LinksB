import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from "../../lib/prisma"
import { z } from "zod"




export async function listCompany(request: FastifyRequest, reply: FastifyReply) {

  console.log("Começou");
  const listBodySchema = z.object({
    name: z.string(),
  })
  

  try {
    const { name }  = listBodySchema.parse(request.body); // Valida o corpo da requisição

    console.log("Pegando informações da empresa")
    console.log("Nome enviado", name)

    const company = await prisma.company.findFirst({
      where: { name:name },
      select:{
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

    console.log("Empresa achada", company)

    if (!company) {
      console.log("Erro ao achar empresa")
      return reply.status(404).send({ error: 'Company not found' });
    }

    console.log(company);

    return reply.status(200).send(company); // Envia a empresa no corpo da resposta
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: 'Invalid request body' }); // Erro de validação do schema
    }
    return reply.status(500).send({ error: 'Internal server error' }); // Outros erros
  }
}