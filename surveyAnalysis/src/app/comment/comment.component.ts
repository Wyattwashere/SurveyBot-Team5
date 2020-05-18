import { Component, OnInit, Input, HostListener } from '@angular/core';
import * as Sentiment from 'sentiment';
import { SharedService } from '../services/shared.service';
import { ServerService } from '../services/server.service';
import { ModalService } from '../services/modal.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() inputComment: any;

  sentiment = new Sentiment();
  analyzed = null;
  sentimentShown = false;
  surveyTags = [];
  tags = [];
  keys = [];
  surveyID;
  commentID;
  delTagModal;
  addTagModal;

  results = {
    score: null,
    positive: null,
    negative: null,
    keys: null
  };

  constructor(private shared: SharedService, private server: ServerService, private modal: ModalService) {
    this.shared.sentimentShown.subscribe(
      (sentShown) => {
        this.sentimentShown = sentShown;
        if (this.sentimentShown === true) {
          this.doSentiment();
        }
      }
    );
  }

  ngOnInit() {
    this.shared.currentSurvID.subscribe(surveyID => this.surveyID = surveyID);
    this.commentID = this.inputComment.commentID;
    this.delTagModal = this.commentID.toString().concat('d');
    this.addTagModal = this.commentID.toString().concat('a');
    this.getCommentTags();
    this.getSurveyTags();
  }

  onClickAdd() {
    this.openModal(this.addTagModal);
  }

  onClickDelete() {
    this.openModal(this.delTagModal);
  }

  openModal(id: string) {
    this.modal.open(id);
  }

  closeModal(id: string) {
    this.modal.close(id);
  }

  getCommentTags() {
    this.server.getTagsForComment(this.commentID).then((response: any) => {
      this.tags = response.map((tg) => {
        tg.name = tg.tag_name;
        tg.id = tg.id;
        return tg;
      });
    });
  }

  getSurveyTags() {
    this.server.getTagsForSurvey(this.surveyID).then((response: any) => {
      this.surveyTags = response.map((tg) => {
        tg.name = tg.tag_name;
        tg.id = tg.tag_id;
        return tg;
      });
    });
  }

  addTag(tag) {
    const commentTagInfo = {
      comment_id: this.commentID,
      tag_id: tag.id
    };

    this.server.addTagForComment(commentTagInfo).then(() => {
      this.getCommentTags();
    });
  }

  deleteTag(tag) {
    const commentTagInfo = {
      comment_id: this.commentID,
      tag_id: tag.tag_id
    };

    this.server.deleteTagForComment(commentTagInfo).then(() => {
      this.getCommentTags();
      this.closeModal(this.delTagModal);
    });
  }

  doSentiment() {
    this.analyzed = this.sentiment.analyze(this.inputComment.response);
    this.results.score = this.analyzed.score;
    this.results.positive = this.analyzed.positive;
    this.results.negative = this.analyzed.negative;
    this.results.keys = this.results.negative + ',' + this.analyzed.positive;
    this.generateList();
  }

  private generateList() {
    const filteredList = this.results.keys.split(',').filter(Boolean);
    this.keys = filteredList;
  }

}
