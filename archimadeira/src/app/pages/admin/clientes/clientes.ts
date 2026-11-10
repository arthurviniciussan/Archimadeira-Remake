import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../models/cliente.model';
import { ClientesService, NovoCliente } from '../../../services/clientes.service';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class AdminClientesComponent implements OnInit {
  private readonly service = inject(ClientesService);

  listaClientes: Cliente[] = [];

  mostrarFormulario = false;
  salvando = false;
  erro = '';
  novoCliente: NovoCliente = this.clienteVazio();

  ngOnInit(): void {
    this.carregarClientes();
  }

  private carregarClientes(): void {
    this.service.listar().subscribe({
      next: (clientes) => {
        this.listaClientes = clientes;
        this.erro = '';
      },
      error: () => {
        this.erro = 'Não foi possível carregar os clientes. Verifique se o JSON Server está em execução.';
      },
    });
  }

  incluirCliente(): void {
    this.salvando = true;
    this.erro = '';

    this.service.incluir(this.novoCliente).subscribe({
      next: (cliente) => {
        this.listaClientes = [...this.listaClientes, cliente];
        this.novoCliente = this.clienteVazio();
        this.mostrarFormulario = false;
        this.salvando = false;
      },
      error: () => {
        this.erro = 'Não foi possível salvar o cliente. Tente novamente.';
        this.salvando = false;
      },
    });
  }

  excluir(id: number): void {
    if (!confirm('Deseja realmente excluir este cliente?')) {
      return;
    }

    this.erro = '';
    this.service.excluir(id).subscribe({
      next: () => {
        this.listaClientes = this.listaClientes.filter((cliente) => cliente.id !== id);
      },
      error: () => {
        this.erro = 'Não foi possível excluir o cliente. Tente novamente.';
      },
    });
  }

  editar(id: number): void {
    console.log('Editar cliente:', id);
  }

  cancelarInclusao(): void {
    this.novoCliente = this.clienteVazio();
    this.mostrarFormulario = false;
  }

  private clienteVazio(): NovoCliente {
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
      municipio: '',
      estado: '',
    };
  }
}
