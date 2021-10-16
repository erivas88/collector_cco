import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServeresponsePage } from './serveresponse.page';

describe('ServeresponsePage', () => {
  let component: ServeresponsePage;
  let fixture: ComponentFixture<ServeresponsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServeresponsePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServeresponsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
