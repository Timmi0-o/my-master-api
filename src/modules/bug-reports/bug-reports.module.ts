import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../auth/infrastructure/modules/auth-guards/auth-guards.module';
import { BugReportModule } from './infrastructure/modules/bug-report/bug-report.module';
import { BugReportsController } from './presentation/http/controllers/bug-reports.controller';

@Module({
  imports: [AuthGuardsModule, BugReportModule],
  controllers: [BugReportsController],
  exports: [BugReportModule],
})
export class BugReportsModule {}
