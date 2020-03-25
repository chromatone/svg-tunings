Vue.component('note-circle',{
	template:`<circle @mousedown.stop.prevent="playing ? stop(hz) : play(hz)"
										@touchstart.stop.prevent="play(hz)"
										@touchend.stop.prevent="stop(hz)"
										@touchleave.stop.prevent="stop(hz)"
										:class="{playing}"
										:fill="notes[pitch].color"
										:cx="cx"
										:cy="cy"
										:r="r"/>`,
	props:['r','cx','cy','pitch','hz'],
	data() {
		return {
			notes:Chroma.Notes,
			playing:false
		}
	},
	methods: {
		play(note) {
			if(!Tone.contextStarted) {Tone.context.resume()}
			this.playing=true;
			Tone.synth.triggerAttack(note)
		},
		stop(note) {
			this.playing=false;
			Tone.synth.triggerRelease(note)
		}
	}
})


var app = new Vue({
	el: '#tunings',
	components: {

  },
	data: {
		notes:Chroma.Notes,
		root:0,
		rootFreq:440,
		tunings:Chroma.Tunings
	},
	methods: {
		arrayRotate(A,n,l=A.length) {
			const offset = (((n % l) + l) %l)
			return A.slice(offset).concat(A.slice(0,offset))
		},
		calcET (pitch, octave=4) {
			return Number(this.rootFreq * Math.pow(2, octave - 4 + pitch / 12)).toFixed(2);
		},
		calcCents(cents=0) {
			return Number(this.rootFreq*Math.pow((Math.pow(2,1/1200)),cents)).toFixed(2)
		}
	},
	watch: {

	},
	created: function(){
		Tone.context = new Tone.Context();
		Tone.volume = new Tone.Volume(-5).toMaster();
		Tone.contextStarted=false;
		Tone.synth = new Tone.PolySynth(8, Tone.Synth).connect(Tone.volume);
		Tone.synth.set({
			oscillator: {
				type: 'sine'
			},
			envelope: {
				attack:0.1,
				decay:0.3,
				sustain:0.3,
				release:0.2
			}
		})
	},
	computed: {
		}
});
