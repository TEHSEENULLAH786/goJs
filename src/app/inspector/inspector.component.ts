import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.css']
})
export class InspectorComponent implements OnInit, OnChanges {

  constructor() { }
  @Input() item;
  ngOnInit(): void {
  }
  ngOnChanges(){
    this.item
  }

}
