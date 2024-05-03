import Item from "@/components/Carrito/Item";
import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import Otros from "../components/Carrito/Otros/Otros";
import DatosModal from "@/components/Carrito/DatosModal";
import Productos from "../../public/assets/Carrito/Productos";

function Carrito() {
  const { cart } = useContext(AppContext);



  const [total, setTotal] = useState(0);
  const [subtotalPrice, setSubTotalPrice] = useState(0);

  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
      total += item.product.precio * item.qty;
    });
    setTotal(total);
  }, [cart]);

  useEffect(() => {
    const subtotalPrice = cart.reduce(
      (total, item) => total + item.product.precio,
      0
    );
    setSubTotalPrice(subtotalPrice);
  }, [cart]);

  
const [isOpen, setIsOpen] = useState(false);

const [isModalOpen, setModalOpen] = useState(false);

const openModal = () => setModalOpen(true);
const closeModal = () => setModalOpen(false);

const [descuento, setDescuento] = useState(0)



  return (
    <div className="w-full h-full overflow-hidden relative">
      <div
        className="w-full max-w-[1440px] min-w-sm mx-auto flex flex-col lg:flex-row justify-center items-center gap-[33px] px-4 lg:px-0 mt-4
      
      "
      >
        {/* Productos */}
        <div className="lg:w-[639px] flex flex-col justify-center items-center">
          <div className="w-full hidden lg:grid grid-cols-5 place-items-center">
            <div>{/* vacio */}</div>
            <div>Producto</div>
            <div className="hidden lg:block">Cantidad</div>
            <div>{/* vacio */}</div>
            <div>Total</div>
          </div>
          <div className="h-[1px] bg-[#E39C9D] w-full hidden lg:block" />
          {
          cart.length>0?
          cart.map((item, index) => (
            <Productos
            key={index}
            item={item}
            />
          ))
        :
        <div className="w-full h-[200px] flex flex-col items-center justify-center">
          <span className="text-[24px] font-inter font-bold">Carrito Vacio</span>
          <span className="text-[16px] font-inter font-light">Agrega productos</span>
          </div>
        }
          <div className="h-[1px] bg-[#E39C9D] w-full" />
          <div className="w-full flex flex-row justify-end gap-[15px] mt-[13px]">
            <input
              type="text"
              placeholder="Codigo de Descuento"
              className="w-[184px] h-[30px] border-[1px] border-[#E39C9D]
rounded-[6px]
"
            />
            <div className="w-[97px] h-[30px] rounded-[6px]  bg-[#E39C9D] flex flex-row items-center justify-center font-bold ">
              Usar
            </div>
          </div>
          <div className="w-full h-full flex flex-row justify-end font-inter text-[16px] font-light mt-[13px] ">
            <div className=" flex flex-col">
              <span>Sub Total</span>
              <span>Descuento</span>
              <span>Total</span>
            </div>
            <div className=" flex flex-col w-[120px] items-end">
              <span>${subtotalPrice}</span>
              <span>{descuento}%</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
        {/* envio */}
        <div className=" flex flex-col items-center">
          <div className="w-[349px]">
            <span className=" text[16px] font-inter font-bold">
              Selecciona Fecha y Hora de Entrega
            </span>
            <input
              type="date"
              className="w-full h-[40px] border-[1px] border-[#E39C9D] rounded-[10px] mt-[10px]"
            />
            <input
              type="time"
              className="w-full h-[40px] border-[1px] border-[#E39C9D] rounded-[10px] mt-[10px]"
            />
            <span className=" text[16px] font-inter font-bold">
              Escribe o elige una dedicatoria
            </span>
            <textarea
              placeholder="Escribe el mensaje"
              className="h-[164px] w-full border-[1px] border-[#E39C9D]"
            />
            <div className="w-full flex justify-between items-center">
              <span className="text-[12px] font-light">
                Genera un mensaje para
              </span>
              <div className="w-[111px] h[30px] border-[2px] border-[#E39C9D] rounded-[6px] flex justify-between px-2">
                Novia/o{" "}
                <img
                  src="/assets/icons/up.svg"
                  alt="arrow down"
                  className="rotate-180"
                />
              </div>

              <div>
                <button className="w-[84px] h-[30px] rounded-[6px] bg-[#E39C9D]">
                  Generar
                </button>
              </div>
            </div>
            <div className="">
              <button className="w-[349px] h-[40px] rounded-[6px] bg-[#E39C9D] mt-[10px] font-bold text-[24px] font-inter mt[30px]"
              onClick={openModal}
              >
                Pagar
              </button>
              {isModalOpen && (
     <DatosModal
     isOpen={isModalOpen} close={closeModal} title="Título del Modal"
   />
    )}
            </div>
          </div>
        </div>
      </div>
      <Otros />
    </div>
  );
}

export default Carrito;
