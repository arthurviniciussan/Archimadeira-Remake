import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { MenuComponent } from '../../shared/menu/menu';
import { EditarProduto } from './editar-produto/editar-produto';
import { ModalExcluirProdutoComponent } from './modal-excluir-produto/modal-excluir-produto';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [SidebarComponent, MenuComponent, EditarProduto, ModalExcluirProdutoComponent],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Produtos {}
