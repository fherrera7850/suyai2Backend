export const getDefaultCart = () => {
    // Supongamos que tienes una lista de productos disponibles
    const products = [
      { id: 1, name: 'Dispensador USB', price: 7000 },
      { id: 2, name: 'Dispensador sobremesa', price: 6000 },
      { id: 3, name: 'Recarga 20 litros', price: 2000 },
      { id: 4, name: 'Recarga 10 litros', price: 1300 },
      { id: 5, name: 'Bidón + recarga 20 litros', price: 5000 },
      { id: 6, name: 'Bidón + recarga 10 litros', price: 3500 },
      { id: 7, name: 'Recarga 20 litros (Agua Alcalina)', price: 3200 },
      { id: 7, name: 'Recarga 10 litros (Agua Alcalina)', price: 2000 },
    ];
  
    // Inicializas el carrito con cantidades predeterminadas para cada producto
    const cart = {};
    products.forEach((product) => {
      cart[product.id] = 0; // La cantidad inicial es 0 para cada producto
    });
  
    return cart;
};


  /*
  
  const getDefaultCart = () => {
  let cart = {};
  for (let i = 1; i < PRODUCTS.length + 1; i++) {
    cart[i] = 0;
  }
  return cart;
};
  
  */