import { Body, ConflictException, Controller, Get, Post } from '@nestjs/common';
import { Company } from '../../db/models/Company';
import {
  Ticket,
  TicketCategory,
  TicketStatus,
  TicketType,
} from '../../db/models/Ticket';
import { User, UserRole } from '../../db/models/User';
import { 
  ManagementReportService,
  RegistrationAddressChangeService,
  StrikeOffService,
  TicketDto,
  newTicketDto 

} from './tickets.service';


@Controller('api/v1/tickets')
export class TicketsController {

  constructor(
    private readonly managementReportService: ManagementReportService,
    private readonly registrationAddressChangeService: RegistrationAddressChangeService,
    private readonly strikeOffService: StrikeOffService
    ) {}

  @Get()
  async findAll() {
    return await Ticket.findAll({ include: [Company, User] });     
  }

  @Post()
  async create(@Body() newTicketDto: newTicketDto):Promise<TicketDto> {
    const { type, companyId } = newTicketDto;
    let ticketDto;

    switch(type){

      case TicketType.managementReport:
          ticketDto = await this.managementReportService.create(companyId);
          break;
      
      case TicketType.registrationAddressChange:
          ticketDto = await this.registrationAddressChangeService.create(companyId);
          break;
      
      case TicketType.strikeOff:
          ticketDto = await this.strikeOffService.create(companyId);
          break;
      
    }
    
    return ticketDto;
    
  }
}
