import { Component, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs';
import { GojsServiceService } from './gojs-service.service';
declare var Inspector: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  tepjson = {} as any;
  nodeInspector = new Array<any>();
  constructor(public GojsServiceService: GojsServiceService) { }
  private myDiagram: go.Diagram = new go.Diagram();
  private myPalette: go.Palette = new go.Palette();
  nodeDataArray: any;
  getNodeArray: any;
  linkDataArray: any;
  insertedProperties = [];
  resultasas:boolean = false;
  nodeArray = new Array<any>();
  ngOnInit() {
    const $ = go.GraphObject.make;
    this.myDiagram = $(go.Diagram, "myDiagramDiv",
      {
        "clickCreatingTool.archetypeNodeData": { text: "Node", color: "white" },
        "commandHandler.archetypeGroupData": { text: "Group", isGroup: true, color: "blue" },
        "undoManager.isEnabled": true,
        mouseDrop: (e: any) => this.finishDrop(e, null),
      });

    go.Shape.defineFigureGenerator("RoundedHalfRectangle", function (shape, w, h) {
      var param1 = shape ? shape.parameter1 : NaN;
      if (isNaN(param1) || param1 < 0) param1 = 3;
      param1 = Math.min(param1, w / 3);
      param1 = Math.min(param1, h / 3);

      var cpOffset = param1 * 4 * ((Math.sqrt(2) - 1) / 3);
      var geo = new go.Geometry()
        .add(new go.PathFigure(param1, 0, true)
          .add(new go.PathSegment(go.PathSegment.Line, w - param1, 0))
          .add(new go.PathSegment(go.PathSegment.Bezier, w, param1, w - cpOffset, 0, w, cpOffset))
          .add(new go.PathSegment(go.PathSegment.Line, w, h))
          .add(new go.PathSegment(go.PathSegment.Line, 0, h))
          .add(new go.PathSegment(go.PathSegment.Line, 0, param1))
          .add(new go.PathSegment(go.PathSegment.Bezier, param1, 0, 0, cpOffset, cpOffset, 0).close()));
      if (cpOffset > 1) {
        geo.spot1 = new go.Spot(0, 0, cpOffset, cpOffset);
        geo.spot2 = new go.Spot(1, 1, -cpOffset, -cpOffset);
      }
      return geo;
    });


    var simpletemplateGroup = new go.Group("Auto",
      {
        mouseDragEnter: (e, grp, prev) => this.highlightGroup(e, grp, true),
        mouseDragLeave: (e, grp, next) => this.highlightGroup(e, grp, false),
        computesBoundsAfterDrag: true,
        mouseDrop: this.finishDrop,
        handlesDragDropForMembers: true,
        background: "transparent",
        defaultAlignment: go.Spot.Left,
        opacity: 1,
        layout: this.makeLayout(true)

      })
      .add(new go.Shape("RoundedHalfRectangle", {
        stroke: "transparent", strokeWidth: 0, fill: "transparent",
        portId: "", cursor: "pointer",
        fromLinkable: true,
        toLinkable: true,
        // fromLinkableSelfNode: true,
        // toLinkableSelfNode: true,
        // fromLinkableDuplicates: true,
        // toLinkableDuplicates: true
      }))
      .add(new go.Panel("Vertical", {
        background: "transparent", areaBackground: "rgb(0,189,255,0.1)", defaultAlignment: go.Spot.Left,

      })
        .add(new go.Panel("Auto", { stretch: go.GraphObject.Fill })

          .add(new go.Shape("RoundedHalfRectangle", {
            fill: "rgb(0,189,255)", stroke: "rgb(0,189,255)", stretch: go.GraphObject.Fill, desiredSize: new go.Size(180, 15), strokeJoin: "miter", strokeWidth: 3

          }
          )
            .bind("fill", "color")
            .bind("stroke", "color"))


          .add(new go.TextBlock(
            {
              editable: true,
              margin: 2,
              width: 60,
              font: this.defaultFont(true),
              opacity: 1,
              stroke: "#fff",
              alignment: go.Spot.Left,

            })
            .bind("text", "text", null, null))
          .add(new go.Picture("/assets/top.png", {
            width: 15,
            height: 12,
            margin: 2,
            name: "helo",

            alignment: go.Spot.Right,
            click: function (e, obj: any) {

              var shape = obj.part.findObject("helo");
              if (shape) shape.angle += 180;
              var group = obj.part;
              if (group instanceof go.Group) {
                var isExpanded = group.isSubGraphExpanded || undefined
                group.isAnimated = false
              }
              var diagram = group.diagram;
              var cmd = diagram.commandHandler;
              if (isExpanded) {
                cmd.collapseSubGraph();
              } else {
                cmd.expandSubGraph();
              }
            }
          }
          )
          )
        )
        .add(new go.Placeholder({ padding: 10 }))

      )
    var detailtemplateGroup = new go.Group("Auto",
      {
        mouseDragEnter: (e, grp, prev) => this.highlightGroup(e, grp, true),
        mouseDragLeave: (e, grp, next) => this.highlightGroup(e, grp, false),
        computesBoundsAfterDrag: true,
        mouseDrop: this.finishDrop,
        handlesDragDropForMembers: true,
        background: "transparent",
        defaultAlignment: go.Spot.Left,
        opacity: 1,
        layout: this.makeLayout(true)

      })
      .add(new go.Shape("RoundedHalfRectangle", {
        stroke: "transparent", strokeWidth: 5, fill: "transparent",
        portId: "", cursor: "pointer",
        fromLinkable: true,
        toLinkable: true,
        // fromLinkableSelfNode: true,
        // toLinkableSelfNode: true,
        // fromLinkableDuplicates: true,
        // toLinkableDuplicates: true
      }))
      .add(new go.Panel("Vertical", {
        background: "transparent", areaBackground: "rgb(0,189,255,0.1)", defaultAlignment: go.Spot.Left,

      })
        .add(new go.Panel("Auto", { stretch: go.GraphObject.Fill })

          .add(new go.Shape("RoundedHalfRectangle", {
            fill: "rgb(0,189,255)", stroke: "rgb(0,189,255)", stretch: go.GraphObject.Fill, desiredSize: new go.Size(180, 15), strokeJoin: "miter", strokeWidth: 3

          }
          )
            .bind("fill", "color")
            .bind("stroke", "color"))


          .add(new go.TextBlock(
            {
              editable: true,
              margin: 2,
              width: 60,
              font: this.defaultFont(true),
              opacity: 1,
              stroke: "#fff",
              alignment: go.Spot.Right,

            })
            .bind("text", "text", null, null))
          .add(new go.Picture("/assets/top.png", {
            width: 15,
            height: 12,
            margin: 2,
            name: "helo",

            alignment: go.Spot.Left,
            click: function (e, obj: any) {

              var shape = obj.part.findObject("helo");
              if (shape) shape.angle += 180;
              var group = obj.part;
              if (group instanceof go.Group) {
                var isExpanded = group.isSubGraphExpanded || undefined
                group.isAnimated = false
              }
              var diagram = group.diagram;
              var cmd = diagram.commandHandler;
              if (isExpanded) {
                cmd.collapseSubGraph();
              } else {
                cmd.expandSubGraph();
              }
            }
          }
          )
          )
        )
        .add(new go.Placeholder({ padding: 10 }))

      )



    var detailtemplate =
      new go.Node("Auto",
        {
          mouseDrop: (e, node) => this.finishDrop(e, node),
        })
        .add(new go.Shape({
          stroke: "rgb(0,189,255,0.0)", strokeWidth: 2, fromLinkable: true, toLinkable: true, portId: "", cursor: "pointer",
          // fromLinkableSelfNode: true,
          // toLinkableSelfNode: true,
          // fromLinkableDuplicates: true,
          // toLinkableDuplicates: true
        }))
        .add(new go.Panel("Horizontal", { background: "rgb(0,189,255)" })
          .add(new go.Shape("Rectangle", { fill: "rgb(0,189,255)", stroke: null, width: 30, height: 20, alignment: go.Spot.Left }))
          .add(new go.Panel("Auto", { background: "#fff" })
            .add(new go.Shape("Rectangle", {
              fill: "#fff", stroke: null, width: 123, height: 20, alignment: go.Spot.Right, portId: "", cursor: "pointer", fromLinkable: true,
              toLinkable: true,
              // fromLinkableSelfNode: false,
              // toLinkableSelfNode: false,
              // fromLinkableDuplicates: true,
              // toLinkableDuplicates: true
            })
              .bind("fill", "color")
            )
            .add(new go.TextBlock(
              {
                margin: 3,
                editable: true,
                font: "6px sans-serif",
                height: 10,
                alignment: go.Spot.Left,
              })
              .bind(new go.Binding("text").makeTwoWay()))
          )
          .add(new go.Panel("Auto", { background: "#fff" })
            .add(new go.Shape("Rectangle", {
              fill: null,
              stroke: null,
              width: 15,
              height: 20,
              alignment: go.Spot.Right
            })
              .bind("fill", "color")
            )
            .add(new go.TextBlock(
              {
                margin: 3,
                editable: true,
                font: "6px sans-serif",
                height: 10,
                alignment: go.Spot.Left,
              })
              .bind('text', 'primary_key'))
          )
        )


    var simpletemplate =
      new go.Node("Auto",
        {
          mouseDrop: (e, node) => this.finishDrop(e, node),
        })
        .add(new go.Shape({
          stroke: "rgb(0,189,255,0.0)",
          strokeWidth: 2,
          fromLinkable: true,
          toLinkable: true,
          portId: "",
          cursor: "pointer",
          // fromLinkableSelfNode: true,
          // toLinkableSelfNode: true,
          // fromLinkableDuplicates: true,
          // toLinkableDuplicates: true
        }))
        .add(new go.Panel("Horizontal", { background: "rgb(0,189,255)" })
          .add(new go.Shape("Rectangle", { fill: "rgb(0,189,255)", stroke: null, width: 3, height: 20, alignment: go.Spot.Left }))
          .add(new go.Panel("Auto", { background: "#fff" })
            .add(new go.Shape("Rectangle", {
              fill: "#fff",
              stroke: null,
              width: 150,
              height: 20,
              alignment: go.Spot.Right,
              portId: "",
              cursor: "pointer",
              fromLinkable: true,
              toLinkable: true,
              // fromLinkableSelfNode: false,
              // toLinkableSelfNode: false,
              // fromLinkableDuplicates: true,
              // toLinkableDuplicates: true
            })
              .bind("fill", "color")
            )
            .add(new go.TextBlock(
              {
                margin: 3,
                editable: true,
                font: "6px sans-serif",
                height: 10,
                alignment: go.Spot.Left,
              })
              .bind(new go.Binding("text").makeTwoWay())
              .bind('text', 'PK'))
          )
          .add(new go.Panel("Auto", { background: "#fff" })
            .add(new go.Shape("Rectangle", {
              fill: null,
              stroke: null,
              width: 15,
              height: 20,
              alignment: go.Spot.Right
            })
              .bind("fill", "color")
            )
            .add(new go.TextBlock(
              {
                margin: 3,
                editable: true,
                font: "6px sans-serif",
                height: 10,
                alignment: go.Spot.Left,
              })
              .bind('text', 'primary_key'))
          )
        )

    var detailedNew = new go.Node("Auto",
      {
        mouseDrop: (e, node) => this.finishDrop(e, node),
      })
      .add(new go.Shape({
        stroke: "rgb(0,189,255,0.0)",
        strokeWidth: 2,
        fromLinkable: true,
        toLinkable: true,
        portId: "",
        cursor: "pointer",
        // fromLinkableSelfNode: true,
        // toLinkableSelfNode: true,
        // fromLinkableDuplicates: true,
        // toLinkableDuplicates: true
      }))
      .add(new go.Panel("Horizontal", { background: "rgb(0,189,255)" })
        .add(new go.Shape("Rectangle", { fill: "rgb(0,189,255)", stroke: null, width: 3, height: 20, alignment: go.Spot.Left }))
        .add(new go.Panel("Auto", { background: "#fff" })
          .add(new go.Shape("Rectangle", {
            fill: "#fff",
            stroke: null,
            width: 150,
            height: 20,
            alignment: go.Spot.Right,
            portId: "",
            cursor: "pointer",
            fromLinkable: true,
            toLinkable: true,
            // fromLinkableSelfNode: false,
            // toLinkableSelfNode: false,
            // fromLinkableDuplicates: true,
            // toLinkableDuplicates: true
          })
            .bind("fill", "color")
          )
          .add(new go.TextBlock(
            {
              margin: 3,
              editable: true,
              font: "6px sans-serif",
              height: 10,
              alignment: go.Spot.Left,
            })
            .bind(new go.Binding("text").makeTwoWay())
          )
        )
        .add(new go.Panel("Auto", { background: "#fff" })
          .add(new go.Shape("Rectangle", {
            fill: null,
            stroke: null,
            width: 15,
            height: 20,
            alignment: go.Spot.Right
          })
            .bind("fill", "color")
          )
          .add(new go.TextBlock(
            {
              margin: 3,
              editable: true,
              font: "6px sans-serif",
              height: 10,
              alignment: go.Spot.Left,
            })
            .bind('text', 'foreign_key'))
        )
      )


    var templmap = new go.Map<string, go.Node>() // In TypeScript you could write: new go.Map<string, go.Node>();
    templmap.add("detailed", detailtemplate);
    templmap.add("simple", simpletemplate);
    templmap.add("detailedNew", detailedNew);

    var templmapForGroup = new go.Map<string, go.Group>() // In TypeScript you could write: new go.Map<string, go.Node>();
    templmapForGroup.add("detailedGroup", detailtemplateGroup);
    templmapForGroup.add("simpleGroup", simpletemplateGroup);

    this.myDiagram.linkTemplate = $(go.Link, { toShortLength: 3, relinkableFrom: true, relinkableTo: true, routing: go.Link.AvoidsNodes },
      $(go.Shape,
        { strokeWidth: 2 },
        new go.Binding("stroke", "color")),
        
    ),

    this.linkDataArray = [
      // { from: 3, to: 4 },
      // { from: 8, to: 9, },
    ];

    this.myPalette = new go.Palette("myPaletteDiv",
      {
        nodeTemplateMap: templmap,
        groupTemplateMap: templmapForGroup
      });

    this.myPalette.model = new go.GraphLinksModel([
      { isGroup: true, text: "H Group", horiz: true, category: "simpleGroup" },
      { isGroup: true, text: "H Group", horiz: true, category: "detailedGroup" },
      { text: "New Node", color: "white", category: "detailed" },
      { text: "New Node", color: "white", category: "simple" }
    ]);


    this.myDiagram.toolManager.linkingTool.linkValidation = this.sameGroup;
    this.myDiagram.toolManager.relinkingTool.linkValidation = this.sameGroup;

    this.nodeDataArray = [
      { key: 3, text: "Gamma", color: "lightgreen", isGroup: true, category: "detailedGroup"},
      { key: 4, text: "Delta", color: "grey", isGroup: true, category: "simpleGroup" },
      { key: 5, text: "node1", color: "pink", group: 3, category: "simple", primary_key: 'PK' },
      { key: 6, text: "node99", color: "orange", group: 3, category: "simple", primary_key: 'PK' },
      { key: 30, text: "Gamma", color: "lightgreen", isGroup: true, category: "detailedGroup" },
      { key: 50, text: "node1", color: "red", group: 30, category: "simple", primary_key: 'PK' },
    ];

    this.myDiagram.animationManager.isEnabled = false;
    this.myDiagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
    this.myDiagram.nodeTemplateMap = templmap;
    this.myDiagram.groupTemplateMap = templmapForGroup;
    this.myDiagram.addDiagramListener("ObjectSingleClicked", (ev) => {
      var part = ev.subject.part;
      if (!(part instanceof go.Link)) {
        this.showMessage(part.data)
      }
    });
    this.myDiagram.addDiagramListener("LinkDrawn", (e) => {

      var from = e.subject.fromNode;
      console.log(e.subject)
      var to = e.subject.toNode;
      var groupTo = to.qb.key
      var fromKeyAtt;
      var toKey = e.subject.toNode.key;
      var it = from.memberParts;
      var itOn = from.memberParts;
      var keyArray = []
      while (it.next()) {
        var item = it.value;
        fromKeyAtt = item.data.key
        
        if (item.data.primary_key == "PK") {
          var new_key = 'FK'
          if(!this.resultasas){
            for (var x in item.data) {
              this.tepjson[x] = item.data[x];
            }
            // this.linkDataArray = [
            //   // { from: 3, to: 4 },
            //   // { from: 8, to: 9, },
            // ];
            this.myDiagram.model.addNodeData({ category: this.tepjson?.category, color: this.tepjson.color, group: groupTo, key: this.tepjson.key, primary_key: new_key, text: this.tepjson.text, foreign_key:this.tepjson.key });
            keyArray.push(this.tepjson.key)
            console.log('member de', to.memberParts)
             
            this.resultasas = false
          }
          
        }
        this.nodeDataArray
        

      }
      var itTo = to.memberParts
      // itOn.Wf.Pb.forEach((element, index) => {
      //   var itemToNew = element.value.data
      //   if (itemToNew.primary_key == "FK") {
      //           (this.myDiagram.model as go.GraphLinksModel).addLinkData( { from: this.tepjson.key, to: itemToNew.data.key})          
      //       }
      // });
      
      Object.keys( itTo.Wf.Pb).forEach((key, i) => {
        var itemToNew = itTo.Wf.Pb[key].value.data
        Object.keys( it.Wf.Pb).forEach((keyO, iO) => {
          var itemfromNew = it.Wf.Pb[keyO].value.data
          if(itemToNew.foreign_key != undefined && itemToNew.foreign_key === itemfromNew.key && itemToNew.primary_key == "FK"){
            (this.myDiagram.model as go.GraphLinksModel).addLinkData( { from: keyArray[iO], to: itemToNew.key, color:'transparent'})          

          }

        });
      });

      // while (itTo.next()) {
      //   counter++
      //   var itemTo = itTo.value;
        
      //   if (itemTo.data.primary_key == "FK" && counter === 1) {
      //       (this.myDiagram.model as go.GraphLinksModel).addLinkData( { from: this.tepjson.key, to: itemTo.data.key, visible:false })          

          
      //   }
        // this.nodeDataArray
        

      // } 

     
    // }
    }
    );
    this.myDiagram.addDiagramListener('SelectionDeleting', (e) => {

      var itr = e.subject.iterator;
      let deletionList = []
      let deletionListFromNode = []
      // let localList = []
      while (itr.next()) {
        var item = itr.value;
        console.log('partitem',item)
        if (item) {
          if(item.data.key){
            deletionListFromNode.push(item.data)
            this.deleteFromNode(deletionListFromNode)

          }
          deletionList.push(item.data)
        } 
      }
      if (deletionList.length > 0) {
        this.deleteNode(deletionList, itr, e)
      } 
  
    })



    new Inspector('myInspector', this.myDiagram,
      {
        multipleSelection: true,
        showSize: 2,
        // showAllProperties: true,

        properties: {
          "text": {},
          "key": { readOnly: true, show: Inspector.showIfPresent },
          "color": { show: Inspector.showIfPresent, type: 'color' },
          "isGroup": { readOnly: true, show: Inspector.showIfPresent },
          "primary_key": {  },
        }
      });
  }
  removeChildLinks(part, e) {

    part.data['deleted'] = true;
    let to = part.data["to"]
    let node = e.diagram.findNodeForKey(to)
    if (node) {
      let itr = node.findLinksOutOf()
      if (itr.count > 0) {
        while (itr.next()) {
          var item = itr.value;

          this.removeChildLinks(item, e)

        }
      } else {

        return;
      }
    }
  }
  deleteNode(list, itr, e) {
    list.forEach((element, i) => {
      var itemNew = list[i]
      let newDataTo =   this.myDiagram.findNodeForKey( itemNew.from) as any;
      var itFrom = newDataTo.memberParts;
     
      while (itFrom.next()) {
        let newData =   this.myDiagram.findNodeForKey( itemNew.to) as any;
        var it = newData.memberParts;
        var itemFrom = itFrom.value
        var itemFromData = itemFrom.data
       
      while(it.next()){
        var item = it.value;
        var item = item.data;
        if(itemFromData.key === item.foreign_key && item.primary_key == 'FK'){
          var itemKey = item.key
          let newDataFind =   this.myDiagram.findNodeForKey( itemKey) as any;
          this.nodeDataArray
          this.myDiagram.startTransaction();
          this.myDiagram.remove(newDataFind);
          this.myDiagram.commitTransaction();
    
         }
        }
      }
      //  if (item.primary_key == "FK") {
       
      // }
    });
  }
  checkConnectedTo:any;
  
  deleteFromNode(list) {
    list.forEach((element, i) => {
      var itemNew = list[i]
      let newDatafrom =   this.myDiagram.findNodeForKey( itemNew.group) as any;
      var itFrom = newDatafrom.memberParts;
      console.log(newDatafrom)
      let linkConnected = newDatafrom.linksConnected.xb.s.forEach(element => {
        let checkConnectedFrom = element.data.from
        this.checkConnectedTo = element.data.to
        let newDataTo =   this.myDiagram.findNodeForKey( this.checkConnectedTo) as any;
        var itTo = newDataTo.memberParts;
        while (itTo.next()) {
          var itemTo = itTo.value
          var itemFromData = itemTo.data
          if(itemFromData.foreign_key === itemNew.key ){
            var itemKey = itemFromData.key
            let newDataFind =   this.myDiagram.findNodeForKey( itemKey) as any;
            this.myDiagram.startTransaction();
            this.myDiagram.remove(newDataFind);
            this.myDiagram.commitTransaction();
           }
          }
      });
      
      
      // if(itemNew.foreign_key === item.foreign_key && item.primary_key == 'FK'){
      //   var itemKey = item.key
        let newDataFind =   this.myDiagram.findNodeForKey( itemNew.key) as any;
        this.nodeDataArray
        this.myDiagram.startTransaction();
        this.myDiagram.remove(newDataFind);
        this.myDiagram.commitTransaction();
  
    });
      


  } 






showMessage(s: any) {
  this.nodeInspector = []
  this.nodeInspector.push(s)
}
finishDrop(e: any, grp: any) {
  var ok = (grp !== null ? grp.addMembers(grp.diagram.selection, true) : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
  if (!ok) e.diagram.currentTool.doCancel();
}

highlightGroup(e: any, grp: any, show: any) {
  if (!grp) return;
  e.handled = true;
  if (show) {
    var tool = grp.diagram.toolManager.draggingTool;
    var map = tool.draggedParts || tool.copiedParts;
    if (grp.canAddMembers(map.toKeySet())) {
      grp.isHighlighted = true;
      return;
    }
  }
  grp.isHighlighted = false;
}

defaultColor(horiz: any) {
  return horiz ? "rgb(0, 189, 255)" : "rgb(0, 189, 255)";
}
defaultFont(horiz: any) {
  return horiz ? "12px sans-serif" : "bold 12px sans-serif";
}

makeLayout(horiz: any) {
  if (horiz) {
    return new go.GridLayout(
      {
        wrappingWidth: 1, alignment: go.GridLayout.Position,
        cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
      });
  } else {
    return new go.GridLayout(
      {
        wrappingColumn: 1, alignment: go.GridLayout.Position,
        cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
      });
  }
}

linkInfo(d: any) {
  return "Link:\nfrom " + d.from + " to " + d.to;
}

sameGroup(fromnode: any, fromport: any, tonode: any, toport: any) {
  return fromnode.data.isGroup === tonode.data.isGroup;

}
linkOnKey(fromnode: any, fromport: any, tonode: any, toport: any) {
  return fromnode.data.isGroup === tonode.data.isGroup;

}



getNode() {
  this.GojsServiceService.getNode().subscribe((res: any) => {
    this.getNodeArray = res;
  })

}

}
