import {Component, Injectable, Input, Output, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class SharedService {

  private messageSource = new BehaviorSubject<string>(null);
  private refreshSource = new BehaviorSubject<string>(null);
  private sentimentSource = new BehaviorSubject<boolean>(null);
  private surveyIDSource = new BehaviorSubject<number>(null);
  private tagSendSource = new BehaviorSubject<string>(null);

  currentMessage = this.messageSource.asObservable();
  refreshing = this.refreshSource.asObservable();
  sentimentShown = this.sentimentSource.asObservable();
  currentSurvID = this.surveyIDSource.asObservable();
  tagSending = this.tagSendSource.asObservable();

  constructor() {

  }

  getCurrentSurveyID(id: number){
    this.surveyIDSource.next(id);
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  refresh() {
    this.refreshSource.next(null);
  }

  toggleSentiment(shown: boolean) {
    this.sentimentSource.next(shown);
  }

  sendTag(tagName: string) {
    this.tagSendSource.next(tagName);
  }
}
