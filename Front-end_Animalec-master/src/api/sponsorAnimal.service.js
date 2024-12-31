import API_URL from './config.js';

export const sponsorAnimalService = {
  async getAnimalsBySponsorId(token, sponsorId) {
    try {
      const response = await fetch(
        `${API_URL}/sponsorsanimal/getanimalsbyponsord/${sponsorId}`,
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
      throw new Error('Animais patrocinados: ' + error.message);
    }
  },
  async getSponsorNameById(token, sponsorId) {
    try {
      const response = await fetch(
        `${API_URL}/sponsorsanimal/getsponsorbyid/${sponsorId}`,
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

      return data.sponsorName;
    } catch (error) {
      throw new Error('Erro ao buscar nome do patrocinador: ' + error.message);
    }
  },
  async getAnimalNameById(token, animalId) {
    try {
      const response = await fetch(
        `${API_URL}/sponsorsanimal/getanimalbyid/${animalId}`,
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
  async getSponsorsAnimals(token) {
    const response = await fetch(`${API_URL}/sponsorsanimal`, {
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

  async addSponsorAnimal(token, payload) {
    const response = await fetch(`${API_URL}/sponsorsanimal`, {
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

  async editSponsorAnimal(token, payload) {
    const response = await fetch(`${API_URL}/sponsorsanimal/${payload._id}`, {
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
      const errorData = await response.json();
      const errorMessage =
        errorData.message || handleResponses(response.status);
      throw new Error(errorMessage);
    }
  },

  async removeSponsorAnimal(token, id) {
    const response = await fetch(`${API_URL}/sponsorsanimal/${id}`, {
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
      message = 'Associação de Patrocinador e Animal não encontrada!';
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
