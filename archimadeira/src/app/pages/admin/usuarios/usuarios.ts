import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NovoUsuario, Usuario } from '../../../models/usuario.model';
import { AuthService } from '../../../services/auth.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class AdminUsuariosComponent implements OnInit {
  service = inject(UsuariosService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  listaUsuarios: Usuario[] = [];

  mostrarFormulario = false;
  salvando = false;
  erro = '';
  novoUsuario: NovoUsuario = this.usuarioVazio();

  ngOnInit(): void {
    if (this.authService.usuarioAtual?.tipo !== 'admin') {
      this.router.navigate(['/']);
      return;
    }

    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.service.listar().subscribe({
      next: (usuarios) => {
        this.listaUsuarios = usuarios;
        this.erro = '';
      },
      error: () => {
        this.erro = 'Não foi possível carregar os usuários. Verifique se o JSON Server está em execução.';
      },
    });
  }

  incluirUsuario(): void {
    this.salvando = true;
    this.erro = '';

    this.service.incluir(this.novoUsuario).subscribe({
      next: (usuario) => {
        this.listaUsuarios = [...this.listaUsuarios, usuario];
        this.novoUsuario = this.usuarioVazio();
        this.mostrarFormulario = false;
        this.salvando = false;
      },
      error: () => {
        this.erro = 'Não foi possível salvar o usuário. Tente novamente.';
        this.salvando = false;
      },
    });
  }

  excluir(id: number | string): void {
    if (!confirm('Deseja realmente excluir este usuário?')) {
      return;
    }

    this.erro = '';
    this.service.excluir(id).subscribe({
      next: () => {
        this.listaUsuarios = this.listaUsuarios.filter((usuario) => usuario.id !== id);
      },
      error: () => {
        this.erro = 'Não foi possível excluir o usuário. Tente novamente.';
      },
    });
  }

  cancelarInclusao(): void {
    this.novoUsuario = this.usuarioVazio();
    this.mostrarFormulario = false;
  }

  usuarioVazio(): NovoUsuario {
    return {
      cpf: '',
      nome: '',
      sobrenome: '',
      dtNascimento: '',
      email: '',
      cep: '',
      logradouro: '',
      numeroCasa: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      senha: '',
      tipo: 'usuario',
    };
  }
}
