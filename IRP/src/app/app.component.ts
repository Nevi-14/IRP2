import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { ClientesService } from './services/clientes.service';
import { CantonesService } from './services/cantones.service';
import { DistritosService } from './services/distritos.service';
import { ProvinciasService } from './services/provincias.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  mapSvg = '../assets/home/map.svg';
  constructor(private clientes: ClientesService, private provincias: ProvinciasService, private cantones: CantonesService, private distritos: DistritosService) {}
  ngOnInit(){
    this.clientes.syncClientes('1','01','04');
    this.provincias.syncProvincias();
    this.cantones.syncCantones();
    this.distritos.syncDistritos();
   }
}
