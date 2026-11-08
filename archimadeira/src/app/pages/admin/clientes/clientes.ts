import { Component, inject, OnInit } from '@angular/core';
import { ClienteService } from '../../../services/cliente';
import { Cliente } from '../../../models/cliente.model';


@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class AdminClientesComponent implements OnInit {

  private service = inject(ClienteService);
  listaClientes: Cliente[] = [];
  ngOnInit(): void {
    this.listaClientes = this.service.listar();
  }

  
  editar(id: number) {
    console.log('Editar cliente:', id);
  }
  excluir(id: number) {
    console.log('Excluir cliente:', id);
  }
}
