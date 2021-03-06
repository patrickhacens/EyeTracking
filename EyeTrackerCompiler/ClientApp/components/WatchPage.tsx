import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Link } from 'react-router-dom';

interface VideoDataExample {
	fixations: Fixation[];
	timePoints: TimePoint[];
	loading: boolean;
}

export class WatchPage extends React.Component<RouteComponentProps<{}>, VideoDataExample> {

	public canvas: HTMLCanvasElement;
	public video: HTMLVideoElement;

	constructor(props: any) {
		super(props);
		this.state = { fixations: [], timePoints: [], loading: true };
		this.step = this.step.bind(this);
		this.start = this.start.bind(this);
	}

	public componentDidMount() {
		this.bringData(this.getVideoName(), this.getWatchName());
	}

	public componentWillUpdate(props: any) {
		if (this.getVideoName() != props.match.params.video || this.getWatchName() != props.match.params.watch) {
			this.bringData(props.match.params.video, props.match.params.watch);
		}
	}

	public componentDidUpdate() {

	}

	public bringData(video: string, watch: string) {
		this.setState({ fixations: [], loading: true });
		fetch('api/video/' + video + '/' + watch + '/fixation')
			.then(response => response.json() as Promise<Fixation[]>)
			.then(data => {
				this.setState({ fixations: data, timePoints: this.state.timePoints, loading: false });
			});

		fetch('api/video/' + video + '/' + watch + '/timepoint')
			.then(response => response.json() as Promise<TimePoint[]>)
			.then(data => {
				this.setState({ fixations: this.state.fixations, timePoints: data, loading: this.state.loading });
			});
	}

	public getVideoName() {
		return (this.props.match.params as any).video;
	}

	public getWatchName() {
		return (this.props.match.params as any).watch;
	}

	get passedTime():number {
		return this.video.currentTime * 1000;
	}
	get running(): boolean {
		return !(this.video.paused || this.video.ended);
	}

	private thread: any;

	public start() {
		this.thread = setInterval(this.step, 16);
	}

	public step() {
		if (!this.running) {
			clearInterval(this.thread);
		}
		var itens = this.state.timePoints.filter((f) => Math.abs(this.passedTime - f.time) < 3000 && f.time <= this.passedTime);
		var ctx = this.canvas.getContext("2d")!;
		ctx.clearRect(0, 0, 480, 270);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";

		for (var i = 0; i < itens.length; i++) {
			ctx.beginPath();
			var alpha = (1 - (Math.abs(this.passedTime - itens[i].time) / 3000)) * 0.7;
			ctx.fillStyle = "rgba(32, 45, 21, " + alpha + ")";
			var item = itens[i];
			
			var xc = item.x * 480 / 1920;
			var yc = item.y * 270 / 1080;
			ctx.arc(xc, yc, 5, 0, 2 * Math.PI);
			ctx.fill();
		}
	}


	public render() {
		let contents = this.state.loading
			? <p><em>Loading...</em></p>
			: WatchPage.renderFixationTable(this.state.fixations);

		return <div>
			<h1>Fixações de {this.getWatchName()}</h1>
			<div>
				<canvas id="canvas"
					ref={(ref) => this.canvas = ref!}
					className="abs"
					width="480px"
					height="270px"
				/>
				<video id="video"
					ref={(ref) => this.video = ref!}
					src="/Videos/Video 1.mp4"
					width="480px"
					height="270px"
					controls={true}
					onPlay={this.start}
				/>
			</div>
			{contents}
		</div>;
	}

	private static renderFixationTable(watches: Fixation[]) {
		return <div>
			<div>
				Aconteceram {watches.length} fixações
			</div>
			<table className='table'>
				<thead>
					<tr>
						<th>Inicio</th>
						<th>Termino</th>
						<th>Duração</th>
						<th>Velocidade média do olho</th>
						<th>X</th>
						<th>Y</th>
					</tr>
				</thead>
				<tbody>
					{watches.map(watch =>
						<tr key={watch.startTime}>
							<td>{watch.startTime}</td>
							<td>{watch.endTime}</td>
							<td>{watch.duration}</td>
							<td>{watch.averageEyeSpeed}</td>
							<td>{watch.x}</td>
							<td>{watch.y}</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>;
	}
}

interface Fixation {
	startTime: number;
	endTime: number;
	duration: number;
	averageEyeSpeed: number;
	x: number;
	y: number;
}

interface TimePoint {
	x: number;
	y: number;
	time: number;
}
