import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { VideoPage } from './components/VideoPage';
import { WatchPage } from './components/WatchPage';
import { NewVideo } from './components/NewVideo';

export const routes = <Layout>
	<Route exact path='/' component={Home} />
	<Route path='/counter' component={Counter} />
	<Route path='/fetchdata' component={FetchData} />
	<Route path='/video/:name' component={VideoPage} />
	<Route path='/video/:video/:watch' component={WatchPage} />
	<Route path='/new/video' component={NewVideo} />
</Layout>;
