
import {fetch, addTask} from 'domain-task';

export interface IMail {
    sender: string;
    subject: string;
    time: Date;
}

export interface IMailState {
    status: string;
    data: { [s: string]: IMail[] };
    sources: string[];
}

export interface AppState {
    mailState: IMailState;
    peopleState: IPeopleState;
}

// reduces
import { Reducer } from 'redux';

export enum IMailActionTypes {
    RequestMail = 'REQUEST_MAIL',
    ReceiveMail = 'RECEIVE_MAIL',
    AddData = 'ADD_DATA',
    ClearData = 'CLEAR_DATA',
}

interface RequestAction {
    type: IMailActionTypes.RequestMail
}
interface ReceiveMail {
    type: IMailActionTypes.ReceiveMail;
    sources: string[];
}
interface AddData {
    type: IMailActionTypes.AddData;
    data: IMail[];
    source: string;
}
interface ClearData {
    type: IMailActionTypes.ClearData
}

export type IMailAction = RequestAction | ReceiveMail | AddData | ClearData;
/**
 * actions creators are obj {
 *  [key] : functions return a action
 *  [key] : functions return a appthunk function (dispatch, getState) => {[we can call dispatch() and getState() here]}
 * }
 */
export const mailActionCreators = {
    request: (): AppThunkAction<IMailAction> => (dispatch, getState) => {
        dispatch( {type: IMailActionTypes.RequestMail})
        let url = 'api/sources'
        let fetchTask = fetch(url, {credentials: 'same-origin'})
        .then(response => response.json() as Promise<string[]>)
        .then(data => {
            dispatch( {type: IMailActionTypes.ReceiveMail, sources: data})
        })
        addTask(fetchTask);
    },
    addData: (data: IMail[], source: string) => { type: IMailActionTypes.AddData, source, data},
    ClearData: () => { type: IMailActionTypes.ClearData }
}

/**
 * reducer is a function take local state and corresponding action, to do something with the state
 * reducer: Reducer<statetype> = (state:statetype, action:actiontype) => {
 *  swtich(action.type) :
 *      case a:
 *          return state
 *      default:
 *          const exhaustivecheck: never = action
 * }
 * @param state 
 * @param action 
 */
export const mailReducer: Reducer<IMailState> = (state: IMailState, action: IMailAction) => {
    switch (action.type) {
        case IMailActionTypes.RequestMail:
            return state;
        case IMailActionTypes.ReceiveMail:
            return { ...state, sources: action.sources};
        case IMailActionTypes.AddData:
            return { ...state, data : {...state.data, [action.source]: action.data}};
        case IMailActionTypes.ClearData:
            return { ...state, data: {}};
        default:
            const exhaustiveCheck: never = action;
    }
    return state || {
        data: {},
        status: 'loading',
        sources: []
    }
}

export const reducers = {
    mailState: mailReducer,
    peopleState: peopleReducer
}

export interface AppThunkAction<TACtion> {
    (dispatch: (action: TACtion) => void, getState: () => AppState) : void
}

