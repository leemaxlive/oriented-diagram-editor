import * as d3 from 'd3';
//import * as $ from 'jquery';
import { nodes , edges} from '../data/data';

interface d3ForceNode extends d3.layout.force.Node{name:string}//外部声明文件d3.layout.force.Node接口少了name属性。
type d3ForceEdge = d3.layout.force.Link<d3ForceNode>;
type d3ForceNodeUpdate = d3.selection.Update<d3ForceNode>;
type d3ForceEdgeUpdate = d3.selection.Update<d3ForceEdge>;

let width:number =800;
let height:number = 800;
let nodeR:number = 40;
let zoomTranslate:number[] = [0,0];
let zoomScale:number = 1;
let svgEdgesUpdate:d3ForceEdgeUpdate;
let svgNodesUpdate:d3ForceNodeUpdate;
let svgTextsUpdate:d3ForceNodeUpdate;
let linkingStartNode:d3ForceNode;
let linkingEndNode:d3ForceNode;
let releaseLinkingNodeVars = ()=>{linkingStartNode=null;linkingEndNode=null;};

let zoom = d3.behavior.zoom()
    .scaleExtent([0.1,10])
    .on('zoom',()=>{
        let e = d3.event as d3.ZoomEvent;
        zoomTranslate = e.translate;
        zoomScale = e.scale;
        svg.attr('transform', `translate(${zoomTranslate})scale(${zoomScale})`)
        svg.selectAll('circle').attr('transform', `translate(${zoomTranslate})scale(${zoomScale})`);
        svg.selectAll('path.link').attr('transform', `translate(${zoomTranslate})scale(${zoomScale})`);
        svg.selectAll('text').attr('transform', `translate(${zoomTranslate})scale(${zoomScale})`);
    });
 
let svg = d3.select('body')
    .append('svg')
    .attr('width',width)
    .attr('height',height)
    .attr('oncontextmenu','return false')
    .on('mousedown',()=>{
        let e = d3.event as MouseEvent;
        if(e.which==3){
            console.log([d3.mouse(e.target),[pageXOffset,pageYOffset]])
            addNode(d3.mouse(e.target));
        }else if(e.which == 1){
            let edges:d3.Selection<d3ForceEdge> = d3.selectAll('path.link');
            let nodes:d3.Selection<d3ForceNode> = d3.selectAll('circle');
            edges.on('mouseout',subtractEdge);
            nodes.on('mouseout',subtractNode)
        }
    })
    .on('mouseup',()=>{
         d3.selectAll('path.link').on('mouseout',null);
         d3.selectAll('circle').on('mouseout',null)
    })
    .call(zoom);//带缩放行为
let defs = svg.append('defs');
let arrowMarker = defs.append('marker')
    .attr('id', 'arrow')
    .attr('markerUnits', 'strokeWidth')
    .attr('markerWidth', '12')
    .attr('markerHeight', '12')
    .attr('refX', '10')
    .attr('refY', '6')
    .attr('orient', 'auto');

arrowMarker.append('path')
    .attr('d','M2,2 L10,6 L2,10 Z')
    .attr('fill','#666')

let force = d3.layout.force().nodes(nodes)
    .links(edges)
    .size([width,height])
    .linkDistance(150)
    .charge(-2000)
    .on('tick',tick)
let color = d3.scale.category20();
let nodesForced:d3ForceNode[] = force.nodes() as d3ForceNode[];
let edgesForced:d3ForceEdge[] = force.links() as d3ForceEdge[];

render();
function render(){
    force.start();//新加的元素都要经过这步才能让这些元素联动
    svgEdgesUpdate = svg.selectAll('path.link').data(edgesForced) as d3ForceEdgeUpdate;
    svgNodesUpdate = svg.selectAll('circle').data(nodesForced) as d3ForceNodeUpdate;
    svgTextsUpdate = svg.selectAll('text').data(nodesForced) as d3ForceNodeUpdate;
    
    svgEdgesUpdate.enter()
        .append('path')
        .attr('marker-end','url(#arrow)')
        .attr('class','link')
        .style('stroke','#666')
        .style('stroke-width',1)
        .attr('transform', `translate(${zoomTranslate})scale(${zoomScale})`);
    svgEdgesUpdate.exit().remove(); 

    svgNodesUpdate.enter()
        .append('circle')
        .attr('r',nodeR)
        .style('fill',(d,i)=>color(i.toString()))
        .on('mouseup',function(d){
            let e = d3.event as MouseEvent;
            if(e.which !== 3) return false;
            linkingEndNode = d
            if(linkingStartNode && linkingStartNode !== linkingEndNode) addEdge();
            releaseLinkingNodeVars();
        })
        .on('mousedown',function(d){
            let e = d3.event as MouseEvent;
            e.stopPropagation();
            if(e.which !== 3) return false;
            d3.select(this).call(force.drag);//阻止右键拖拽
            linkingStartNode = d;
            linkingOperaton();
        })
        .call(force.drag)//带拖拽行为
        .attr('transform', `translate(${zoomTranslate})scale(${zoomScale})`)
    svgNodesUpdate.exit().remove();
    
    svgTextsUpdate.enter()
        .append('text')
        .style('fill','black')
        .style('pointer-events','none')
        .text((d)=>d.name)
        .attr('transform', `translate(${zoomTranslate})scale(${zoomScale})`)
    svgTextsUpdate.exit().remove();

}

function tick(){   
    svgEdgesUpdate.attr('d',d=>{
        let x1 = d.source.x,y1 = d.source.y,x2 = d.target.x,y2 = d.target.y,
        dist = Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)),
        x = (x1-x2)*nodeR/dist,
        y = (y1-y2)*nodeR/dist;
        return `M${x1-x},${y1-y} L${x2+x},${y2+y}`;
    })
    //更新节点坐标
    svgNodesUpdate.attr('cx',d=>d.x)
        .attr('cy',d=>d.y);

    //更新文字坐标
    svgTextsUpdate.attr('x', d=>d.x)
        .attr('y', d=>d.y);
}

function addNode(point:number[]){
    nodesForced.push({name:'深圳',x:(point[0]-zoomTranslate[0])/zoomScale,y:(point[1]-zoomTranslate[1])/zoomScale});//鼠标点坐标应在translate和scale的作用后变成鼠标本来的点坐标，因此要对鼠标点做一次逆向运算
    render();
}

function addEdge(){
    edgesForced.push({source:linkingStartNode,target:linkingEndNode});//必须引用已有的点的数据对象，而不是新建一个数据对象，否则连接不上
    render();
}

function subtractEdge(d,i){
    // edgesForced = edgesForced.filter((item)=>{if(item !== d) return item});//用新数组会使关联出问题
    edgesForced.splice(i,1);
    render();
}

function subtractNode(d,i){
    nodesForced.splice(i,1);
    for(let ind = 0 ; ind<edgesForced.length;){
        if(edgesForced[ind].source == d || edgesForced[ind].target ==d)
            edgesForced.splice(ind,1);
        else
            ind++;
    }
    render();
}

function linkingOperaton(){
    let mousePoint:number[];
    let linking = svg.append('path')
        .attr('class','linking')
        .attr('marker-end','url(#arrow)')
        .style('display','none')
        .style('stroke','#666')
        .style('stroke-width',1)
        .style('pointer-events','none')
        .attr('transform',`translate(${zoomTranslate})scale(${zoomScale})`)

    let linkingAnimateTimer = requestAnimationFrame(function linkingAnimate(){//刷新link的根，让link的根始终跟着圆中心
        if(mousePoint){
            //在translate和scale的作用下，点的坐标会变成(x*scale+translate,y*scale+translate)
            //鼠标点坐标应在translate和scale的作用后变成鼠标本来的点坐标，因此要对鼠标点做一次逆向运算               
            let x1 = linkingStartNode.x,y1 = linkingStartNode.y,x2 = (mousePoint[0]-zoomTranslate[0])/zoomScale,y2 = (mousePoint[1]-zoomTranslate[1])/zoomScale,
            dist = Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)),
            x = (x1-x2)*nodeR/dist,
            y = (y1-y2)*nodeR/dist;
            linking.attr('d',`M${x1-x},${y1-y} L${x2},${y2}`);
            //当鼠标与圆中心距离大于圆半径时才显现link
            if(Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))-nodeR>0) linking.style('display','block');
            else linking.style('display','none')
        }
        linkingAnimateTimer = requestAnimationFrame(linkingAnimate)
    });

    let documentDom = d3.select(document).on('mouseup',()=>{//删除linking及相关事件
            d3.select('path.linking').remove();
            documentDom.on('mousemove',null);
            cancelAnimationFrame(linkingAnimateTimer);
            releaseLinkingNodeVars();
        })
        .on('mousemove',()=>{//提供鼠标指针坐标
            let e = d3.event as MouseEvent;
            mousePoint = [e.pageX-10,e.pageY-10]
        })
}