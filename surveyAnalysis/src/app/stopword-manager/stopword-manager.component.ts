import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ServerService } from '../services/server.service';
import { SharedService } from '../services/shared.service';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-stopword-manager',
  templateUrl: './stopword-manager.component.html',
  styleUrls: ['./stopword-manager.component.css']
})
export class StopwordManagerComponent implements OnInit {
  @Output() stopwordData = new EventEmitter();

  initialWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you',
  'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her',
  'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was',
  'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
  'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by',
  'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further',
  'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];

  shown = false;

  words = [];

  public surveyID;
  newWord = '';

  constructor(private shared: SharedService, private server: ServerService, private route: ActivatedRoute) { }

  ngOnInit() {
    let id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.surveyID = id;
    this.getStopwords();
  }

  onClick() {
    const word = this.newWord;

    const dbInfo = {
      name : this.newWord,
      survey_id : this.surveyID
    }

    this.server.createStopword(dbInfo).then(() => {
      this.getStopwords();
      this.stopwordData.emit(this.words);
    });
  }

  toggle() {
    this.shown = !this.shown;
  }

  private getStopwords(){
    this.server.getStopwords(this.surveyID).then((response: any) => {
      this.words = this.initialWords.concat(response.map((stopWord) => {
        return stopWord.name;
      }));
      this.stopwordData.emit(this.words);
    });
  }

}
