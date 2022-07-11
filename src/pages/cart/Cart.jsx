import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectCartTotalAmounts,
  selectCartTotalQuantity,
  selectCartItems,
  ADD_TO_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  SAVE_URL,
} from "../../redux/slice/cartSlice";
import { FaTrashAlt } from "react-icons/fa";
import Card from "../../components/card/Card";
import styles from "./cart.module.scss";
import Notiflix from "notiflix";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";

export default function Cart() {
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmounts);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  const increaseCart = (cart) => {
    dispatch(ADD_TO_CART(cart));
  };

  const decreaseCart = (cart) => {
    dispatch(DECREASE_CART(cart));
  };

  const removeFromCart = (cart) => {
    dispatch(REMOVE_FROM_CART(cart));
  };

  const confirmClearCart = () => {
    Notiflix.Confirm.show(
      "Clear Cart",
      "Are you sure you want to clear your cart?",
      "CLEAR",
      "CANCEL",
      function okCb() {
        dispatch(CLEAR_CART());
      },
      function cancelCb() {},
      {
        width: "320px",
        borderRadius: "5px",
        titleColor: "red",
        okButtonBackground: "red",
        cssAnimationStyle: "zoom",
      }
    );
  };

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_QUANTITY());
    dispatch(SAVE_URL(""));
  }, [dispatch, cartItems]);

  const url = window.location.href;

  const checkout = () => {
    if (isLoggedIn) {
      navigate("/checkout-details");
    } else {
      dispatch(SAVE_URL(url));
      navigate("/login");
    }
  };

  return (
    <section className={styles.cart}>
      <div className={`container ${styles.table}`}>
        <h2>Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <>
            <p>Your cart is currently empty</p>
            <br />
            <div>
              <Link to="/#products">&larr; Continue Shopping</Link>
            </div>
          </>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cart, index) => {
                const { id, name, price, imageUrl, cartQuantity } = cart;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>
                      <p>
                        <b>{name}</b>
                      </p>
                      <img
                        src={imageUrl}
                        alt={name}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>${price}</td>
                    <td>
                      <div className={styles.count}>
                        <button
                          className="--btn"
                          onClick={() => decreaseCart(cart)}
                        >
                          -
                        </button>
                        <p>
                          <b>{cartQuantity}</b>
                        </p>
                        <button
                          className="--btn"
                          onClick={() => increaseCart(cart)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{(price * cartQuantity).toFixed(2)}</td>
                    <td className={styles.icons}>
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => removeFromCart(cart)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {cartItems.length ? (
          <div className={styles.summary}>
            <button className="--btn --btn-danger" onClick={confirmClearCart}>
              Clear Cart
            </button>
            <div className={styles.checkout}>
              <div>
                <Link to="/#products">&larr; Continue Shopping</Link>
              </div>
              <br />
              <Card cardClass={styles.card}>
                <p>
                  <b>{`Total cart items(s): ${cartTotalQuantity}`}</b>
                </p>
                <br />
                <div className={styles.text}>
                  <h4>Subtotal:</h4>
                  <h3>${cartTotalAmount.toFixed(2)}</h3>
                </div>
                <p>Taxes and shippings calculated at checkout</p>
                <br />
                <button
                  className="--btn --btn-primary --btn-block"
                  onClick={checkout}
                >
                  Checkout
                </button>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
