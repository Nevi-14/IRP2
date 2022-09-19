import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  image = '../assets/islena.png';
  public appPages = [
   {
      image: '../assets/home/maintenance.png',
      title: 'Configuracion de Rutas',
      description: 'Permite gestionar la relación de Rutas y Zonas',
      url: '/mantenimiento-rutas',
    },
 
    {
      image: '../assets/home/delivery.svg',
      title: 'Gestion de camiones',
      description: 'Permite gestionar los camiones en ruta',
      url: '/gestion-camiones',
    },
    {
      image: '../assets/home/route.png',
      title: 'Planificacion de Rutas',
      description: 'Permite definir la configuracion de Rutas - Clientes',
      url: '/planificacion-rutas',
    },
    {
      image: '../assets/png/receipt.png',
      title: 'Planificacion de Entregas',
      description: 'Permite gestionar la factura por cliente de cada ruta',
      url: '/planificacion-entregas',
    },
    {
      image: '../assets/png/customer-service.svg',
      title: 'Atencion al cliente',
      descripcion: 'Permite gestionar las entregas en ruta',
      url: '/servicio-cliente',
    },
    {
      image: '../assets/png/return.svg',
      title: 'Gestion Liquidaciones',
      description: 'Permite gestionar las liquidaciones de los camniones que han completado su ruta de entrega.',
      url: '/gestion-liquidaciones',
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
