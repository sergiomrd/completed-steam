import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../../domain';
import { BackgroundImagePipe } from '../../pipes/background-image.pipe';

@Component({
  selector: 'completed-steam-game-book',
  standalone: true,
  imports: [CommonModule, BackgroundImagePipe],
  templateUrl: './game-book.component.html',
  styleUrls: ['./game-book.component.scss']
})
export class GameBookComponent {
  @Input({ required: true }) game!: Game;
  @Output() update = new EventEmitter<{ appid: string; completed: boolean }>();

  setCompleted(): void {
    if (!this.game) return;
    this.game.completed = !this.game.completed;
    this.update.emit({
      appid: this.game.appid.toString(),
      completed: !!this.game.completed
    });
  }
}
