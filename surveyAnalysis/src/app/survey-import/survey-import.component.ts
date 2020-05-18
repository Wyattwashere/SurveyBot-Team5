import { Component, OnInit } from '@angular/core';
import * as GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets-charts';
import { SharedService } from '../services/shared.service';
import { ServerService } from '../services/server.service';
import { ActivatedRoute } from '@angular/router';

const $  = require('jquery');
const csv = require('../../../node_modules/jquery-csv/src/jquery.csv.js');

// import * as fs from 'file-saver';
// import * as fastcsv from 'fast-csv';


@Component({
  selector: 'app-survey-import',
  templateUrl: './survey-import.component.html',
  styleUrls: ['./survey-import.component.css']
})
export class SurveyImportComponent implements OnInit {

  public surveyId;
  private csvString;

  showlist: boolean;
  dataList: any;

  comment  = {
    surveyId: 0,
    commentID: 0,
    question: '',
    response: ''
  };
  comments = [];

  constructor(private shared: SharedService, private route: ActivatedRoute,
              private server: ServerService) {
    this.shared.currentSurvID.subscribe(surveyId => this.surveyId = this.surveyId);
  }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.surveyId = id;
    this.shared.getCurrentSurveyID(this.surveyId);
  }

  // fileUploadListener($event:any):void{
  //   this.parseCSV($event.target);
  //  }

  importData(args) {
    const file: File = args.item(0);
    const self = this;
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const csvData = reader.result;
      let data = csv.toArrays(csvData);

      if (data && data.length > 0) {
        self.dataList = data;
        console.log('Imported -' + data.length + '- rows successfully!');
        console.log(data);
        // sometimes imported data contains extra column of ''
        // uncomment to remove this column if it's there
        //this.removeLastRow(data);
        data = this.addSurveyID(data);
        data = this.cleanInput(data);
        data = this.splitComments(data);

        this.server.importSurvey(data).then((results) => {
        });
      } else {
        console.log('No data to import!');
      }
    };
  }

  importQuestions(args) {
    const file: File = args.item(0);

    const self = this;
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const csvData = reader.result;
      let data = csv.toArrays(csvData);

      if (data && data.length > 0) {
        self.dataList = data;
        console.log('Imported -' + data.length + '- rows successfully!');

        data = this.addSurveyID(data);
        data = this.cleanInput(data);

        this.server.importQuestions(data).then((results) => {
        });
      } else {
        console.log('No data to import!');
      }
    };
  }

  addSurveyID(data) {
    const newData = data;
    newData[0].push('survey_id');
    for (let i = 1; i < newData.length; i++) {
      newData[i].push(this.surveyId);
    }
    return newData;
  }

  onClickMe() {
    this.server.uploadSurvey().then(() => {
      window.alert('Survey uploaded!');
    });
  }

  // delimit comments for each row
  splitComments(data) {
    const newData = [];
    const oldData = data;

    newData.push(oldData[0]);

    for (let i = 1; i < oldData.length; i++) {
      const rowCopy = oldData[i];
      const comments = oldData[i][15];
      const splitComments = comments.split('||');

      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < splitComments.length; j++) {
        const rowCopy2 = JSON.parse(JSON.stringify(rowCopy));
        rowCopy2[15] = splitComments[j];
        newData.push(rowCopy2);
      }
    }

    return newData;
  }

  // remove special "Replacement" character
  cleanInput(data) {
    // tslint:disable-next-line: max-line-length
    const regex = /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;
    const newData = data;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < newData.length; i++) {
      const surveyRow = newData[i];
      for (let j = 0; j < surveyRow.length; j++) {
        const cell = newData[i][j];
        if (typeof cell === 'string') {
          newData[i][j] = newData[i][j].replace(regex, '');
        }
      }
    }
    return newData;
  }

  // Remove column of '' after every row of read-in csv
  removeLastRow(data) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < data.length; i++) {
      data[i].pop();
    }
    return data;
  }

}
