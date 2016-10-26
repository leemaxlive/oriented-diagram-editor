import React = require('react');
import ReactDOM = require('react-dom');
import ReactRedux = require('react-redux');
import Target = require('../components/Target');
import createDiagram = require('../d3app/app');
let {connect} = ReactRedux;

class App extends React.Component<any,any>{
    componentDidMount(){
        createDiagram(".view","100%",400)
    }
    render(){
        let {name,type,targets}=this.props;
        return(
            <div className='container-fluid'>
                <div className="view col-md-8">
                    
                </div>
                <div className="col-md-4">
                    <div className="panel panel-default">
                        <div className="panel-heading">工具箱</div>
                        <div className="panel-body">
                            <ul className="list-unstyled">
                                <a href="javascript:void(0)" className="btn btn-primary">+</a>
                            </ul>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">节点信息</div>
                        <div className="panel-body">
                            <ul className="list-unstyled">
                                <li>节点:{name}</li>
                                <li>类型:{type}</li>
                                <li>指向:{targets.map(item=><Target {...item}></Target>)}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    let {name,type,targets} = state
    return{
        name,
        type,
        targets
    }
}
export = connect(mapStateToProps)(App);