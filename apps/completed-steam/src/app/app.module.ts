import { ValidUrlPipe } from './shared/pipes/valid-url.pipe';
import { BackgroundImagePipe } from './shared/pipes/background-image.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from './main/main/main.component';
import { GameBookComponent } from './shared/components/game-book/game-book.component';

const routes: Routes = [
  { path: '**', component: MainComponent, pathMatch: 'full'},
  { path: 'login', redirectTo: '/api/auth/steam'}
];

@NgModule({
  declarations: [AppComponent, MainComponent, GameBookComponent, BackgroundImagePipe, ValidUrlPipe],
  imports: [BrowserModule, HttpClientModule, NgbModule, RouterModule.forRoot(routes)],
  providers: [BackgroundImagePipe, ValidUrlPipe],
  exports: [RouterModule, BackgroundImagePipe, ValidUrlPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
