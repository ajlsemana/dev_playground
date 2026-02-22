import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RulesService } from '../rules/rules.service';
import { PdfService } from '../pdf/pdf.service';

import { generateNoticeHTML } from '../pdf/templates/notice.template';

@Injectable()
export class CasesService {

    constructor(private prisma: PrismaService,
        private rules: RulesService,
        private pdf: PdfService) {
        //code here
    }

    async getAllCases() {
        return this.prisma.case.findMany({
            include: {
                customer: true,
                loan: true,
            }
        });
    }

    async getCaseById(id: number) {
        const caseData = await this.prisma.case.findUnique({
            where: { id },
            include: {
                customer: true,
                loan: true,
                actions: {
                    orderBy: { createdAt: 'desc' },
                },
                ruleDecisions: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!caseData) {
            throw new NotFoundException('Case not found');
        }

        return caseData;
    }

    async listCases(query: any) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (query.status) where.status = query.status;
        if (query.stage) where.stage = query.stage;
        if (query.assignedTo) where.assignedTo = query.assignedTo;

        if (query.dpdMin !== undefined || query.dpdMax !== undefined) {
            where.dpd = {};
            if (query.dpdMin !== undefined) where.dpd.gte = query.dpdMin;
            if (query.dpdMax !== undefined) where.dpd.lte = query.dpdMax;
        }

        const sortByAllowed = new Set(['createdAt', 'updatedAt', 'dpd', 'status', 'stage']);
        const sortBy = sortByAllowed.has(query.sortBy) ? query.sortBy : 'createdAt';
        const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

        const [total, data] = await this.prisma.$transaction([
            this.prisma.case.count({ where }),
            this.prisma.case.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ [sortBy]: sortOrder }, { id: 'desc' }],
                include: {
                    customer: true,
                    loan: true,
                },
            }),
        ]);

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                sortBy,
                sortOrder,
            },
        };
    }

    async createCase(customerId: number, loanId: number) {
        const loan = await this.prisma.loan.findUnique({
            where: { id: loanId },
        });

        if (!loan) {
            throw new NotFoundException('Loan not found');
        }

        // Calculate DPD (Days Past Due)
        const today = new Date();
        const dueDate = new Date(loan.dueDate);

        const diffTime = today.getTime() - dueDate.getTime();
        const dpd = diffTime > 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : 0;

        return this.prisma.case.create({
            data: {
                customerId,
                loanId,
                dpd,
                stage: 'SOFT',
                status: 'OPEN',
            },
            include: {
                customer: true,
                loan: true,
            },
        });
    }

    async addAction(caseId: number, dto: any) {

        const caseExists = await this.prisma.case.findUnique({
            where: { id: caseId }
        });

        if (!caseExists) {
            throw new NotFoundException('Case not found');
        }

        return this.prisma.actionLog.create({
            data: {
                caseId,
                type: dto.type,
                outcome: dto.outcome,
                notes: dto.notes
            }
        });

    }

    async runAssignment(caseId: number) {
        const caseData = await this.prisma.case.findUnique({
            where: { id: caseId },
            include: { customer: true },
        });

        if (!caseData) throw new NotFoundException('Case not found');

        const decision = this.rules.evaluate({
            dpd: caseData.dpd,
            riskScore: caseData.customer.riskScore,
        });

        const lastDecision = await this.prisma.ruleDecision.findFirst({
            where: { caseId },
            orderBy: { createdAt: 'desc' },
        });

        const sameAsLast =
            lastDecision &&
            JSON.stringify(lastDecision.matchedRules) === JSON.stringify(decision.matchedRules) &&
            lastDecision.reason === decision.reason &&
            (decision.stage ?? caseData.stage) === caseData.stage &&
            (decision.assignedTo ?? caseData.assignedTo ?? null) === (caseData.assignedTo ?? null);

        if (!sameAsLast) {
            await this.prisma.$transaction([
                this.prisma.case.update({
                    where: { id: caseId },
                    data: {
                        stage: decision.stage ?? caseData.stage,
                        assignedTo: decision.assignedTo ?? caseData.assignedTo,
                        status: caseData.status === 'OPEN' ? 'IN_PROGRESS' : caseData.status,
                    },
                }),
                this.prisma.ruleDecision.create({
                    data: {
                        caseId,
                        matchedRules: decision.matchedRules,
                        reason: decision.reason,
                    },
                }),
            ]);
        }

        const updated = await this.prisma.case.findUnique({
            where: { id: caseId },
        });

        return {
            caseId,
            stage: updated?.stage,
            assignedTo: updated?.assignedTo,
            decision: {
                matchedRules: decision.matchedRules,
                reason: decision.reason,
            },
        };
    }

    async generateNotice(caseId: number) {

        const caseData = await this.prisma.case.findUnique({
            where: { id: caseId },
            include: {
                customer: true,
                loan: true,
                actions: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!caseData) throw new NotFoundException('Case not found');

        const html = generateNoticeHTML(caseData);

        return this.pdf.generate(html);
    }
}