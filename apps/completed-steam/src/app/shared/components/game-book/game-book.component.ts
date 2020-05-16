import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ValidUrlPipe } from './../../pipes/valid-url.pipe';
import { Game } from './../../../../../../api/src/app/models/game.interface';
import { BackgroundImagePipe } from './../../pipes/background-image.pipe';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'completed-steam-game-book',
  templateUrl: './game-book.component.html',
  styleUrls: ['./game-book.component.scss']
})
export class GameBookComponent implements OnInit {
  background: string;
  imageUrl: string;
  imageTypes: string[];
  @Input() game: Game;

  constructor(private bgPipe: BackgroundImagePipe, private validUrl: ValidUrlPipe, private http: HttpClient) { 
  }

   ngOnInit() {

  }

  setCompleted() {
    this.game.completed = !this.game.completed;
  }

}
