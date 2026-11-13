import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente.model';
import { ClientesService } from '../../services/clientes.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './cadastro.html',
  imports:  [FormsModule, RouterLink],
  styleUrl: './cadastro.css',
})
  
export class CadastroComponent {
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  cliente: Cliente = {} as Cliente;
  confirmarSenha = "";

  salvar() {

    if (this.cliente.senha !== this.confirmarSenha) {
      alert('As senhas não são iguais.');
      return;
    }
    this.clientesService.incluir(this.cliente).subscribe({
      next: (cliente)=> {
        alert(`cliente ${cliente.nome} criado com id ${cliente  .id}`);
        this.router.navigate(["/admin-clientes-listar"])
      }
    });
  }
}
