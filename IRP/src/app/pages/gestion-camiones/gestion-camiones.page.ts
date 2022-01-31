import { Component, OnInit } from '@angular/core';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';

@Component({
  selector: 'app-gestion-camiones',
  templateUrl: './gestion-camiones.page.html',
  styleUrls: ['./gestion-camiones.page.scss'],
})
export class GestionCamionesPage implements OnInit {

  constructor(
public camionesService: GestionCamionesService

  ) { }

  ngOnInit() {

    this.camionesService.syncCamiones();
  }

}
