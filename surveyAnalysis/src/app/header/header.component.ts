// This component contains the header for a survey page that displays survey name
// TODO: add functionality to display type of survey once multiple options are implemented
// right now 'course evaluations' is hard coded into the HTML for survey form/type

import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public surveyId;
  surveys = [];

  // tslint:disable-next-line: variable-name
  current_survey  = {
    id: 0,
    name: 'test'
  };

  constructor(private server: ServerService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getSurvey();
    // tslint:disable-next-line: radix
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.surveyId = id;
  }

  private getSurvey() {
    this.server.getSurveys().then((response: any) => {
      const size = response.length;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < response.length; i++) {
        if (response[i].id === this.surveyId) {
          this.current_survey.name = response[i].name;
          this.current_survey.id = response[i].id;
        }
      }
    });
  }

}
