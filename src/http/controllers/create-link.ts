import { FastifyRequest, FastifyReply } from 'fastify';
import { cloudinary } from '@/config';
import { MultipartFile } from '@fastify/multipart';
import { prisma } from '@/lib/prisma';

export async function createLinks(request: FastifyRequest, reply: FastifyReply) {
  if (!request.isMultipart()) {
    return reply.status(400).send({ message: 'Requisição não é multipart.' });
  }

  try {
    const parts = request.parts();
    const data: Record<string, string> = {};
    let iconBuffer: Buffer | undefined;

    for await (const part of parts) {
      if (part.type === 'field') {
        data[part.fieldname] = String(part.value);
      } else if (part.fieldname === 'icon' && part.type === 'file') {
        const file = part as MultipartFile;
        iconBuffer = await file.toBuffer();
      }
    }

    if (!iconBuffer) {
      return reply.status(400).send({ message: 'Nenhuma imagem enviada no campo "icon".' });
    }

    // Upload da imagem do ícone
    let iconUrl: string | undefined;

    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.error('Erro ao fazer upload do ícone:', error);
            return reject(error);
          }

          iconUrl = result?.secure_url;
          resolve();
        }
      ).end(iconBuffer);
    });

    if (!iconUrl) {
      return reply.status(500).send({ message: 'Erro ao obter URL do ícone.' });
    }

    // Verificação se empresa existe
    const company = await prisma.company.findUnique({
      where: { id: data.companyId },
    });

    if (!company) {
      return reply.status(404).send({ error: 'Empresa não encontrada' });
    }

    const order = parseInt(data.order || "0");

    const link = await prisma.links.create({
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        icon_url: iconUrl,
        order,
        company_id: data.companyId,
      }
    });

    return reply.status(201).send(link);

  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    return reply.status(500).send({ message: 'Erro ao processar a requisição.' });
  }
}
