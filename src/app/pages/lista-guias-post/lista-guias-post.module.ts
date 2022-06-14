import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaGuiasPostPageRoutingModule } from './lista-guias-post-routing.module';

import { ListaGuiasPostPage } from './lista-guias-post.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaGuiasPostPageRoutingModule
  ],
  declarations: [ListaGuiasPostPage]
})
export class ListaGuiasPostPageModule {}
