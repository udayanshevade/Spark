import * as types from './types';

export const responsiveResize = ({ width, height }) => ({
  type: types.WINDOW_RESIZE,
  width,
  height,
});

export const responsiveResizeListener = (filter = () => true) => ( // eslint-disable-line
  (dispatch) => {
    const handleEvent = () => {
      if (filter()) {
        dispatch(responsiveResize({
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
        }));
      }
    };
    window.addEventListener('resize', handleEvent);

    return () => { window.removeEventListener('resize', handleEvent); };
  }
);