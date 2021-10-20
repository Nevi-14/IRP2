import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { ClientesService } from './services/clientes.service';
import { CantonesService } from './services/cantones.service';
import { DistritosService } from './services/distritos.service';
import { ProvinciasService } from './services/provincias.service';
import { RutasService } from './services/rutas.service';
import { ZonasService } from './services/zonas.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  mapSvg = '../assets/home/map.svg';
  constructor(private clientes: ClientesService, private provincias: ProvinciasService, private cantones: CantonesService, private distritos: DistritosService, private rutas: RutasService, private zonas: ZonasService) {}
  ngOnInit(){
 //   this.clientes.syncClientes('1','01','04');
    this.provincias.syncProvincias();
    this.rutas.syncRutas();
    console.log('rutas',this.rutas.rutas);
    this.zonas.syncZonas();
    console.log('zonas', this.zonas.zonas)
   }
}
