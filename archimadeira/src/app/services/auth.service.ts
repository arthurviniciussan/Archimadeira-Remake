import { Injectable } from '@angular/core';
import { SessaoUsuario, Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuario: SessaoUsuario | null = this.carregarSessao();

  get usuarioAtual(): SessaoUsuario | null {
    return this.usuario;
  }

  entrar(usuario: Usuario): void {
    this.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    };
    localStorage.setItem('usuarioLogado', JSON.stringify(this.usuario));
  }

  sair(): void {
    this.usuario = null;
    localStorage.removeItem('usuarioLogado');
  }

  private carregarSessao(): SessaoUsuario | null {
    const sessaoSalva = localStorage.getItem('usuarioLogado');
    return sessaoSalva ? JSON.parse(sessaoSalva) as SessaoUsuario : null;
  }
}
