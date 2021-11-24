import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapaService } from 'src/app/services/componentes/mapas/mapa.service';
import { ClientesService } from 'src/app/services/paginas/clientes/clientes.service';
interface Marcadores{
  id:string,
  funcion: string,
  cliente:any,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}


@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.page.html',
  styleUrls: ['./marcadores.page.scss'],
})

export class MarcadoresPage implements OnInit {
  @Input() marcadores:Marcadores[];
  
@Input() funcion:string;
  constructor(private clientes: ClientesService, private mapa: MapaService, private modalCtrl: ModalController) { }

  ngOnInit() {
  console.log(this.marcadores)
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
