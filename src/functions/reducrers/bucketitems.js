const bucketitems = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            try {
                return [...state, action.payload];
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
