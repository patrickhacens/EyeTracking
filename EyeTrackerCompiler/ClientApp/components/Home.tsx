import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <h1>Resultados compilados da pesquisa com Eyetracker</h1>
            <p>Selecione um video a esquerda ou adicione um novo clicando em "Novo Video"</p>
        </div>;
    }
}
