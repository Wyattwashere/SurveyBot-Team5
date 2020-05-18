// this component contains the section of a survey page for adding, displaying a list of, and deleting tags

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServerService } from '../services/server.service';
import { SharedService } from '../services/shared.service';
import { ActivatedRoute } from '@angular/router';
//import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.css']
})
export class TagFormComponent implements OnInit {
  tag  = {
    id: 0,
    name: ''
  };
  tags = [];

  message: string;
  public surveyID;

  constructor(private shared: SharedService, private server: ServerService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    // tslint:disable-next-line: radix
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.surveyID = id;
    this.getSurveyTags();
    this.shared.currentMessage.subscribe(message => this.message = message);
    this.shared.currentSurvID.subscribe(surveyID => this.surveyID = surveyID);
    this.shared.tagSending.subscribe(
      (tagName) => {
        if (tagName != null) {
          const dbInfo = {
            tag_name : tagName,
            survey_id : this.surveyID
          };

          this.server.addTagForSurvey(dbInfo).then(() => {
            this.getSurveyTags();
          });
        }
      }
    );
  }

  onClick() {
    const tag = {name: this.tag.name};
    this.shared.changeMessage(this.tag.name);

    const dbInfo = {
      tag_name : this.tag.name,
      survey_id : this.surveyID
    };

    this.server.addTagForSurvey(dbInfo).then(() => {
      this.getSurveyTags();
    });
  }

  addToSurvey(tag) {
    this.getSurveyTags();

    let newTagID;
    // console.log('Tag 1 : ' + tag.name);

    // tslint:disable-next-line: forin
    for (const key in this.tags) {
      // console.log('Tag 2 : ' + this.tags[key].name);

      if (this.tags[key].name === tag.name) {
        newTagID = this.tags[key].id;
      }
    }

    const tagAddToSurvey = {
      survey_id: this.surveyID,
      tag_id: newTagID
    };
    this.server.addTagForSurvey(tagAddToSurvey).then(() => {
      this.getSurveyTags();
    });
  }

  onEdit(item) {
    this.tag = item;
  }

  onDelete(item) {
    // tslint:disable-next-line: only-arrow-functions
    const ind = this.tags.map(function(tg) { return tg.id; }).indexOf(item.id);

    this.server.deleteEvent(this.tags[ind]).then(() => {
      this.getSurveyTags();
    });
  }

  getSurveyTags() {
    this.server.getTagsForSurvey(this.surveyID).then((response: any) => {
      this.tags = response.map((tg) => {
        tg.name = tg.tag_name;
        tg.id = tg.tag_id;
        return tg;
      });
    });
  }

}
