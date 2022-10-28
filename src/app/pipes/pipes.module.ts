import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FiltroPipe } from './filtro.pipe';


@NgModule({
  declarations: [
    FiltroPipe,
    
  ],
  imports: [
    CommonModule
  ],
  exports:[
   
    FiltroPipe,
    DatePipe
  ]
})
export class PipesModule { }
