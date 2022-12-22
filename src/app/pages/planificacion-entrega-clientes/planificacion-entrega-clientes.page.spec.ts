import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlanificacionEntregaClientesPage } from './planificacion-entrega-clientes.page';

describe('PlanificacionEntregaClientesPage', () => {
  let component: PlanificacionEntregaClientesPage;
  let fixture: ComponentFixture<PlanificacionEntregaClientesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanificacionEntregaClientesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanificacionEntregaClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
