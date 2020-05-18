import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Data } from '../comment-dragDrop/comment-dragDrop.component';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-survey-page',
  templateUrl: './survey-page.component.html',
  styleUrls: ['./survey-page.component.css']
})
export class SurveyPageComponent implements OnInit {

  title = 'surveyAnalysis';

  public surveyId;
  data = Data;

  tags: any = [];
  message: string;

  constructor(private shared: SharedService, private route: ActivatedRoute,
              private server: ServerService, private router: Router, private modal: ModalService) {
    this.shared.currentMessage.subscribe(
      (message) => {
        this.message = message;
        if (this.message != null) {
          this.tags.push({Name: this.message, Survey: 'test'});
        }
      });
    this.shared.currentSurvID.subscribe(surveyId => this.surveyId = this.surveyId);
  }

  ngOnInit() {
    // tslint:disable-next-line: radix
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.surveyId = id;
    this.shared.getCurrentSurveyID(this.surveyId);
  }

  deleteSurvey() {
    const survey = {
      id: this.surveyId,
    };

    this.server.deleteSurvey(survey).then(() => {
      this.router.navigate(['']);
    });
  }

  openModal(id: string) {
    this.modal.open(id);
  }

  closeModal(id: string) {
    this.modal.close(id);
  }
}
