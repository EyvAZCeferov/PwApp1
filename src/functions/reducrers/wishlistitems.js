const wishitems = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TO_WISHLIST':
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
        case 'REMOVE_FROM_WISHLIST':
            console.log(action.payload)
            return state.filter(item => item.id !== action.payload.id)
        default:
            return state
    }
}

export default wishitems;
