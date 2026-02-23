import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { CasesModule } from './cases/cases.module';
import { RulesModule } from './rules/rules.module';
import { PdfModule } from './pdf/pdf.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, CasesModule, RulesModule, PdfModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
