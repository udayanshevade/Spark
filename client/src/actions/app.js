import * as types from './types';

export const appSetTipText = tipText => ({
  type: types.APP_SET_TIP_TEXT,
  tipText,
});

export const appSetTipTarget = tipTarget => ({
  type: types.APP_SET_TIP_TARGET,
  tipTarget,
});

export const appShowTipWithText = (text, target) => (dispatch) => {
  dispatch(appSetTipText(text));
  dispatch(appSetTipTarget(target));
};

export const appCloseTip = () => (dispatch) => {
  dispatch(appSetTipTarget(null));
  dispatch(appSetTipText(''));
};
