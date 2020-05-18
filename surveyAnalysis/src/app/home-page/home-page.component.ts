// this component contains a user home page that displays all surveys they have access to

import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  survey  = {
    id: '',
    name: ''
  };
  surveys = [];

  constructor(private server: ServerService, private router: Router, private modal: ModalService) { }

  ngOnInit() {
    this.getSurveys();
  }

  private getSurveys() {
    this.server.getSurveys().then((response: any) => {
      this.surveys = response.map((srvy) => {
        srvy.id = srvy.id;
        srvy.name = srvy.name;
        return srvy;
      });
    });
  }

  onSelect(survey) {
    this.router.navigate(['/surveys', survey.id]);
  }

  onAdd() {
    const survey = {name: this.survey.name};

    this.server.createSurvey(survey).then(() => {
      this.getSurveys();
    });
  }
}
