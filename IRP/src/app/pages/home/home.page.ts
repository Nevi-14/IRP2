import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapService } from '../../services/map.service';
import { RutasService } from '../../services/rutas.service';
import { ClientesService } from '../../services/clientes.service';
import { ZonasService } from '../../services/zonas.service';
import { ClienteEspejoService } from 'src/app/services/cliente-espejo.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  maintenance = '../assets/home/maintenance.png'
  routes = '../assets/home/route.png'
  receipts = '../assets/png/receipt.png'
  constructor(private route: Router, private map: MapService, private rutas: RutasService, private clientes:ClientesService, private zonas: ZonasService, private clienteEspejo: ClienteEspejoService) {}

  ngOnInit(){

  }

  mantenimientoRutas(){
    this.route.navigate(['/mantenimiento-rutas']);
  }
  guardarRutas(){
    this.rutas.ruta.RUTA = '';
    this.rutas.ruta.DESCRIPCION = '';
    this.zonas.zona.ZONA = '';
    this.zonas.zona.NOMBRE = '';
    this.clientes.clientesRutas = [];
    this.map.currentMarkers = [];
    this.clientes.clientesRutas = [];
    this.clientes.rutasClientes=[];
    this.clienteEspejo.rutas = [];
    this.route.navigate(['/guardar-rutas']);


  }
rutaFacturas(){
    this.route.navigate(['/ruta-facturas']);
 
  }



}
