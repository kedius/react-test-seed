import Immutable from 'immutable';

export default store => next => action => {
  const { type, ...params } = action;
  const parseImmutableState = () => {
    const state = store.getState();

    return Object.keys(state).reduce((parsedState, field) => {
      parsedState[field] = state[field] instanceof Immutable.Map
        ? state[field].toJS() : state[field];

      return parsedState;
    }, {});
  };

  console.group(`[${window.performance.now().toFixed(2)}] Action: ${type}`);
  console.log(params);
  console.log('%c prev state:', 'line-height: 18px; color: blue; font-weight: bold', parseImmutableState());

  const result = next(action);
  console.log('%c next state:', 'line-height: 18px; color: green; font-weight: bold', parseImmutableState());
  console.groupEnd();

  return result;
};
