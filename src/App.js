import React, { Component } from 'react';
import './App.css';

import Global, {TimeType, WatchType} from './constants';

var layout = (()=>{
		let pw = Global.playgroundParams.width,
        ph = Global.playgroundParams.height,
        minSize = Math.min(pw,ph);
		return {
			cx : pw/2,
			cy : ph/2,
			radius : minSize/2 - Global.watchParams.strokeWidth/2
		};
})();


function Dial(props) {
	return (
			<circle cx={layout.cx} cy={layout.cy} r={layout.radius} strokeWidth={Global.watchParams.strokeWidth} 
							fill={props.curColor} stroke={Global.colors.watchBorder}/>
	);
}

class Hand extends Component {
	point2(trig,basePos,ratio) {
		return basePos + trig(-Global.HALF_PI+ratio*Global.TWO_PI) * this.props.params.length;
	}
  render() {
		let time=this.props.time;
		//time ratio
		var tr=time.val/time.range;
    return(
      <line x1={this.props.x1} y1={this.props.y1} 
						x2={this.point2(Math.cos,this.props.x1,tr)} 
						y2={this.point2(Math.sin,this.props.y1,tr)}
          	strokeWidth={this.props.params.strokeWidth}/>
    );
  }
}


function DigitalWatch(props) {

	//add a '0' before if n less than 10
	let pad = (n) => n<10?'0'+n:n;

	let h=pad(props.curTime[TimeType.HOURS].base), 
			m=pad(props.curTime[TimeType.MINUTES].base),
			s=pad(props.curTime[TimeType.SECONDS].base);

	return (
		<text x={layout.cx} y={layout.cy} className="App-LCDText" dy=".3em">
				{`${h}:${m}:${s}`}
		</text>
	);
}

class AnalogWatch extends Component {

	renderHands(timeType) {
		return (
			<Hand time={this.props.curTime[timeType]} params={Global.needleParams[timeType]} 
							x1={layout.cx} y1={layout.cy}/>
		);
	}
  render() {
    return (
      <g>
				<g stroke={Global.colors.needleColor}>
					{this.renderHands(TimeType.HOURS)}
					{this.renderHands(TimeType.MINUTES)}
					{this.renderHands(TimeType.SECONDS)}
				</g>
        <circle cx={layout.cx} cy={layout.cy} r="5" strokeWidth="8px" fill={Global.colors.innerDot} stroke={Global.colors.innerCircle} />
      </g>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
			watchType:WatchType.ANALOG,
			curTime:this.getTime(),
			curColor:Global.colors.watchBackground
    }
		setInterval((()=>{
			this.setState({curTime:this.getTime()});
    }), 24);
  }

	getTime() {
		var d=new Date();
		var h=d.getHours(), m=d.getMinutes(), s=d.getSeconds(), ms=d.getMilliseconds();
		var base = { h:h, m:m, s:s };
		h+=(m+=(s+=ms/1000.)/60.)/60.;
		return {
			[TimeType.HOURS] : {base:base.h, val:h, range:12},
			[TimeType.MINUTES] : {base:base.m, val:m, range:60},
			[TimeType.SECONDS] : {base:base.s, val:s, range:60}
		};
	}

	mouseDownHandler = (e) => {
    this.setState({curColor:'#'+(Math.random()*0xFFFFFF<<0).toString(16)});
    e.preventDefault();
    return false;
  }

	handleWatchTypeChange = (e) => {
		this.setState({watchType:e.target.checked ? WatchType.DIGITAL : WatchType.ANALOG});
	}

	renderWatch() {
		switch(this.state.watchType) {
			case WatchType.ANALOG: return <AnalogWatch {...this.state} />;
			case WatchType.DIGITAL: return <DigitalWatch {...this.state} />;
			default: 
				throw new TypeError(`Invalid WatchType for rendering (${this.state.watchType})`);
		}
	}

  render() {
    return (
      <div className="App">
					<div className="App-settingsPanel">
						<div className="form-row">
							<label htmlFor="change-watch">
								<input type="checkbox" id="change-watch" onChange={this.handleWatchTypeChange}/>
									<span>
									Montre digitale
									</span>
							</label>
						</div>
					</div>
					<div className="App-playground">
						<svg width={Global.playgroundParams.width} height={Global.playgroundParams.height} onMouseDown={this.mouseDownHandler}>
							<Dial curColor={this.state.curColor} />
							{this.renderWatch()}
						</svg>
					</div>
				</div>
    );
  }
}

export default App;
