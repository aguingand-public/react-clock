export const TimeType = {
  HOURS:'h',MINUTES:'m',SECONDS:'s'
}

export const WatchType = {
  ANALOG:'analog',DIGITAL:'digital'
}

export default {
	playgroundParams: {
		width: 500,
		height: 500,
	},
	watchParams : {
		strokeWidth: 30
	},
	needleParams : {
		[TimeType.HOURS] : {
			length: 100,
			strokeWidth: 8
		},
		[TimeType.MINUTES] : {
			length: 150,
			strokeWidth: 6
		},
		[TimeType.SECONDS] : {
			length: 180,
			strokeWidth: 4
		}
	},
	colors : {
		watchBorder: '#ffeb3b',
		watchBackground: '#e8eaf6',
		innerCircle: 'black',
		innerDot: 'white',
		needleColor: 'black'
	},

	/// Math
	HALF_PI:Math.PI/2, 
	TWO_PI:Math.PI*2,
};
