import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NovoUsuario } from '../../models/usuario.model';
import { UsuariosService } from '../../services/usuarios.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './cadastro.html',
  imports:  [FormsModule, RouterLink],
  styleUrl: './cadastro.css',
})
  
export class CadastroComponent {
  usuariosService = inject(UsuariosService);
  router = inject(Router);
  usuario: NovoUsuario = this.usuarioVazio();
  confirmarSenha = '';
  erro = '';
  salvando = false;

  salvar() {
    if (this.usuario.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não são iguais.';
      return;
    }

    this.erro = '';
    this.salvando = true;
    this.usuariosService.incluir(this.usuario).subscribe({
      next: () => {
        alert('Cadastro realizado. Entre com seu e-mail e senha.');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.erro = 'Não foi possível concluir o cadastro. Verifique se o JSON Server está em execução e tente novamente.';
        this.salvando = false;
      },
    });
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
