const localApi = "https://localhost:44365/api/";
// const ruppinApi = "";

const currentApi = localApi;

const api = {
  products: currentApi + "Product/",
  categories: currentApi + "Category/",
  orders: currentApi + "Order/",
  users: currentApi + "Users/",
};

export const getData = (endpoint) => {
  return fetch(endpoint)
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Server error");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw new Error(error.message || "Network error");
    });
};

export const postData = (endpoint, payload) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain",
    },
    body: JSON.stringify(payload),
  };
  return fetch(endpoint, requestOptions)
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText.slice(1, -1) || "Server error");
      }
      return response.json();
    })
    .catch((error) => {
      throw new Error(error.message || "Network error");
    });
};
export default api;
