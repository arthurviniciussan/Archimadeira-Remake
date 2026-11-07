import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {}
