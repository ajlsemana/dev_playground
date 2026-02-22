import { Module } from '@nestjs/common';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { RulesModule } from '../rules/rules.module';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [RulesModule, PdfModule],
  controllers: [CasesController],
  providers: [CasesService]
})
export class CasesModule {}
