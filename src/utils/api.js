const baseUrl = "http://localhost:3001";

// ------------------ HELPER ------------------
export function checkResponse(res) {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
}

// ------------------ ITEM ENDPOINTS ------------------

// Public
export function getItems() {
  return fetch(`${baseUrl}/items`).then(checkResponse);
}

// Protected
export const addItem = ({ name, imageUrl, weather }, token) => {
  let imageURL = imageUrl;
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, imageUrl, weather }),
  }).then(checkResponse);
};

export const deleteItem = (id, token) => {
  return fetch(`${baseUrl}/items/${id}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token}` },
  }).then(checkResponse);
};

// ✅ ADD LIKE
export const addCardLike = (id, token) => {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "PUT",
    headers: { authorization: `Bearer ${token}` },
  }).then(checkResponse);
};

// ✅ REMOVE LIKE
export const removeCardLike = (id, token) => {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token}` },
  }).then(checkResponse);
};

// ------------------ USER ENDPOINTS ------------------

export const getCurrentUser = (token) => {
  return fetch(`${baseUrl}/users/me`, {
    headers: { authorization: `Bearer ${token}` },
  }).then(checkResponse);
};

export const updateUserProfile = ({ name, avatar }, token) => {
  return fetch(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, avatar }),
  }).then(checkResponse);
};

// ------------------ DEFAULT EXPORT ------------------

const api = {
  getItems,
  addItem,
  deleteItem,
  addCardLike,
  removeCardLike,
  getCurrentUser,
  updateUserProfile,
  checkResponse,
};

export default api;
