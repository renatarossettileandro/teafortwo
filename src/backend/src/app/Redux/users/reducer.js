const initialstate = {
    usersId: null,
};

export const usersReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'SET_USER_ID':
            return {
              ...state,
              usersId: action.payload,
            };
        case 'SET_LOGOUT':
            return{
                ...state,
                usersId: null,
            }

        default:
            return state;
    }
  };
