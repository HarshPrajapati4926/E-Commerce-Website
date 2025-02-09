import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getdefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 301; index++) {
    cart[index] = 0;
  }
  return cart;
};

const getdefaultWishlist = () => {
  let wishlist = {};
  for (let index = 0; index < 301; index++) {
    wishlist[index] = false;
  }
  return wishlist;
};

const ShopContextProvider = (props) => {
  const [All_products, setAll_products] = useState([]);
  const [cartItem, setCartItem] = useState(getdefaultCart());
  const [wishlistItem, setWishlistItem] = useState(getdefaultWishlist());

  // // Search-related states
  // const [query, setQuery] = useState("");
  // const [results, setResults] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/allproduct")
      .then((response) => response.json())
      .then((data) => setAll_products(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const addToCart = (itemId) => {
    setCartItem((prev) => {
      const updatedCart = { ...prev, [itemId]: prev[itemId] + 1 };
      if (localStorage.getItem("auth-token")) {
        fetch("http://localhost:4000/addtocart", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "auth-token": localStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Error adding to cart:", error));
      }
      return updatedCart;
    });
  };

  const addToWishlist = (itemId) => {
    setWishlistItem((prev) => {
      const updatedWishlist = { ...prev, [itemId]: true };
      if (localStorage.getItem("auth-token")) {
        fetch("http://localhost:4000/addtowishlist", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "auth-token": localStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Error adding to wishlist:", error));
      }
      return updatedWishlist;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItem((prev) => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 0),
    }));
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItem((prev) => ({ ...prev, [itemId]: false }));
  };

  const GetTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        let itemInfo = All_products.find(
          (product) => product.id === Number(item)
        );
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItem[item];
        }
      }
    }
    return totalAmount;
  };

  const GetTotalCartItem = () => {
    let totalItem = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        totalItem += cartItem[item];
      }
    }
    return totalItem;
  };

  // const handleSearch = async () => {
  //   if (!query) {
  //     setError("Query cannot be empty");
  //     return;
  //   }

  //   setLoading(true);
  //   setError(""); // Clear previous errors
  //   try {
  //     const response = await fetch(
  //       `http://localhost:4000/searchproducts?query=${query}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const data = await response.json();
  //     setResults(data.products);
  //   } catch (error) {
  //     setError("An error occurred while searching");
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const contextValue = {
    All_products,
    cartItem,
    wishlistItem,
    addToCart,
    removeFromCart,
    GetTotalCartAmount,
    GetTotalCartItem,
    removeFromWishlist,
    addToWishlist,
    // query,
    // setQuery,
    // handleSearch,
    // results,
    // loading,
    // error,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
