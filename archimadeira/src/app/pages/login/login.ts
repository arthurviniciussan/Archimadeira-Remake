import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [FormsModule, RouterLink],
})
export class LoginComponent {
  private readonly usuariosService = inject(UsuariosService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  senha = '';
  erro = '';
  verificando = false;

  entrar(): void {
    this.erro = '';
    this.verificando = true;

    this.usuariosService.autenticar(this.email, this.senha).subscribe({
      next: (usuario) => {
        this.verificando = false;
        if (!usuario) {
          this.erro = 'E-mail ou senha inválidos.';
          return;
        }

        this.authService.entrar(usuario);
        this.router.navigate([usuario.tipo === 'admin' ? '/admin/produtos' : '/']);
      },
      error: () => {
        this.erro = 'Não foi possível validar o login. Verifique se o JSON Server está em execução.';
        this.verificando = false;
      },
    });
  }
}
