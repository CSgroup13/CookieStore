import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import cogoToast from "cogo-toast";
import api, { putData } from "src/utils/api";
import { setProducts } from "src/store/slices/product-slice";

function ProductModalEdit({ product, show, onHide }) {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const onCloseModal = () => {
    onHide();
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "price" || name === "rate") {
      value = Number(value);
    }
    if (name === "ingredients") {
      value = value.split(",");
    }
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleSaveChanges = () => {
    putData(api.products + "updateProduct", editedProduct);
    const newProducts = products.map((prod) =>
      prod.id === editedProduct.id ? editedProduct : prod
    );
    dispatch(setProducts(newProducts)); // Dispatch the action to update the product
    onHide();
    cogoToast.success("Product details updated successfully");
  };

  return (
    <Modal
      show={show}
      onHide={onCloseModal}
      className="product-quickview-modal-wrapper"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Product Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formProductName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProductPrice">
            <Form.Label>Product Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter product price"
              name="price"
              value={editedProduct.price}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProductIngredients">
            <Form.Label>Ingredients</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter product ingredients (separated by commas)"
              rows={3}
              name="ingredients"
              value={editedProduct.ingredients.join(",")}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProductDescription">
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter product description"
              rows={3}
              name="description"
              value={editedProduct.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProductRate">
            <Form.Label>Product Rate</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter product rate"
              name="rate"
              value={editedProduct.rate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProductImage">
            <Form.Label>Product Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product image URL"
              name="image"
              value={editedProduct.image}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

ProductModalEdit.propTypes = {
  onHide: PropTypes.func,
  product: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    ingredients: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    rate: PropTypes.number,
    image: PropTypes.string,
  }),
  show: PropTypes.bool,
  wishlistItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({}),
};

export default ProductModalEdit;
