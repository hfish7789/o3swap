import { UPDATE_RATES } from '@lib';

const initialState = {
  rates: {},
};

export default function rates(state = initialState, action): any {
  switch (action.type) {
    case UPDATE_RATES:
      return { rates: action.data };
    default:
      return state;
  }
}
