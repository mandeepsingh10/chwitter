import type { PrismaClient } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";
export declare function PrismaAdapter(p: PrismaClient): Adapter;
