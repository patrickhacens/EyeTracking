import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, NavLink } from 'react-router-dom';

interface NavMenuExampleState {
	videos: Video[];
	loading: boolean;
}

export class NavMenu extends React.Component<{}, NavMenuExampleState> {
	constructor() {
		super();
		this.state = { videos: [], loading: true };

		fetch('api/video')
			.then(response => response.json() as Promise<Video[]>)
			.then(data => {
				this.setState({ videos: data, loading: false });
			});
	}


	public render() {

		let contents = this.state.loading
			? <li>loading...</li>
			: NavMenu.renderVideos(this.state.videos);

		return <div className='main-nav'>
			<div className='navbar navbar-inverse'>
				<div className='navbar-header'>
					<button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
						<span className='sr-only'>Toggle navigation</span>
						<span className='icon-bar'></span>
						<span className='icon-bar'></span>
						<span className='icon-bar'></span>
					</button>
					<Link className='navbar-brand' to={'/'}>EyeTrackerCompiler</Link>
				</div>
				<div className='clearfix'></div>
				{contents}

			</div>
		</div>;
	}

	private static renderVideos(videos: Video[]) {
		return <div className='navbar-collapse collapse'>
			<ul className='nav navbar-nav' >
				{videos.map(video =>
					<li>
						<NavLink to={'/video/' + video.name} activeClassName='active'>
							<span className='glyphicon glyphicon-th-list'></span> {video.name}
						</NavLink>
					</li>
				)}
				<li>
					<NavLink to='/new/video' activeClassName='active'>
						<span className='glyphicon glyphicon-th-list'></span> Novo Video
					</NavLink>
				</li>
			</ul>
		</div>;
	}
}

interface Video {
	name: string;
}