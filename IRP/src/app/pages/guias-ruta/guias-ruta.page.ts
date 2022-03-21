import { Component, OnInit } from '@angular/core';
import { GuiasService } from 'src/app/services/guias.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-guias-ruta',
  templateUrl: './guias-ruta.page.html',
  styleUrls: ['./guias-ruta.page.scss'],
})
export class GuiasRutaPage implements OnInit {
  textoBuscar = '';
  constructor(

  public guiasService: GuiasService,
  public modalCtrl: ModalController


  ) { }

  ngOnInit() {
    this.guiasService.syncGuiasRuta('RUTA');
  console.log(  this.guiasService.guiasArrayRuta)
  }
  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     this.textoBuscar = event.detail.value;
   }
   submit(idGuia){
    this.modalCtrl.dismiss({
      idGuia:idGuia
    });
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

}
