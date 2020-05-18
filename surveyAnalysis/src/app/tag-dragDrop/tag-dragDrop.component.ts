import {Component, OnInit, ElementRef} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
import { SharedService } from '../services/shared.service';
import { CommentDragDropComponent } from '../comment-dragDrop/comment-dragDrop.component';

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'app-tag-drag-drop',
  templateUrl: 'tag-dragDrop.component.html',
  styleUrls: ['tag-dragDrop.component.css'],
})
export class TagDragDropComponent implements OnInit{
  tags = [];
  tags2 = [];
  comments = [];
  grabbedComments = [];

  public surveyId;

  constructor(private shared: SharedService, private server: ServerService, private route: ActivatedRoute,private elementRef: ElementRef){
    this.resetList();
  }

  ngOnInit() {
    let id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.surveyId = id;
    this.getSurveyTags();
    this.resetList();
    this.shared.tagSending.subscribe(
      (tagName) => {
        if(tagName != null){
          this.getSurveyTags();
          this.resetList();
        }
      }
    );
  }

  private resetList() {
    this.tags2 = [];
    setTimeout(() => {
      this.tags2 = this.tags.slice();
    }, 0);
  }

  getSurveyTags() {
    this.server.getTagsForSurvey(this.surveyId).then((response: any) => {
      this.tags = response.map((tg) => {
        //tg.name = tg.tag_name;
        //tg.id = tg.id;
        return tg.tag_name;
      });
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.resetList();
  }

  search(commDragDrop: CommentDragDropComponent) {
    var parentNode = this.elementRef.nativeElement.parentNode;
    var textBoxContent = parentNode.firstChild.nextSibling.firstChild.firstChild.nextSibling.nextSibling.value;
    var commentsLoc = document.getElementsByClassName("comment");
    //var commentStructure = commentsLoc.firstChild.nextSibling.nextSibling;

    //commentStructure.nextSibling = commentStructure;
    //commentStructure.nextSibling.innerText = textBoxContent;
    //commentStructure.nextSibling.outerText = textBoxContent;


    console.log(parentNode);
    console.log(textBoxContent);

    commentsLoc[1].firstChild.firstChild.textContent = textBoxContent;

    console.log(commentsLoc[0]);

    var child = commentsLoc[0].firstElementChild.lastElementChild;
    while(child) {
      commentsLoc[0].firstElementChild.removeChild(child);
      child = commentsLoc[0].firstElementChild.lastElementChild;
    }

    this.getComment(textBoxContent, commentsLoc[0].firstElementChild);
  }

  async getComment(keyword: string, parent: Element){
    this.grabbedComments = [];
    await this.server.getComments().then((response: any) => {
      console.log('Response: ', response);
      var size = response.length;
      for (var i = 0; i < size; i++) {
          var cmt  = {
            surveyId: 0,
            question: '',
            response: ''
          };
          cmt.surveyId = response[i].survey_id;
          cmt.question = response[i].question;
          cmt.response = response[i].response;
          if(cmt.response.includes(keyword)) {
            this.comments.push(cmt);
            console.log('ACCEPTED: ',cmt)

            var listEl = document.createElement("li");

            var span = document.createElement("span");
            listEl.appendChild(span);
            var b = document.createElement("b");
            span.appendChild(b);
            var bText = document.createTextNode(cmt.question);
            b.appendChild(bText);

            var appComment = document.createElement("app-comment");
            span.appendChild(appComment);
            var groupDiv = document.createElement("div");
            appComment.appendChild(groupDiv);

            var sentimentDiv = document.createElement("div");
            sentimentDiv.classList.add("sentiment");
            groupDiv.appendChild(sentimentDiv);
            var taggingDiv = document.createElement("div");
            taggingDiv.classList.add("tagging");
            groupDiv.appendChild(taggingDiv);
            var commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            groupDiv.appendChild(commentDiv);

            var innerDiv = document.createElement("div");
            taggingDiv.appendChild(innerDiv);
            var tagText = document.createTextNode(" Tags: ");
            innerDiv.appendChild(tagText);

            var innerCom = document.createElement("div");
            commentDiv.appendChild(innerCom);
            var p = document.createElement("p");
            innerCom.appendChild(p);
            var com = document.createTextNode(cmt.response);
            p.appendChild(com);


            parent.appendChild(listEl);
          }
          else {
            console.log('DENIED: ',cmt);
          }

        //}
      }

      // this.comments = response.map((cmt) =>{
      //   cmt.response = cmt.response;
      //   return cmt;
      // });
    });
  }
}


