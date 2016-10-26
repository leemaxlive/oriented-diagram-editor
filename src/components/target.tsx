import React = require('react');
interface TargetProps{
    name:string,
    type:string
}
class Target extends React.Component<TargetProps,any>{
    render(){
        return(
            <div>
                {this.props.name+'  '} <a href="javascript:void(0)">{this.props.type}</a>
            </div>
        )
    }
}

export = Target;