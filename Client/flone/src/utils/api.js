const localApi = "https://localhost:44365/api/"
const ruppinApi = ""

const currentApi = localApi

const api = {
    products: currentApi + "Product/",
    categories: currentApi + "Category/",
    orders: currentApi + "Order/",
    users: currentApi + "Users/"
};

export default api;