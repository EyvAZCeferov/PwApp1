import {combineReducers} from 'redux';
import bucketitems from './bucketitems';
import wishitems from './wishlistitems';

export default combineReducers({
    bucketitems,
    wishitems,
})