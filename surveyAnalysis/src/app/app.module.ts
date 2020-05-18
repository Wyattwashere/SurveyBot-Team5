import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TagFormComponent } from './tag-form/tag-form.component';
import { TagDragDropComponent } from './tag-dragDrop/tag-dragDrop.component';
import { SharedService } from './services/shared.service';
import { CommentComponent } from './comment/comment.component';
import { CommentDragDropComponent} from './comment-dragDrop/comment-dragDrop.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WordCloudComponent } from './word-cloud/word-cloud.component';
import { StopwordManagerComponent } from './stopword-manager/stopword-manager.component';
import { SurveyImportComponent } from './survey-import/survey-import.component';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './services/modal.service';
import { SurveyExportComponent } from './survey-export/survey-export.component';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './services/authentication.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TagFormComponent,
    TagDragDropComponent,
    CommentComponent,
    CommentDragDropComponent,
    HeaderComponent,
    routingComponents,
    PageNotFoundComponent,
    HomePageComponent,
    WordCloudComponent,
    StopwordManagerComponent,
    SurveyImportComponent,
    ModalComponent,
    SurveyExportComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [SharedService, ModalService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
