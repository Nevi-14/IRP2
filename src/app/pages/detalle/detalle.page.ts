import { Component, OnInit } from '@angular/core';
import { ConfiguracionesService } from 'src/app/services/configuraciones.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  image = '../assets/islena.png';

  constructor(
public configuracionesService: ConfiguracionesService

  ) { }

  ngOnInit() {
  }

}
