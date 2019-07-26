import {
  HAMMER_SUMMARY,
  HAMMER_LIST,
  PAGINATION,
  HAMMER_DETAIL,
  EDIT_HAMMER,
} from './hammer.constants';

export const hammerReducerKey = 'hammer';

const initialState = {
  summary: { totalHammer: 0, pairHammer: 0, unPairHammer: 0 },
  hammerList: [],
  listLoading: true,
  pagination: { totalResult: 0, itemsPerPage: 1, startIndex: 1 },
  detailData: {},
  editData: {},
};

const hammerReducer = (state: any = initialState, action: FMS.Action) => {
  let data = action.payload;
  let newState = { ...state };
  switch (action.type) {
    case HAMMER_SUMMARY:
      newState.summary = data;
      break;
    case HAMMER_LIST:
      newState.listLoading = data.isLoading;
      newState.hammerList = data.data;
      break;
    case PAGINATION:
      newState.pagination = data;
      break;
    case HAMMER_DETAIL:
      newState.detailData = data;
      break;
    case EDIT_HAMMER:
      newState.editData = data;
      break;
    default:
      break;
  }
  return Object.assign({}, state, newState);
};

export default hammerReducer;
