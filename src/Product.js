import React from "react";
import "./Product.css";
import { useStateValue } from "./StateProvider";

/* el title, price, etc... son props y se utilizan para cambiar valores */
/* ajustando desde home, en el apartado de product */
function Product({ id, title, price, image, rating }) {
  const [state, dispatch] = useStateValue();

  /* VARIABLE USADA EN ONCLICK, AL BOTON ADD TO BASKET */
  const addToBasket = () => {
    //DISPATCH THE ITEM INTO THE DATALAYER
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating: rating,
      },
    });
  };

  return (
    <div className="product">
      <div className="product__info">
        <p>{title}</p>
        {/* usa el props de title */}
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
          {/* usa el prop de price */}
        </p>
        <div className="product__rating">
          {/* usa props RATING  */}
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p>⭐</p>
            ))}
        </div>
      </div>

      <img src={image} />

      <button onClick={addToBasket}>Add to Basket</button>
    </div>
  );
}

export default Product;
