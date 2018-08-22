import configureStore from "./configureStore";
import { AppState } from "./store";
import { createBrowserHistory } from 'history';
import { baseUrl } from "../node_modules/domain-task";
import { AppContainer } from 'react-hot-loader';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedBrowerHistory } from 'react-router-redux';
import * as RoutesModules from './routes';
let routes = RoutesModules.routes;
const history = createBrowserHistory({ basename: baseUrl});

const initialState = (window as any).initialReduxState as AppState;
const store = configureStore(history, initialState);

function renderApp() {
    ReactDOM.Render(
        <AppContainer>
            <Provider store={ store }>
                <ConnectedBrowerHistory history={history} children={ routes }/>
            </Provider>
        </AppContainer>
    )
}