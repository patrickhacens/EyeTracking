import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Link } from 'react-router-dom';

interface NewVideoDataExample {
	value: string;
	loading: boolean;
}

export class NewVideo extends React.Component<RouteComponentProps<{}>, NewVideoDataExample> {
	constructor() {
		super();
		this.state = { value: '', loading: true };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	private handleChange(event: any) {
		this.setState({ value: event.target.value });
	}

	private handleSubmit(event: any) {
		event.preventDefault();
		console.log('submited');
		fetch('/api/video', {
			method: 'post',
			body: JSON.stringify({
				name: this.state.value
			}),
			headers: {
				'content-type':'application/json'
			}
		}).then(response => this.setState({ value: '', loading: false }));
	}

	public render() {
		return <div>
			<form onSubmit={this.handleSubmit}>
				<label>
					Nome do Video:
					<input type='text' value={this.state.value} onChange={this.handleChange} />
				</label>
				<input type='submit' value='Submit' />
			</form>
		</div>;
	}
}