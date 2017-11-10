
import * as actions_name from './actions';
import { tassign } from 'tassign'; 

export interface IAppState {
    timesheet: any;
};

export const INITIAL_STATE: IAppState = {
    timesheet: []
};
  
export function rootReducer(state: IAppState, action): IAppState {
    switch (action.type) {
        case actions_name.SUBMIT_TIMESHEET: return tassign(state, { timesheet: action.payload });
    }
    return state;
};