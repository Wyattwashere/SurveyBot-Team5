// This component contains all the functionality for displaying a D3 word cloud
// Usage from https://github.com/jasondavies/d3-cloud


import { Component, OnInit, ElementRef, ViewChild, DoCheck, Input, AfterViewInit} from '@angular/core';
import * as D3 from 'd3';
import { SharedService } from '../services/shared.service';
import { getRandomString } from 'selenium-webdriver/safari';
// import { ConsoleReporter } from 'jasmine';

declare let d3: any;

// tslint:disable-next-line: no-conflicting-lifecycle
@Component({
  selector: 'app-word-cloud',
  template: `
     <app-stopword-manager (stopwordData)="receiveStopwords($event)"></app-stopword-manager>
     <button class="btn btn-primary" type="button" (click)="onClick()">Refresh</button>
     <div #cloud class='word-cloud'></div>
     `
})
export class WordCloudComponent implements OnInit {

  @ViewChild('cloud', {static: false}) el: ElementRef;

  @Input() wordData;
  data = [];

  private svg;               // SVG in which we will print our chart
  private margin: {          // Space between the svg borders and the actual chart graphic
    top: number,
    right: number,
    bottom: number,
    left: number
  };
  private width: number;      // Component width
  private height: number;     // Component height
  private fillScale;          // D3 scale for text color
  tempData = [];

  private htmlElement: HTMLElement; // Host HTMLElement
  private minCount: number;   // Minimum word count
  private maxCount: number;   // Maximum word count
  private fontScale;          // D3 scale for font size
  private objDiffer;

  private stopWords = [];

  constructor(private shared: SharedService) {
    this.shared.refreshing.subscribe();
    this.shared.tagSending.subscribe();
  }

  ngOnInit() {
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {
    this.createWordList();
    this.setup();
    this.buildSVG();
    this.populate();
  }

  onClick() {
    this.shared.refresh();
    this.createWordList();
    this.svg.selectAll('*').remove();
    this.populate();
  }

  receiveStopwords(event) {
    this.stopWords = event;
  }

  private createWordList() {
    const cls = this;

    // make this its own file
    const nonStopWords = [];
    const total = this.stopWords;
    this.data = this.wordData.data.toLowerCase().split(/[ ,.!?]+/g);

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.data.length; i++) {
      if (total.indexOf(this.data[i]) === -1 && isNaN(this.data[i])) {
        nonStopWords.push(this.data[i]);
      }
    }

    const keywords = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < nonStopWords.length; i++) {
      if (nonStopWords[i] in keywords) {
        keywords[nonStopWords[i]] += 1;
      } else {
        keywords[nonStopWords[i]] = 1;
      }
    }

    this.data = [];

    // scale size of words based on total amount of words
    const totalNumOfWords = Object.keys(keywords).length / 100;
    for (const word in keywords) {
      if (keywords.hasOwnProperty(word)) {
        this.data.push({text: word, size: keywords[word] / totalNumOfWords});
      }
    }
  }

  private getRandom() {
    const cls = this;
    const size = 10 + Math.random() * 100;
    if (size > 70 && this.tempData.length <= 10) {
      this.tempData.push(size);
    }
    if (this.tempData.length > 10 && size > 14) {
      return 12;
    }

    return size;
  }

  private setup() {
    this.margin = {
      top   : 10,
      right : 10,
      bottom: 10,
      left  : 10
    };

    // NEED TO CHANGE
    this.width = (this.el.nativeElement as HTMLElement).offsetWidth - this.margin.left - this.margin.right;
    this.height = window.innerHeight - this.margin.top - this.margin.bottom;
    // this.width = window.innerWidth - this.margin.left - this.margin.right;
    // this.height = window.innerHeight - this.margin.top - this.margin.bottom;

    this.fillScale = D3.scaleOrdinal(D3.schemeCategory10);
  }

  private buildSVG() {
    this.svg = D3.select('div.word-cloud')
                    .append('svg')
                    .attr('width', this.width + this.margin.left + this.margin.right)
                    .attr('height', this.height + this.margin.top + this.margin.bottom)
                    .append('g')
                    // tslint:disable-next-line: no-bitwise
                    .attr('transform', 'translate(' + ~~(this.width / 2) + ',' + ~~(this.height / 2) + ')');
  }

  private populate() {
    const fontFace: string = (this.wordData.settings.fontFace == null) ? 'Roboto' : this.wordData.settings.fontFace;
    const fontWeight: string = (this.wordData.settings.fontWeight == null) ? 'normal' : this.wordData.settings.fontWeight;
    const spiralType: string = (this.wordData.settings.spiral == null) ? 'archimedean' : this.wordData.settings.spiral;

    d3.layout.cloud()
      .size([this.width, this.height])
      .words(this.data) // .words(this.config.dataset)
      // .rotate(() => 0)
      .padding(5)
      .rotate(() => {
        // return ((Math.random() * 2) * 90);
        // vertical & horizontal only
        // tslint:disable-next-line: no-bitwise
        return (~~(Math.random() * 2) * 90);
      })
      .font(fontFace)
      .fontWeight(fontWeight)
      .fontSize(d => (d.size * 50))
      // .fontSize(d => this.fontScale(d.count))
      .spiral(spiralType)
      .on('end', () => {
        this.drawWordCloud(this.data); // this.config.dataset
      })
      .start();
  }

  private addTag(text) {
    const r = confirm('Add tag?');
    if (r === true) {
      this.shared.sendTag(text);
    }
  }

  private drawWordCloud(words) {
    this.svg
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        // tslint:disable-next-line: only-arrow-functions
        .style('font-size', function(d) { return d.size; })

        .style('fill', (d, i) => {

          return this.fillScale(i);
        })

        .attr('text-anchor', 'middle')
        .attr('transform', d => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
        .attr('class', 'word-cloud')
        .text(d => {
          return d.text;
        })
        .on('click', (d) => {
          return this.addTag(d.text);
        });
  }



}
