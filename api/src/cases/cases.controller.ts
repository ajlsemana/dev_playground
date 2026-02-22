import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiProduces, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, ParseIntPipe, Res, Query } from '@nestjs/common';
import type { Response } from 'express';

import { CasesService } from './cases.service';
import { CreateCaseDto } from './DTO/create-case.dto';
import { CreateActionDto } from './DTO/create-action.dto';
import { ListCasesDto } from './DTO/list-cases.dto';

@ApiTags('Cases')
@Controller('api/cases')
export class CasesController {

    constructor(private casesService: CasesService) { }

    @ApiOperation({ summary: 'List cases with filters and pagination' })
    @Get()
    async getCases(@Query() query: ListCasesDto) {
        return this.casesService.listCases(query);
    }

    @ApiOperation({ summary: 'Get case details by id' })
    @ApiParam({ name: 'id', example: 1 })
    @Get(':id')
    async getCaseById(@Param('id', ParseIntPipe) id: number) {
        return this.casesService.getCaseById(id);
    }

    @ApiOperation({ summary: 'Create a new case' })
    @ApiBody({ type: CreateCaseDto })
    @Post()
    async createCase(@Body() dto: CreateCaseDto) {
        console.log('Case BODY:', dto);
        return this.casesService.createCase(dto.customerId, dto.loanId);
    }

    @ApiOperation({ summary: 'Add an action log entry to a case' })
    @ApiParam({ name: 'id', example: 1 })
    @ApiBody({ type: CreateActionDto })
    @Post(':id/actions')
    async addAction(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateActionDto
    ) {
        console.log('PostActionDTO:', dto);
        return this.casesService.addAction(id, dto);
    }

    @ApiOperation({ summary: 'Run rules-based assignment on a case (audit recorded)' })
    @ApiParam({ name: 'id', example: 1 })
    @Post(':id/assign')
    async assign(@Param('id', ParseIntPipe) id: number) {
        return this.casesService.runAssignment(id);
    }

    @ApiOperation({ summary: 'Generate payment reminder notice PDF' })
    @ApiParam({ name: 'id', example: 1 })
    @ApiProduces('application/pdf')
    @Get(':id/notice.pdf')
    async generatePDF(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: Response
    ) {

        const pdf = await this.casesService.generateNotice(id);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="notice.pdf"'
        });

        res.send(pdf);
    }

}