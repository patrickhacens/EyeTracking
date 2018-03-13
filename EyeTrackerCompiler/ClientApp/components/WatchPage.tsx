import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Link } from 'react-router-dom';
import * as Plotly from 'plotly.js';

interface VideoDataExample {
	fixations: Fixation[];
	loading: boolean;
}

export class WatchPage extends React.Component<RouteComponentProps<{}>, VideoDataExample> {
	constructor(props: any) {
		super(props);
		this.state = { fixations: [], loading: true };
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
		var d3 = Plotly.d3;

		var WIDTH_IN_PERCENT_OF_PARENT = 60,
			HEIGHT_IN_PERCENT_OF_PARENT = 80;

		var gd3 = d3.select('#plot')
			.style({
				width: WIDTH_IN_PERCENT_OF_PARENT + '%',
				'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

				height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
				'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
			});

		var gd = gd3.node();

		Plotly.plot(gd, [{
			type: 'scatter3d',
			mode: 'markers',
			x: [1, 2, 3, 4],
			y: [5, 10, 2, 8],
			z: [3, 1, 4, 5],
			marker: {
				color: 'rgb(127,127,127)',
				size: 6,
				symbol: 'circle',
				line: {
					color: 'rgb(204,204,204)',
					width: 1
				}
			}
		}], {
				title: 'Fixations',
				font: {
					size: 16
				}
			});

		window.onresize = function () {
			Plotly.Plots.resize(gd);
		};
	}

	public bringData(video: string, watch: string) {
		this.setState({ fixations: [], loading: true });
		fetch('api/video/' + video + '/' + watch + '/fixation')
			.then(response => response.json() as Promise<Fixation[]>)
			.then(data => {
				this.setState({ fixations: data, loading: false });
			});
	}

	public getVideoName() {
		return (this.props.match.params as any).video;
	}

	public getWatchName() {
		return (this.props.match.params as any).watch;
	}


	public render() {
		let contents = this.state.loading
			? <p><em>Loading...</em></p>
			: WatchPage.renderFixationTable(this.state.fixations);

		return <div>
			<h1>Fixações de {this.getWatchName()}</h1>
			{contents}
		</div>;
	}

	private static renderFixationTable(watches: Fixation[]) {
		return <div>
			<div id="plot">
			</div>
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
