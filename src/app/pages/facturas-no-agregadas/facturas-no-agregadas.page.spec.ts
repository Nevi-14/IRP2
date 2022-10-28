import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FacturasNoAgregadasPage } from './facturas-no-agregadas.page';

describe('FacturasNoAgregadasPage', () => {
  let component: FacturasNoAgregadasPage;
  let fixture: ComponentFixture<FacturasNoAgregadasPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturasNoAgregadasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FacturasNoAgregadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
