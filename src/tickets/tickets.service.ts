import { Injectable } from '@nestjs/common';
import {ConflictException } from '@nestjs/common';
import {
    Ticket,
    TicketCategory,
    TicketStatus,
    TicketType,
  } from '../../db/models/Ticket';
  import { User, UserRole } from '../../db/models/User';

export interface TicketDto {
    id: number;
    type: TicketType;
    companyId: number;
    assigneeId: number;
    status: TicketStatus;
    category: TicketCategory;
}

export interface newTicketDto {
    type: TicketType;
    companyId: number;
}

abstract class TicketService {
    
    abstract create(companyId: number): Promise<TicketDto>; // must be implemented in derived classes
}



@Injectable()
export class ManagementReportService extends TicketService {

    async create(companyId: number): Promise<TicketDto> {
        
        const category = TicketCategory.accounting;
        const userRole = UserRole.accountant;
        const type = TicketType.managementReport;

        const assignees = await User.findAll({
            where: { companyId, role: userRole },
            order: [['createdAt', 'DESC']],
        });

        if (!assignees.length)
            throw new ConflictException(
                `Cannot find user with role ${userRole} to create a ticket`,
            );

        const assignee = assignees[0];

        const ticket = await Ticket.create({
            companyId,
            assigneeId: assignee.id,
            category,
            type,
            status: TicketStatus.open,
        });

        const ticketDto: TicketDto = {
            id: ticket.id,
            type: ticket.type,
            assigneeId: ticket.assigneeId,
            status: ticket.status,
            category: ticket.category,
            companyId: ticket.companyId,
        };
  
      return ticketDto;
    }
}

@Injectable()
export class RegistrationAddressChangeService extends TicketService {

    async create(companyId: number): Promise<TicketDto> {
        
        const category = TicketCategory.corporate;
        const userRole = UserRole.corporateSecretary;
        const type = TicketType.registrationAddressChange;

        const ticketExist = await Ticket.findOne({ 
            where: { type: type}
        });

        if(ticketExist)
            throw new ConflictException(
              `A ticket with this category already exist. Cannot create a ticket`,  
            );
          
        
        let assignees = await User.findAll({
            where: { companyId, role: userRole },
            order: [['createdAt', 'DESC']],
        });

        if (!assignees.length){

            assignees = await User.findAll({ //find user of role director
                where: { companyId, role: UserRole.director },
                order: [['createdAt', 'DESC']],
            });

            if (!assignees.length)
                throw new ConflictException(
                    `Cannot find user with role ${userRole} to create a ticket`,
                );
        }

        if (assignees.length > 1)
            throw new ConflictException(
                `Multiple users with role ${userRole}. Cannot create a ticket`,
            );
            

        const assignee = assignees[0];

        const ticket = await Ticket.create({
            companyId,
            assigneeId: assignee.id,
            category,
            type,
            status: TicketStatus.open,
        });

        const ticketDto: TicketDto = {
            id: ticket.id,
            type: ticket.type,
            assigneeId: ticket.assigneeId,
            status: ticket.status,
            category: ticket.category,
            companyId: ticket.companyId,
        };
  
      return ticketDto;
    }
}

@Injectable()
export class StrikeOffService extends TicketService {

    async create(companyId: number): Promise<TicketDto> {
        
        const category = TicketCategory.management;
        let userRole = UserRole.director;
        const type = TicketType.strikeOff;

        let assignees = await User.findAll({
            where: { companyId, role: userRole },
            order: [['createdAt', 'DESC']],
        });

        if (!assignees.length)
            throw new ConflictException(
                `Cannot find user with role ${userRole} to create a ticket`,
            );

        if (assignees.length > 1)
            throw new ConflictException(
                `Multiple users with role ${userRole}. Cannot create a ticket`,
            );
        
        await Ticket.update(
            { status: TicketStatus.resolved },
            {
                where: {
                    status: TicketStatus.open,
                },
            },
        );
            
        const assignee = assignees[0];

        const ticket = await Ticket.create({
            companyId,
            assigneeId: assignee.id,
            category,
            type,
            status: TicketStatus.open,
        });

        const ticketDto: TicketDto = {
            id: ticket.id,
            type: ticket.type,
            assigneeId: ticket.assigneeId,
            status: ticket.status,
            category: ticket.category,
            companyId: ticket.companyId,
        };
  
      return ticketDto;
    }
}