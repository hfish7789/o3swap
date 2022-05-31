import { ChainTokens, UPDATE_CHAIN_TOKENS } from '@lib';

const initialState = {
  chainTokens: new ChainTokens(),
};

export default function tokens(state = initialState, action): any {
  switch (action.type) {
    case UPDATE_CHAIN_TOKENS:
      return { ...state, chainTokens: action.data };
    default:
      return state;
  }
}
