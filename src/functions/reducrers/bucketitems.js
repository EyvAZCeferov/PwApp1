const bucketitems = (state = [], action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      try {
        var eyni = false;
        state.map((element) => {
          if (element.id == action.payload.id) {
            eyni = true;
            element.qyt++;
          }
        });
        if (eyni) {
          return [...state];
        } else {
          return [...state, action.payload];
        }
      } catch (e) {
        alert(e);
      }
      break;
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload.id);
    case "UPDATE_CART":
      try {
        state.map((element) => {
          if (element.id == action.payload.item.id) {
            element.qyt = action.payload.value;
          }
        });
        return [...state];
      } catch (e) {}
    default:
      return state;
  }
};

export default bucketitems;
