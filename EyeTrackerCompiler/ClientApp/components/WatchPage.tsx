import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Link } from 'react-router-dom';

interface VideoDataExample {
	fixations: Fixation[];
	loading: boolean;
}

export class WatchPage extends React.Component<RouteComponentProps<{}>, VideoDataExample> {
	constructor(props: any) {
		super(props);
		console.log(props);
		this.state = { fixations: [], loading: true };

		fetch('api/video/' + props.match.params.video + '/' + props.match.params.watch + '/fixation')
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
			: WatchPage.renderForecastsTable(this.state.fixations, this.getVideoName());

		return <div>
			<h1>Visualizações enviadas</h1>
			<p>Segue a lista de visualizações enviadas para este video</p>
			{contents}
		</div>;
	}

	private static renderForecastsTable(watches: Fixation[], videoname: string) {
		return <table className='table'>
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
		</table>;
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