import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) {}

    async create(createUsuarioDto: CreateUsuarioDto) {
        if (!createUsuarioDto.contrasena) {
            throw new BadRequestException('La contraseña es obligatoria');
        }
        const existe = await this.usuarioRepository.findOne({
            where: { correo: createUsuarioDto.correo },
        });
        if (existe) {
            throw new ConflictException('El correo ya está registrado');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasena, saltRounds);

        const nuevoUsuario = this.usuarioRepository.create({
            ...createUsuarioDto,
            contrasena: hashedPassword,
            rol: RolUsuario.CLIENTE,
        });

        return await this.usuarioRepository.save(nuevoUsuario);
    }

    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find();
    }

    async findOne(id: number): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne({ where: { id } });
        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return usuario;
    }

    async findByCorreo(correo: string): Promise<Usuario | null> {
        return await this.usuarioRepository.findOne({ where: { correo } });
    }

    async update(id: number, updateUsuarioDto: any): Promise<Usuario> {
        const usuario = await this.findOne(id);
        if (updateUsuarioDto.contrasena) {
            const saltRounds = 10;
            updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, saltRounds);
        }
        Object.assign(usuario, updateUsuarioDto);
        return await this.usuarioRepository.save(usuario);
    }

    async remove(id: number): Promise<{ message: string }> {
        const usuario = await this.findOne(id);
        await this.usuarioRepository.remove(usuario);
        return { message: `Usuario ${usuario.nombre} eliminado correctamente` };
    }

    async validarPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async generarCodigoCompra(usuarioId: number): Promise<string> {
        const usuario = await this.findOne(usuarioId);
        const codigo = Math.random().toString(36).substring(2, 10).toUpperCase();
        usuario.codigoCompra = codigo;
        await this.usuarioRepository.save(usuario);
        return codigo;
    }

    async findByRefreshToken(refreshToken: string): Promise<Usuario | null> {
        return await this.usuarioRepository.findOne({ where: { refreshToken } });
    }
}