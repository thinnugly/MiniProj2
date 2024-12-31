import API_URL from './config.js';

export const expertService = {
  async getExperts(token) {
    let response = await fetch(`${API_URL}/experts`, {
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

  async addExpert(token, payload) {
    const response = await fetch(`${API_URL}/experts`, {
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

  async editExpert(token, payload) {
    const response = await fetch(`${API_URL}/experts/${payload._id}`, {
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

  async removeExpert(token, id) {
    const response = await fetch(`${API_URL}/experts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
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
};

function handleResponses(code) {
  let message = '';
  switch (code) {
    case 401:
      message = 'Não está autorizado a executar esta ação!';
      break;
    case 404:
      message = 'Especialista não encontrado!';
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

export default expertService;
