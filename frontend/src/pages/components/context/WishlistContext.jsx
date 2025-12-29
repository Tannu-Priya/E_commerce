import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const addToWishlist = (product) => {
    const newWishlist = [...wishlist, product];
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const removeFromWishlist = (productId) => {
    const newWishlist = wishlist.filter(item => item._id !== productId && item.id !== productId);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId || item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id || product.id)) {
      removeFromWishlist(product._id || product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
