import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { MapService } from '../../services/componentes/mapas/map.service';
import { RutasService } from '../../services/paginas/rutas/rutas.service';
import { ZonasService } from 'src/app/services/paginas/organizacion territorial/zonas.service';
import { RutaFacturasService } from 'src/app/services/paginas/rutas/ruta-facturas.service';

import { ClientesService } from '../../services/paginas/clientes/clientes.service';

@Component({
  selector: 'app-ruta-facturas',
  templateUrl: './ruta-facturas.page.html',
  styleUrls: ['./ruta-facturas.page.scss'],
})
export class RutaFacturasPage implements OnInit {

  constructor(public map: MapService, public modalCtrl: ModalController, public rutas:RutasService, public zonas:ZonasService, public rutaFacturas: RutaFacturasService , public clientes: ClientesService, public clienteEspejo: ClientesService, public popOverCrtl: PopoverController) {


   }

  ngOnInit() {
  
  }

  

 




}
