import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

export type NovoCliente = Omit<Cliente, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private readonly api = 'http://localhost:3000/clientes';
  private readonly http = inject(HttpClient);

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api);
  }

  autenticar(email: string, senha: string): Observable<Cliente | null> {
    return this.listar().pipe(
      map((clientes) => clientes.find(
        (cliente) => cliente.email.toLowerCase() === email.trim().toLowerCase() && cliente.senha === senha,
      ) ?? null),
    );
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
