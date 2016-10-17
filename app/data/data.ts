type nodes={name:string}[];
type edges={source:number,target:number}[];

let nodes:nodes = [ { name: "桂林" }, { name: "广州" },{ name: "厦门" }, { name: "杭州" },{ name: "上海" }, { name: "青岛" },{ name: "天津" } ,{name:"南宁"}];
let edges:edges = [ { source : 0 , target: 4 } , { source : 0 , target: 2 } ,{ source : 0 , target: 3 } , { source : 5 , target: 4 } ,{ source : 1 , target: 5 } , { source : 1 , target: 6 },{ source : 5 , target: 3 }];
export {nodes,edges}