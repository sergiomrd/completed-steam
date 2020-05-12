import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBookComponent } from './game-book.component';

describe('GameBookComponent', () => {
  let component: GameBookComponent;
  let fixture: ComponentFixture<GameBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
