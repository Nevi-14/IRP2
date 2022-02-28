import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServicioClienteMarcadoresPage } from './servicio-cliente-marcadores.page';

describe('ServicioClienteMarcadoresPage', () => {
  let component: ServicioClienteMarcadoresPage;
  let fixture: ComponentFixture<ServicioClienteMarcadoresPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicioClienteMarcadoresPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioClienteMarcadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
