import { UnauthorizedGuard } from './shared/guards/unauthorized.guard';
import { AuthorizatedGuard } from './shared/guards/authentication.guard';
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
import { NgxSpinnerModule } from "ngx-spinner";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ScrollTopComponent } from './shared/components/scroll-to-top/scroll-to-top.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full', canActivate: [UnauthorizedGuard] },
  { path: 'main/:id', component: MainComponent, pathMatch: 'full', canActivate: [AuthorizatedGuard] },
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
    LoginComponent,
    ScrollTopComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(routes),
    NgxSpinnerModule,
    InfiniteScrollModule,
    BrowserAnimationsModule
  ],
  providers: [BackgroundImagePipe, ValidUrlPipe, AuthorizatedGuard, UnauthorizedGuard],
  exports: [RouterModule, BackgroundImagePipe, ValidUrlPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
