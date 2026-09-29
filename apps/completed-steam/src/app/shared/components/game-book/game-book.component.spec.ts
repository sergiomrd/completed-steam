import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBookComponent } from './game-book.component';

describe('GameBookComponent', () => {
  let component: GameBookComponent;
  let fixture: ComponentFixture<GameBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBookComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameBookComponent);
    component = fixture.componentInstance;
    component.game = {
      appid: 10,
      name: 'Counter-Strike',
      playtime_forever: 100,
      img_icon_url: '',
      img_logo_url: '',
      has_community_visible_stats: true,
      completed: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
