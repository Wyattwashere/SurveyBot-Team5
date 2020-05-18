import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { ServerService } from '../services/server.service';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import * as Blob from 'node-blob';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-survey-export',
  templateUrl: './survey-export.component.html',
  styleUrls: ['./survey-export.component.less']
})
export class SurveyExportComponent implements OnInit {
  public surveyId;

  constructor(private shared: SharedService, private route: ActivatedRoute, private server: ServerService) {
    this.shared.currentSurvID.subscribe(surveyId => this.surveyId = this.surveyId);
  }

  ngOnInit() {
    // tslint:disable-next-line: radix
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.surveyId = id;
    this.shared.getCurrentSurveyID(this.surveyId);
  }

  onClickMe() {
    const data = this.surveyId;
    this.server.exportSurvey(data).then((response: any) => {
      this.createDownload(response);
    });
  }

  createDownload(data) {
    const jsonData = JSON.parse(JSON.stringify(data));
    const csvString = Papa.unparse(jsonData);
    const file = new File([csvString], 'survey_export.csv', { type: 'text/csv;charset=utf-8' });
    saveAs(file);
  }

}
