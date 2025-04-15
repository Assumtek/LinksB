"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const env_1 = require("@/env");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient({
    log: env_1.env.NODE_ENV === 'dev' ? ['query'] : [],
});
