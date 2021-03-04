import {useReducer} from "react";


export const Reducer = () => {
    const initialState = {
        regularData: [],
        irrRegularData: []
    };
    const [state, dispatch] = useReducer((state=initialState, action) => {

        if(action.type === 'SAVE_REGULAR_DATA'){
            return {...state,
                regularData: action.payload,
            };
        }
        if(action.type === 'SAVE_IRR_REGULAR_DATA'){
            return {...state,
                irrRegularData: action.payload,
            };
        }
        return  state;
    },initialState);
    return {state, dispatch};
}
