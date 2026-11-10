import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

export interface NovoCliente {
  cpf: string;
  nome: string;
  sobrenome: string;
  dtNascimento: string;
  email: string;
  cep: string;
  logradouro: string;
  numeroCasa: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  municipio: string;
  estado: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private readonly api = 'http://localhost:3000/clientes';
  private readonly http = inject(HttpClient);

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api);
  }

  incluir(cliente: NovoCliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.api, cliente);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  buscarPorID(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.api}/${id}`);
  }

  editar(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.api}/${cliente.id}`, cliente);
  }
}
