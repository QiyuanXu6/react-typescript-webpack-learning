import { History } from 'history';
import { AppState, reducers } from './store';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { compose, applyMiddleware } from '../node_modules/redux';
export default function configureStore(history: History, initialState?: AppState) {
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk, routerMiddleware(history))
    )
    const allReducers = buildRootReducer(reducers);
    const store = createStoreWithMiddleware(allReducers, initialState) as Store<AppState>;
    return store;
}