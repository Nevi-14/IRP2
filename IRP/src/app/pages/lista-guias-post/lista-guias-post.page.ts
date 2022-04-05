import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lista-guias-post',
  templateUrl: './lista-guias-post.page.html',
  styleUrls: ['./lista-guias-post.page.scss'],
})
export class ListaGuiasPostPage implements OnInit {
@Input() guias: [];


  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }
  cerrarModal(){
this.modalCtrl.dismiss();

  }
}
