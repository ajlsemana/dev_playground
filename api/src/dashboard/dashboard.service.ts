import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKpis() {
    const openCases = await this.prisma.case.count({
      where: { status: 'OPEN' },
    });

    const resolvedToday = await this.prisma.case.count({
      where: {
        status: 'RESOLVED',
        updatedAt: {
          gte: new Date(new Date().setHours(0,0,0,0)),
        },
      },
    });

    const avg = await this.prisma.case.aggregate({
      where: { status: 'OPEN' },
      _avg: { dpd: true },
    });

    return {
      openCases,
      resolvedToday,
      avgDpdOpen: avg._avg.dpd ?? 0,
    };
  }
}