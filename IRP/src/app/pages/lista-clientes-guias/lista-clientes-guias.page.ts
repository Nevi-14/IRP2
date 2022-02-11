import { Component, OnInit, Input } from '@angular/core';
import { RutaFacturas } from '../../models/rutaFacturas';

@Component({
  selector: 'app-lista-clientes-guias',
  templateUrl: './lista-clientes-guias.page.html',
  styleUrls: ['./lista-clientes-guias.page.scss'],
})
export class ListaClientesGuiasPage implements OnInit {
@Input() facturas:RutaFacturas[]=[];
verdadero = true;
image = '../assets/icons/delivery-truck.svg'
falso = false;
  constructor() { }

  ngOnInit() {
  }

}
