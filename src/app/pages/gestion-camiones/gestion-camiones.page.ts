import { Component, OnInit } from '@angular/core';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';

@Component({
  selector: 'app-gestion-camiones',
  templateUrl: './gestion-camiones.page.html',
  styleUrls: ['./gestion-camiones.page.scss'],
})
export class GestionCamionesPage implements OnInit {
  snow = '<ion-icon name="snow-outline"></ion-icon>'
  sun = '<ion-icon name="sun-outline"></ion-icon>'
  textoBuscarRuta = ''
  constructor(
public camionesService: GestionCamionesService

  ) { }

  ngOnInit() {

    this.camionesService.syncCamiones();
  }
  onSearchChange(event){

    console.log(event.detail.value);

    this.textoBuscarRuta = event.detail.value;

  }

}
