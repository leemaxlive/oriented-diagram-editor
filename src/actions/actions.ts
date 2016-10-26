interface nodeProps{
    name:string,
    type:string,
    targets:{name:string,type:string}[]
}
export let selectAction = (node:nodeProps)=>({
    type:'SELECT',
    payload:{
        name:node.name,
        type:node.type,
        targets:node.targets
    }
})