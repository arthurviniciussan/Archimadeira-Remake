import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { NovoUsuario, Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly api = 'http://localhost:3000/usuarios';
  private readonly http = inject(HttpClient);

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.api);
  }

  autenticar(email: string, senha: string): Observable<Usuario | null> {
    return this.listar().pipe(
      map((usuarios) => usuarios.find(
        (usuario) => usuario.email.toLowerCase() === email.trim().toLowerCase() && usuario.senha === senha,
      ) ?? null),
    );
  }

  incluir(usuario: NovoUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.api, usuario);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  buscarPorID(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.api}/${id}`);
  }

  editar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.api}/${usuario.id}`, usuario);
  }
}
