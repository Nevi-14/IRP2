import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteEspejoService } from 'src/app/services/cliente-espejo.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { RutasService } from 'src/app/services/rutas.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { NgZone } from '@angular/core';
import { PlanificacionRutasService } from 'src/app/services/planificacion-rutas.service';
import { ServicioClienteService } from 'src/app/services/servicio-cliente.service';
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


  constructor(public _router: Router, public rutas: RutasService, public clientes:ClientesService, public zonas: ZonasService, public clienteEspejo: ClienteEspejoService,  private ngZone:NgZone, public planificacionRutasService: PlanificacionRutasService, public servicioClienteService: ServicioClienteService) {}


  redirect(to) {
    // call with ngZone, so that ngOnOnit of component is called
    this.ngZone.run(()=>this._router.navigate([to]));
  }
    
  logOut(){

    this.redirect('log-in')
  }
  home(){
  
  this.redirect('inicio')
  }
  ngOnInit(){  
    console.log('0s') 

    this.modulosArray.push(
      {
        imagen: '../assets/home/maintenance.png',
        titulo: 'Configuracion de Rutas',
        descripcion: 'Permite gestionar la relación de Rutas y Zonas',
        ruta: '/mantenimiento-rutas',
      },
   
      {
        imagen: '../assets/home/delivery.svg',
        titulo: 'Gestion de camiones',
        descripcion: 'Permite gestionar los camiones en ruta',
        ruta: '/gestion-camiones',
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
        ruta: '/planificacion-entregas',
      },
      {
        imagen: '../assets/png/customer-service.svg',
        titulo: 'Atencion al cliente',
        descripcion: 'Permite gestionar las entregas en ruta',
        ruta: '/servicio-cliente',
      }
    )

  }





  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     this.textoBuscar = event.detail.value;
   }
 

   refirect(id, element){

switch(id){
     case 1: 

     this.redirect(element.ruta);
     
     break;
     case 2: 
     this.redirect(element.ruta);
     break;
     case 3:
      this.planificacionRutasService.marcadores = []; 
     this.redirect(element.ruta);
  
     break;
     case 4: 
     this.redirect(element.ruta);
     break;
   
     case 5: 
     this.redirect(element.ruta);
     this.servicioClienteService.consultaGuias = []; 
     break;
  default:

  
}

   }

}
