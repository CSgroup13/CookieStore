import cogoToast from 'cogo-toast';
const { createSlice } = require('@reduxjs/toolkit');

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: 0,
        cartItems: [],
        discount: 0
    },
    reducers: {
        addToCart(state, action) {
            const product = action.payload;
            const cartItem = state.cartItems.find(item => item.id === product.id);
            if (!cartItem) {
                // If the product is not already in the cart, add it as a new item
                state.cartItems.push({
                    ...product,
                    quantity: product.quantity ? product.quantity : 1
                });
            } else {
                // If the product is already in the cart, update its quantity and other properties
                state.cartItems = state.cartItems.map(item => {
                    if (item.id === product.id) {
                        return {
                            ...item,
                            quantity: product.quantity ? item.quantity + product.quantity : item.quantity + 1,
                        };
                    }
                    return item;
                });
            }
            // Update totalPrice
            state.totalPrice = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            const discountPrice = state.totalPrice * (1 - (state.discount / 100));
            state.totalPrice = discountPrice;
            cogoToast.success("Added To Cart", { position: "bottom-left" });
        },
        deleteFromCart(state, action) {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
            // Update totalPrice
            state.totalPrice = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            const discountPrice = state.totalPrice * (1 - (state.discount / 100));
            state.totalPrice = discountPrice;
            cogoToast.error("Removed From Cart", { position: "bottom-left" });
        },
        decreaseQuantity(state, action) {
            const product = action.payload;
            if (product.quantity === 1) {
                state.cartItems = state.cartItems.filter(item => item.id !== product.id);
                cogoToast.error("Removed From Cart", { position: "bottom-left" });
            } else {
                state.cartItems = state.cartItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
                cogoToast.warn("Item Decremented From Cart", { position: "bottom-left" });
            }
            // Update totalPrice
            state.totalPrice = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            const discountPrice = state.totalPrice * (1 - (state.discount / 100));
            state.totalPrice = discountPrice;
        },
        deleteAllFromCart(state) {
            state.cartItems = [];
            // Update totalPrice
            state.totalPrice = 0;
        },
        setDiscount(state, action) {
            state.discount = action.payload;
            const discountPrice = state.totalPrice * (1 - (state.discount / 100));
            state.totalPrice = discountPrice;
        }
    }
});

export const { addToCart, deleteFromCart, decreaseQuantity, deleteAllFromCart,setDiscount } = cartSlice.actions;
export default cartSlice.reducer;
