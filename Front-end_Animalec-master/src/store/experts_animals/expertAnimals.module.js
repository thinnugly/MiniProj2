import expertAnimalService from '@/api/expertAnimal.service';
import {
  // Actions
  FETCH_EXPERT_ANIMALS,
  ADD_EXPERT_ANIMAL,
  EDIT_EXPERT_ANIMAL,
  REMOVE_EXPERT_ANIMAL,
  // Mutations
  SET_EXPERT_ANIMALS,
  SET_SPONSORS,
  SET_ANIMALS,
  SET_MESSAGE,
  UPDATE_ASSOCIATIONS,
} from './expertAnimals.constants';

const state = {
  expertAnimals: [],
  message: '',
};

const getters = {
  getExpertAnimals: (state) => state.expertAnimals,
  getExpertAnimalById: (state) => (id) =>
    state.expertAnimals.find((expertAnimal) => expertAnimal._id === id),
  getMessage: (state) => state.message,
};

const actions = {
  [FETCH_EXPERT_ANIMALS]: ({ commit, rootState }) => {
    return new Promise((resolve, reject) => {
      expertAnimalService.getExpertsAnimals(rootState.auth.token).then(
        (res) => {
          commit(SET_EXPERT_ANIMALS, res.body);
          resolve(res);
        },
        (err) => {
          commit(SET_MESSAGE, err.message);
          reject(err);
        }
      );
    });
  },
  [ADD_EXPERT_ANIMAL]: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      expertAnimalService.addExportAnimal(rootState.auth.token, payload).then(
        (res) => {
          commit(SET_MESSAGE, `Animail Associado`);
          resolve(res);
        },
        (err) => {
          commit(SET_MESSAGE, err.message);
          reject(err);
        }
      );
    });
  },
  [EDIT_EXPERT_ANIMAL]: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      expertAnimalService.editExpertAnimal(rootState.auth.token, payload).then(
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
  [REMOVE_EXPERT_ANIMAL]: ({ commit, rootState }, id) => {
    return new Promise((resolve, reject) => {
      expertAnimalService.removeExpertAnimal(rootState.auth.token, id).then(
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
  [SET_EXPERT_ANIMALS]: (state, expertAnimals) => {
    state.expertAnimals = expertAnimals;
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
