import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
@Component({
  selector: 'app-lista-clientes-guias',
  templateUrl: './lista-clientes-guias.page.html',
  styleUrls: ['./lista-clientes-guias.page.scss'],
})
export class ListaClientesGuiasPage implements OnInit {
  @Input() rutaZona;
  @Input() fecha;
  @Input() idGuia
  guiaIndex = null;
  textoBuscarClientes = '';

  constructor(
    public modalCtrl: ModalController,
    public alertCTrl: AlertController,
    public planificacionEntregsService: PlanificacionEntregasService
  ) { }

  ngOnInit() {
    this.guiaIndex = this.planificacionEntregsService.listaGuias.findIndex(guia => guia.idGuia == this.idGuia);
    if (this.guiaIndex >= 0) {
      console.log(this.planificacionEntregsService.listaGuias[this.guiaIndex], 'guia')
      console.log(this.planificacionEntregsService.listaGuias[this.guiaIndex].clientes, 'clientes')
      console.log(this.planificacionEntregsService.listaGuias[this.guiaIndex].facturas, 'facturas')
    }
  }

  async borrarFacturaGuia(factura) {
    this.planificacionEntregsService.listaCliente = true;
    await this.planificacionEntregsService.borrarFacturaGuia(factura);

  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  onSearchChange(event) {
    this.textoBuscarClientes = event.detail.value;
  }






}
