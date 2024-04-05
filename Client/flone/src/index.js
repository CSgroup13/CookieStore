import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";
import PersistProvider from "./store/providers/persist-provider";
import { setProducts } from "./store/slices/product-slice";
import "animate.css";
import "swiper/swiper-bundle.min.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./assets/scss/style.scss";
import "./i18n";
import api, { getData } from "./utils/api";

getData(api.products)
  .then((products) => {
    const productsWithImages = products.map((product) => ({
      ...product,
      image: `/assets/img/cookies_images/${product.name}.jpg`,
    }));
    store.dispatch(setProducts(productsWithImages));
  })
  .catch((error) => {
    console.error(error);
  });

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <PersistProvider>
      <App />
    </PersistProvider>
  </Provider>
);
