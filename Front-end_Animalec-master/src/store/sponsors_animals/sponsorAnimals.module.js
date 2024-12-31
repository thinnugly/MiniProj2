import sponsorAnimalService from '@/api/sponsorAnimal.service';
import {
  // Actions
  FETCH_SPONSOR_ANIMALS,
  ADD_SPONSOR_ANIMAL,
  EDIT_SPONSOR_ANIMAL,
  REMOVE_SPONSOR_ANIMAL,
  // Mutations
  SET_SPONSOR_ANIMALS,
  SET_SPONSORS,
  SET_ANIMALS,
  SET_MESSAGE,
  UPDATE_ASSOCIATIONS,
} from './sponsorAnimals.constants';

const state = {
  sponsorAnimals: [],
  message: '',
  sponsors: [],
  animals: [],
};

const getters = {
  getSponsorAnimals: (state) => state.sponsorAnimals,
  getSponsorAnimalById: (state) => (id) =>
    state.sponsorAnimals.find((sponsorAnimal) => sponsorAnimal._id === id),
  getMessage: (state) => state.message,
};

const actions = {
  [FETCH_SPONSOR_ANIMALS]: ({ commit, rootState }) => {
    return new Promise((resolve, reject) => {
      sponsorAnimalService.getSponsorsAnimals(rootState.auth.token).then(
        (res) => {
          commit(SET_SPONSOR_ANIMALS, res.body);
          commit(SET_SPONSORS, res.body.sponsors);
          commit(SET_ANIMALS, res.body.animals);
          resolve(res);
        },
        (err) => {
          commit(SET_MESSAGE, err.message);
          reject(err);
        }
      );
    });
  },
  [ADD_SPONSOR_ANIMAL]: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      sponsorAnimalService.addSponsorAnimal(rootState.auth.token, payload).then(
        (res) => {
          commit(SET_MESSAGE, `Animail Patrocinado`);
          resolve(res);
        },
        (err) => {
          commit(SET_MESSAGE, err.message);
          reject(err);
        }
      );
    });
  },
  [EDIT_SPONSOR_ANIMAL]: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      sponsorAnimalService
        .editSponsorAnimal(rootState.auth.token, payload)
        .then(
          (res) => {
            commit(SET_MESSAGE, `A associação foi atualizada com sucesso!`);
            resolve(res);
          },
          (err) => {
            commit(SET_MESSAGE, err);
            reject(err);
          }
        );
    });
  },
  [REMOVE_SPONSOR_ANIMAL]: ({ commit, rootState }, id) => {
    return new Promise((resolve, reject) => {
      sponsorAnimalService.removeSponsorAnimal(rootState.auth.token, id).then(
        (res) => {
          commit(SET_MESSAGE, `A associação foi removida com sucesso!`);
          resolve(res);
        },
        (err) => {
          commit(SET_MESSAGE, err.message);
          reject(err);
        }
      );
    });
  },
};

export const mutations = {
  [SET_SPONSOR_ANIMALS]: (state, sponsorAnimals) => {
    state.sponsorAnimals = sponsorAnimals;
  },
  [SET_ANIMALS]: (state, animals) => {
    state.animals = animals;
  },
  [SET_SPONSORS]: (state, sponsors) => {
    state.sponsors = sponsors;
  },
  [SET_MESSAGE]: (state, message) => {
    state.message = message;
  },
  [UPDATE_ASSOCIATIONS]: (state, payload) => {
    state.sponsorAnimals.forEach((association) => {
      if (association._id === payload.associationId) {
        association.notes = payload.notes;
      }
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
