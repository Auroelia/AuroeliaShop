import { client } from '@/lib/client';
import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {


  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0)
  const [envio, setEnvio] = useState(500);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0)
  const [isCartInitialized, setIsCartInitialized] = useState(false);
  const [ventas, setVentas] = useState([]);




  useEffect(() => {
    const localData = localStorage.getItem('cart');
    if (localData) {
      setCart(JSON.parse(localData));
    }
    setIsCartInitialized(true);
  }, []);

  useEffect(() => {
    if (isCartInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isCartInitialized]);



  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
        total += item.product.price * item.qty;
    });
    setSubtotal(total);
}, [cart]);

useEffect(() => {
  setIva((subtotal * 0.16));
}, [subtotal]);

useEffect(() => {
  setTotal((subtotal+iva+envio));
}, [subtotal,iva,envio]);

const addToCart = (product, size, qty) => {
  
  setCart((currentCart) => {
    // Buscar el producto en el carrito
    const index = currentCart.findIndex(
      (item) => item.product._id === product._id
    );

    // Si el producto ya está en el carrito, incrementar su cantidad
    if (index !== -1) {
      const newCart = [...currentCart];
      newCart[index].qty += qty;
      return newCart;
    }

    // Si el producto no está en el carrito, agregarlo
    return [...currentCart, { product, size, qty }];
  });
};

  // Read
  const getCart = () => cart;

  // Update
  const updateCartItem = (productId, size, qty) => {
    setCart((currentCart) => {
      return currentCart.map((item) => 
        item.product._id === productId 
          ? {product: item.product, size, qty} 
          : item
      );
    });
  };

   // Delete
   const removeFromCart = (productId) => {
    console.log("entre")
    console.log(productId)
    setCart((currentCart) => currentCart.filter((item) => item.product._id !== productId));
  };

  // Delete
  const deleteCart = () => {
    setCart([]);
  };

  //loginUser
  async function loginUser(email, password) {
    const query = `*[_type == "usuarios" && email == $email] `;

    const params = { email };
    const users = await client.fetch(query, params);

    if (users.length === 0) {
      throw new Error("El correo electrónico no existe");
    }

    const user = users[0];

    // Aquí debes verificar la contraseña usando la librería de tu elección
    // Por ejemplo, bcrypt
    const isPasswordCorrect = await checkPassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Contraseña incorrecta");
    }

    // Genera un token JWT
    const tokenPayload = {
      id: user._id,
      email: user.email,
    };

    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;

    try {
      const token = await new Promise((resolve, reject) => {
        jwt.sign(tokenPayload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        });
      });

      // Devuelve el usuario y el token JWT
      return { user, token };
    } catch (error) {
      console.error("Error al firmar el token JWT:", error);
      throw new Error("Error al firmar el token JWT");
    }
  }

    //postUser

    async function postUser(name, email, password) {
      client.create({
        _type: "usuarios",
        name: name,
        email: email,
        password: password,
        registerDate: new Date(),
      });
    }

    async function getVentas() {
      const query = '*[_type == "ventas"]';
      const resultado = await client.fetch(query);
      setVentas(resultado);
    }
  
    async function getVenta(ref) {
      try {
        const query = `*[ _id == "${ref}"]`;
        const resultado = await client.fetch(query);
        if (resultado.length > 0) {
          return resultado[0]
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error al obtener la venta:", error);
        throw error; 
      }
    }

    // Update
    const updateVenta = async (ref, updatedData) => {
      try {
        await client.patch(ref, (patch) => {
          Object.keys(updatedData).forEach((key) => {
            patch.set(key, updatedData[key]);
          });
        });
        setVentas((prevVentas) => {
          const updatedVentas = prevVentas.map((venta) => {
            if (venta._id === ref) {
              return { ...venta, ...updatedData };
            }
            return venta;
          });
          return updatedVentas;
        });
      } catch (error) {
        console.error("Error al actualizar la venta:", error);
        throw error;
      }
    };

    // Delete
    const deleteVenta = async (ref) => {
      try {
        await 
        console.log("entre")
        client.delete(ref);
        setVentas(ventas.filter(venta => venta._id !== ref)); // Actualiza el estado para reflejar la venta eliminada
      } catch (error) {
        console.error("Error al eliminar la venta:", error);
        throw error;
      }
    };
  

 

  return (
    <AppContext.Provider value={{ 
      cart,
      subtotal,
      iva,
      envio,
      total,
      ventas,
      setEnvio,
      setSubtotal,
      setIva,
       addToCart,
        getCart,
         updateCartItem,
          removeFromCart,
          deleteCart,
          postUser,
          loginUser,
          getVenta,
          getVentas,
          updateVenta,
          deleteVenta
    
    }}>
      {children}
    </AppContext.Provider>
  );
};