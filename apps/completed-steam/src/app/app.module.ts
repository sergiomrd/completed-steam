import { ValidUrlPipe } from './shared/pipes/valid-url.pipe';
import { BackgroundImagePipe } from './shared/pipes/background-image.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from './main/main/main.component';
import { GameBookComponent } from './shared/components/game-book/game-book.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'main', component: MainComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GameBookComponent,
    BackgroundImagePipe,
    ValidUrlPipe,
    HeaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(routes)
  ],
  providers: [BackgroundImagePipe, ValidUrlPipe],
  exports: [RouterModule, BackgroundImagePipe, ValidUrlPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
