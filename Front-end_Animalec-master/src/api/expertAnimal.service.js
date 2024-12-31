import API_URL from './config.js';

export const sponsorAnimalService = {
  async getAnimalsByExpertId(token, expertId) {
    try {
      const response = await fetch(
        `${API_URL}/expertsanimal/getanimalsbyexpert/${expertId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(handleResponses(response.status));
      }

      const data = await response.json();

      return data.animals;
    } catch (error) {
      throw new Error('Animais e especialistas associados: ' + error.message);
    }
  },
  async getExpertNameById(token, expertId) {
    try {
      const response = await fetch(
        `${API_URL}/expertsanimal/getexpertbyid/${expertId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(handleResponses(response.status));
      }

      const data = await response.json();

      return data.expertName;
    } catch (error) {
      throw new Error('Erro ao buscar nome do patrocinador: ' + error.message);
    }
  },
  async getAnimalNameById(token, animalId) {
    try {
      const response = await fetch(
        `${API_URL}/expertsanimal/getanimalbyid/${animalId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(handleResponses(response.status));
      }

      const data = await response.json();

      return data.animalName;
    } catch (error) {
      throw new Error('Erro ao buscar nome do animal: ' + error.message);
    }
  },
  async getExpertsAnimals(token) {
    const response = await fetch(`${API_URL}/expertsanimal`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },

  async addExportAnimal(token, payload) {
    const response = await fetch(`${API_URL}/expertsanimal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || handleResponses(response.status);
      throw new Error(errorMessage);
    }
  },

  async editExpertAnimal(token, payload) {
    const response = await fetch(`${API_URL}/expertsanimal/${payload._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },

  async removeExpertAnimal(token, id) {
    const response = await fetch(`${API_URL}/expertsanimal/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
};

function handleResponses(code) {
  let message = '';
  switch (code) {
    case 401:
      message = 'Não está autorizado a executar esta ação!';
      break;
    case 404:
      message = 'Associação de Especialista e Animal não encontrada!';
      break;
    case 500:
      message = 'Erro no servidor. Tente novamente mais tarde.';
      break;
    default:
      message = 'Mensagem desconhecida';
      break;
  }
  return message;
}

export default sponsorAnimalService;
