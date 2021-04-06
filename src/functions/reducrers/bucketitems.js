const bucketitems = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            try {
                if (state.length > 0) {
                    return state.map(element => {
                        if (element.id == action.payload.id) {
                            return [...state, action.payload]
                        } else {
                            return [...state, action.payload]
                        }
                    });
                } else {
                    return [...state, action.payload];
                }
                ;
            } catch (e) {
                alert(e);
            }
            break;
        case 'REMOVE_FROM_CART':
            return state.filter(item => item.id !== action.payload.id)
        case "UPDATE_CART":
            return state;
        default:
            return state;
    }
}

export default bucketitems;
