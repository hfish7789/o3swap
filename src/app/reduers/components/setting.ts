import {
  DEFAULT_DEADLINE,
  DEFAULT_SLIPVALUE,
  IS_CUSTOM_SLIPVALUE,
  UPDATE_SETTING,
} from '@lib';

const initialState = {
  slipValue: DEFAULT_SLIPVALUE,
  isCustomSlip: IS_CUSTOM_SLIPVALUE,
  deadline: DEFAULT_DEADLINE,
};

export default function setting(state = initialState, action): any {
  switch (action.type) {
    case UPDATE_SETTING:
      return action.data;
    default:
      return state;
  }
}
