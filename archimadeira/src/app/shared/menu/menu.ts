import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class MenuComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  sair(): void {
    this.authService.sair();
    this.router.navigate(['/']);
  }
}