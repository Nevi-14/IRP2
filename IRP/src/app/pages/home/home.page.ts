import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteEspejoService } from 'src/app/services/cliente-espejo.service';
import { RutaZonaService } from '../../services/ruta-zona.service';
import { RutasService } from '../../services/rutas.service';
import { ZonasService } from '../../services/zonas.service';
import { ClientesService } from '../../services/clientes.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  maintenance = '../assets/home/maintenance.png'
  routes = '../assets/home/route.png'
  constructor(private route: Router, private clienteEspejo: ClienteEspejoService, private rutas: RutasService, private zonas: ZonasService, private clientes: ClientesService, private map: MapService) {}

  ngOnInit(){

  }

  mantenimientoRutas(){
    this.route.navigate(['/mantenimiento-rutas']);
  }
  guardarRutas(){
    this.rutas.ruta.RUTA = 'Sin definir';
    this.rutas.ruta.DESCRIPCION = '';
    this.zonas.zona.ZONA = 'Sin definir';
    this.zonas.zona.NOMBRE = '';
    this.clientes.clientesRutas = [];
    this.map.currentMarkers = [];
    this.clienteEspejo.ClienteEspejoArray = [];
    this.clienteEspejo.rutas = [];
    this.route.navigate(['/guardar-rutas']);
  }



}
