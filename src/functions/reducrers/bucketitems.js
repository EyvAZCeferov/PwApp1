const bucketitems = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            state.map(element => {
                console.log(element)
                console.log(action)
                if (element.id == action.payload.id) {
                    return 'error'
                } else {
                    return [...state, action.payload]
                }
            });
            break;
        case 'REMOVE_FROM_CART':
            return state.filter(item => item.id !== action.payload.id)
        default:
            return state;
    }
}

export default bucketitems;