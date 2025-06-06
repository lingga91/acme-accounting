import { Module } from '@nestjs/common';
import { DbModule } from './db.module';
import { TicketsController } from './tickets/tickets.controller';
import { ReportsController } from './reports/reports.controller';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { ReportsService } from './reports/reports.service';
import { ManagementReportService,RegistrationAddressChangeService,StrikeOffService } from './tickets/tickets.service';

@Module({
  imports: [DbModule],
  controllers: [TicketsController, ReportsController, HealthcheckController],
  providers: [
    ReportsService,
    ManagementReportService,
    RegistrationAddressChangeService,
    StrikeOffService
  ],
})
export class AppModule {}
