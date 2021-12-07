import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapService } from '../../services/componentes/mapas/map.service';
import { RutasService } from '../../services/paginas/rutas/rutas.service';
import { ClientesService } from '../../services/paginas/clientes/clientes.service';
import { ZonasService } from '../../services/paginas/organizacion territorial/zonas.service';
import { ClienteEspejoService } from 'src/app/services/paginas/clientes/cliente-espejo.service';
import { MapaService } from '../../services/componentes/mapas/mapa.service';

interface Modulos {
  imagen: string,
  titulo: string,
  descripcion: string,
  ruta: string,
}

@Component({
  selector: 'app-home',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})
export class InicioPage implements OnInit {
  modulosArray:Modulos[]=[];
  textoBuscar = '';


  constructor(public route: Router, public mapa: MapaService, public rutas: RutasService, public clientes:ClientesService, public zonas: ZonasService, public clienteEspejo: ClienteEspejoService) {}

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
        ruta: '/planificacion-rutas',
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
    switch(ruta) {
      case 'planificacion-rutas':
        this.guardarRutas();
        // code block
        break;
      case 'ruta-facturas':
        
      this.rutaFacturas();
        break;
      default:
        // code block
    }
  }



  guardarRutas(){

   
    this.route.navigate(['/planificacion-rutas']);


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
