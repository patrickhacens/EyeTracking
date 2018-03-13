import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Link } from 'react-router-dom';

interface VideoDataExample {
	watches: Watch[];
	loading: boolean;
	file: any;
}

export class VideoPage extends React.Component<RouteComponentProps<{}>, VideoDataExample> {
	constructor() {
		super();
		this.state = { watches: [], loading: true, file: null };
		this.onSubmit = this.onSubmit.bind(this);
		this.onChangeFile = this.onChangeFile.bind(this);
	}

	public getVideoName() {
		return (this.props.match.params as any).name;
	}

	public componentDidMount() {
		this.bringData(this.getVideoName());
	}


	public componentWillUpdate(props: any) {
		if (props.match.params.name != this.getVideoName()) {
			this.bringData(props.match.params.name);
		}
	}

	public bringData(videoName: string) {
		fetch('api/video/' + videoName)
			.then(response => response.json() as Promise<Watch[]>)
			.then(data => {
				this.setState({ watches: data, loading: false });
			});
	}

	public render() {
		let contents = this.state.loading
			? <p><em>Loading...</em></p>
			: this.renderForecastsTable(this.state.watches, this.getVideoName());

		return <div>
			<h1>Visualizações enviadas</h1>
			<p>Segue a lista de visualizações enviadas para este video</p>
			{contents}
		</div>;
	}

	public onChangeFile(e: any) {
		this.setState({ file: e.target.files[0], watches: this.state.watches, loading: this.state.loading });
	}

	public onSubmit(e: any) {
		debugger;
		e.preventDefault();
		this.fileUpload(this.state.file)
			.then((response: any) => {
				this.bringData(this.getVideoName());
			});
	}

	private fileUpload(file: any) {
		const formData = new FormData();
		formData.append('file', file);
		return fetch('/api/video/' + this.getVideoName(),
			{
				method: 'POST',
				body: formData,
				//headers: {
				//	'content-type': 'multipart/form-data'
				//}
			});
	}

	private renderForecastsTable(watches: Watch[], videoname: string) {
		return <div>
			<table className='table'>
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
					<tr>
					</tr>
				</tbody>
			</table>
			<div>
				<form onSubmit={this.onSubmit}>
					Nova visualização
							<input type='file' onChange={this.onChangeFile} />
					<button type='submit'>Enviar</button>
				</form>
			</div>
		</div>;
	}
}

interface Watch {
	Video: {
		name: string;
	};
	name: string;
}
