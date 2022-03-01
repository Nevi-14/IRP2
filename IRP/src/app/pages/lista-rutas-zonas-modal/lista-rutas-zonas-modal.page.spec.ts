import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaRutasZonasModalPage } from './lista-rutas-zonas-modal.page';

describe('ListaRutasZonasModalPage', () => {
  let component: ListaRutasZonasModalPage;
  let fixture: ComponentFixture<ListaRutasZonasModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaRutasZonasModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaRutasZonasModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
