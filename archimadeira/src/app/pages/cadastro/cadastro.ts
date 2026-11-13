import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NovoCliente, ClientesService } from '../../services/clientes.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './cadastro.html',
  imports:  [FormsModule, RouterLink],
  styleUrl: './cadastro.css',
})
  
export class CadastroComponent {
  clientesService = inject(ClientesService);
  router = inject(Router);
  cliente: NovoCliente = this.clienteVazio();
  confirmarSenha = '';
  erro = '';
  salvando = false;

  salvar() {
    if (this.cliente.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não são iguais.';
      return;
    }

    this.erro = '';
    this.salvando = true;
    this.clientesService.incluir(this.cliente).subscribe({
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

  clienteVazio(): NovoCliente {
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
    };
  }
}
