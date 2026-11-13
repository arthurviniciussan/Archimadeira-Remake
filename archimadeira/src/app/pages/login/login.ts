import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [FormsModule, RouterLink],
})
export class LoginComponent {
  private readonly clientesService = inject(ClientesService);
  private readonly router = inject(Router);

  email = '';
  senha = '';
  erro = '';
  verificando = false;

  entrar(): void {
    this.erro = '';
    this.verificando = true;

    this.clientesService.autenticar(this.email, this.senha).subscribe({
      next: (cliente) => {
        this.verificando = false;
        if (!cliente) {
          this.erro = 'E-mail ou senha inválidos.';
          return;
        }

        this.router.navigate(['/']);
      },
      error: () => {
        this.erro = 'Não foi possível validar o login. Verifique se o JSON Server está em execução.';
        this.verificando = false;
      },
    });
  }
}
