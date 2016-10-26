import React = require('react');
import ReactDOM = require('react-dom');
import Redux = require('redux');
import ReactRedux = require('react-redux');
import App = require('./container/App');
import $ = require('jquery');
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap/dist/css/bootstrap-theme.css'
import './css/index.css'
let {createStore} = Redux;
let {Provider} = ReactRedux;

let store = createStore((state,action)=>{
    if(action.type == 'SELECT')
        return $.extend({},state,action.payload)
    return state
},{name:'',type:'',targets:[]});

ReactDOM.render(
    <Provider store={store}><App></App></Provider>,
    document.getElementById('root')
)

export {store}