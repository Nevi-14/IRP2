import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapService } from '../../services/componentes/mapas/map.service';
import { RutasService } from '../../services/paginas/rutas/rutas.service';
import { ClientesService } from '../../services/paginas/clientes/clientes.service';
import { ZonasService } from '../../services/paginas/organizacion territorial/zonas.service';
import { ClienteEspejoService } from 'src/app/services/paginas/clientes/cliente-espejo.service';

interface Modulos {
  imagen: string,
  titulo: string,
  descripcion: string,
  ruta: string,
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  modulosArray:Modulos[]=[];
  textoBuscar = '';
  constructor(private route: Router, private map: MapService, private rutas: RutasService, private clientes:ClientesService, private zonas: ZonasService, private clienteEspejo: ClienteEspejoService) {}

  ngOnInit(){

    this.modulosArray.push(
      {
        imagen: '../assets/home/maintenance.png',
        titulo: 'Configuracion de Rutas',
        descripcion: 'Permite gestionar la relación de Rutas y Zonas',
        ruta: '/mantenimiento-rutas',
      },
      {
        imagen: '../assets/home/route.png',
        titulo: 'Planificacion de Rutas',
        descripcion: 'Permite definir la configuracion de Rutas - Clientes',
        ruta: '/guardar-rutas',
      },
      {
        imagen: '../assets/png/receipt.png',
        titulo: 'Planificacion de Entregas',
        descripcion: 'Permite gestionar la factura por cliente de cada ruta',
        ruta: '/ruta-facturas',
      }
    )

  }

  enrutador(ruta){
    this.route.navigate([ruta]);
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


  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     this.textoBuscar = event.detail.value;
   }
 

}
