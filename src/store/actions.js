import * as types from './mutation-types';

export function actionBikeType({commit}, {bikeType}) {
  commit(types.SET_BIKETYPE, bikeType);
};
