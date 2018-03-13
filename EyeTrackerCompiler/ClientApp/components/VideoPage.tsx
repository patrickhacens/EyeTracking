import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Link } from 'react-router-dom';

interface VideoDataExample {
	watches: Watch[];
	loading: boolean;
}

export class VideoPage extends React.Component<RouteComponentProps<{}>, VideoDataExample> {
	constructor() {
		super();
		this.state = { watches: [], loading: true };
	}

	public getVideoName() {
		return (this.props.match.params as any).name;
	}

	public componentDidMount() {
		this.bringData(this.getVideoName());
		console.log('montou');
	}

	public componentWillUnmount() {
		console.log('desmontou');
	}

	public componentWillUpdate(props: any) {
		if ((this.props.match.params as any).name != props.match.params.name) {
			this.bringData(props.match.params.name);
		}
	}

	public bringData(videoName:string) {
		fetch('api/video/' + videoName)
			.then(response => response.json() as Promise<Watch[]>)
			.then(data => {
				this.setState({ watches: data, loading: false });
			});
	}

	public render() {
		let contents = this.state.loading
			? <p><em>Loading...</em></p>
			: VideoPage.renderForecastsTable(this.state.watches, this.getVideoName());

		return <div>
			<h1>Visualizações enviadas</h1>
			<p>Segue a lista de visualizações enviadas para este video</p>
			{contents}
		</div>;
	}

	private static renderForecastsTable(watches: Watch[], videoname: string) {
		return <table className='table'>
			<thead>
				<tr>
					<th>Nome</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{watches.map(watch =>
					<tr key={watch.name}>
						<td>{watch.name}</td>
						<td><Link to={'/video/' + videoname + '/' + watch.name} >Visualizar os dados</Link></td>
					</tr>
				)}
			</tbody>
		</table>;
	}
}

interface Watch {
	Video: {
		name: string;
	};
	name: string;
}
