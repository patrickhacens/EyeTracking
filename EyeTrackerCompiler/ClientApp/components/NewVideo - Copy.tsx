import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Link } from 'react-router-dom';

interface NewVideoDataExample {
	file: any;
}

export class NewVideo extends React.Component<RouteComponentProps<{}>, NewVideoDataExample> {
	constructor() {
		super();
		this.state = { file: null };
	}

	public onFormSubit(e: any) {
		e.preventDefault();
		this.fileUpload(this.state.file)
			.then((response : any) => {
				console.log(response.data);
			});
	}

	public onChange(e: any) {
		this.setState({ file: e.target.files[0] });
	}

	public fileUpload(file: any) {
		const formData = new FormData();
		formData.append('file', file);

		return fetch('/api/video', {
			method: 'POST',
			body: formData,
			headers: {
				'content-type': 'multipart/form-data'
			}
		});

	}

	public render() {
		return <div>
			
		</div>;
	}
}