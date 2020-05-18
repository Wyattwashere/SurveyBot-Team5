// This component contains the container for all the comments for a survey

import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SharedService } from '../services/shared.service';
import { ServerService } from '../services/server.service';
import { ActivatedRoute } from '@angular/router';
//import { ConsoleReporter } from 'jasmine';

export let Data: any = {
  data: '',

  settings: {
      minFontSize: 10,
      maxFontSize: 300,
  }
};

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'app-comment-drag-drop',
  templateUrl: 'comment-dragDrop.component.html',
  styleUrls: ['comment-dragDrop.component.css'],
})
export class CommentDragDropComponent implements OnInit {

  constructor(private shared: SharedService, private server: ServerService, private route: ActivatedRoute) {
    this.shared.currentMessage.subscribe(message => this.message = message);

    this.shared.refreshing.subscribe(
      () => {
        this.getComment();
        }
      );
    this.shared.sentimentShown.subscribe(sentShown => this.sentimentShown = sentShown);
    this.shared.currentSurvID.subscribe(surveyId => this.surveyId = surveyId);
  }

  public surveyId;
  comment  = {
    surveyId: 0,
    commentID: 0,
    question: '',
    response: ''
  };
  comments = [];
  combined = '';

  tags = [];

  message: string;
  sentimentShown = false;

  startingPoint = [];

  ngOnInit() {
    this.getComment();
    // tslint:disable-next-line: radix
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.surveyId = id;
  }

  onClick() {
    this.shared.toggleSentiment(!this.sentimentShown);
  }

  // gets all comments for a survey
  // also creates a combined set of words from all comments to be exported to word cloud
  getComment() {
    this.combined = 'testing...';
    this.server.getComments().then((response: any) => {
      this.combined = '';
      this.comments = [];
      const size = response.length;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < response.length; i++) {
        if (response[i].survey_id === this.surveyId) {
          const cmt  = {
            surveyId: 0,
            commentID: 0,
            question: '',
            response: ''
          };
          cmt.surveyId = response[i].survey_id;
          cmt.commentID = response[i].comment_id;
          cmt.question = response[i].question;
          cmt.response = response[i].response;
          this.combined = this.combined.concat(' ').concat(response[i].response);
          this.comments.push(cmt);
        }
      }
      Data.data = this.combined;
    });
  }

}


