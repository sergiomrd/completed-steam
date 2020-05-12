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
  @Input() game: Game;

  constructor(private bgPipe: BackgroundImagePipe, private validUrl: ValidUrlPipe, private http: HttpClient) { 
  }

   ngOnInit() {
    this.imageUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${this.game.appid}/library_600x900.jpg`;
    this.getImage(this.imageUrl);
  }

   getImage(imageUrl: string): any {
    this.http.get(imageUrl, {responseType: 'blob'}).subscribe(data => {
      this.background = this.bgPipe.transform(imageUrl);
    }, ((error: HttpErrorResponse) => {
      // this.getImage(`https://steamcdn-a.akamaihd.net/steam/apps/${this.game.appid}/header.jpg`);
    }));
  }

  setCompleted() {
    this.game.completed = !this.game.completed;
  }

}
