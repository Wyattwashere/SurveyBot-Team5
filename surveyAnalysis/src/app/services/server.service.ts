import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

    constructor(private http: HttpClient) {
    }

    private async request(method: string, url: string, data?: any) {

      const result = this.http.request(method, url, {
        body: data,
        responseType: 'json',
        observe: 'body',
        headers: {
        }
      });
      return new Promise((resolve, reject) => {
        result.subscribe(resolve, reject);
      });
    }

    importSurvey(params) {
      return this.request('POST', `${environment.serverUrl}/import`, params);
    }

    importQuestions(params) {
      return this.request('POST', `${environment.serverUrl}/import/questions`, params);
    }

    uploadSurvey() {
      return this.request('POST', `${environment.serverUrl}/import/upload`);
    }

    exportSurvey(params) {
      return this.request('GET', `${environment.serverUrl}/export`, params);
    }

    getSurveys() {
      return this.request('GET', `${environment.serverUrl}/survey`);
    }

    createSurvey(survey) {
      return this.request('POST', `${environment.serverUrl}/survey`, survey);
    }

    deleteSurvey(info){
      return this.request('DELETE', `${environment.serverUrl}/survey`, info);
    }

    // TODO: change all names with "Events" to "Tags"
    getEvents() {
      return this.request('GET', `${environment.serverUrl}/tag`);
    }

    getTagsForSurvey(survey_id) {
      return this.request('GET', `${environment.serverUrl}/tag/survey/${survey_id}`);
    }

    addTagForSurvey(info) {
      return this.request('POST', `${environment.serverUrl}/tag/survey/${info.survey_id}/insert`, info);
    }

    addTagForComment(info) {
      return this.request('POST', `${environment.serverUrl}/tag/comment/${info.comment_id}/insert`, info);
    }

    deleteTagForComment(info) {
      return this.request('DELETE', `${environment.serverUrl}/tag/comment/delete`, info);
    }

    getTagsForComment(comment_id) {
      return this.request('GET', `${environment.serverUrl}/tag/comment/${comment_id}`);
    }

    createStopword(info) {
      return this.request('POST', `${environment.serverUrl}/stopword/survey/${info.survey_id}/insert`, info);
    }

    getStopwords(survey_id) {
      return this.request('GET', `${environment.serverUrl}/stopword/survey/${survey_id}`);
    }

    // TODO: change all names with "Events" to "Tags"
    createEvent(tag) {
      return this.request('POST', `${environment.serverUrl}/tag`, tag);
    }

    // TODO: change all names with "Events" to "Tags"
    updateEvent(tag) {
      return this.request('PUT', `${environment.serverUrl}/tag/${tag.id}`, tag);
    }

    // TODO: change all names with "Events" to "Tags"
    deleteEvent(tag) {
      return this.request('DELETE', `${environment.serverUrl}/tag/${tag.id}`);
    }

    getComments() {
      return this.request('GET', `${environment.serverUrl}/comment`);
    }

    createComment(comment) {
      return this.request('POST', `${environment.serverUrl}/comment`, comment);
    }

    updateComment(comment) {
      return this.request('PUT', `${environment.serverUrl}/comment/${comment.id}`, comment);
    }
}
