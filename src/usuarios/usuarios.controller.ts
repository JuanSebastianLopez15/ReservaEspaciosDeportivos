import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    // POST /usuarios - Registro cualquiera puede registrar
    @Post()
    create(@Body() createUsuarioDto: CreateUsuarioDto) {
        return this.usuariosService.create(createUsuarioDto);
    }

    // GET /usuarios - Solo ADMIN puede listar todos los usuarios
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    findAll() {
        return this.usuariosService.findAll();
    }

    // GET /usuarios/:id - Solo ADMIN puede ver cualquier usuario
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usuariosService.findOne(id);
    }

    // PATCH /usuarios/:id - Solo ADMIN puede actualizar
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
        return this.usuariosService.update(id, updateUsuarioDto);
    }

    // DELETE /usuarios/:id - Solo ADMIN puede eliminar
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usuariosService.remove(id);
    }

    // POST /usuarios/:id/generar-codigo-compra - Cliente y Admin pueden generar
    @Post(':id/generar-codigo-compra')
    @UseGuards(JwtAuthGuard)
    async generarCodigoCompra(@Param('id', ParseIntPipe) id: number) {
        const codigo = await this.usuariosService.generarCodigoCompra(id);
        return { codigoCompra: codigo };
    }
}