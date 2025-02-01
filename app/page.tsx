"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa"; // Import the trash icon from react-icons

const images = ["/Desa.jpeg", "/Cina.jpeg", "/IKCP.jpeg"]; // Replace with actual image paths
const productNames = ["Nasi Goreng Desa", "Nasi Goreng Cina", "Nasi Goreng Ikan Bilis Cili Padi"];
const productPrices = [10, 12, 15]; // Prices for each product (adjust as needed)

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [formData, setFormData] = useState({ name: "", tel: "", address: "" }); // Form data

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const increaseQuantity = () => {
    setQuantity((prevQty) => prevQty + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));
  };

  const addToCart = () => {
    const product = productNames[currentIndex];
    const price = productPrices[currentIndex];
    setCart([...cart, { name: product, quantity, price }]);
    setQuantity(1);
  };

  const toggleSelection = (index: number) => {
    const updatedSelection = new Set(selectedItems);
    if (updatedSelection.has(index)) {
      updatedSelection.delete(index);
    } else {
      updatedSelection.add(index);
    }
    setSelectedItems(updatedSelection);
  };

  const deleteSelectedItems = () => {
    const updatedCart = cart.filter((_, index) => !selectedItems.has(index));
    setCart(updatedCart);
    setSelectedItems(new Set());
  };

  const checkout = () => {
    setIsModalOpen(true); // Open the modal when checkout is clicked
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Define the WhatsApp number (update with your own number)
    const whatsappNumber = '60143362554'; // Replace with the correct number
  
    // Prepare the message from form data and cart items
    const cartItems = cart.map((item) => `${item.name} x ${item.quantity} RM${(item.price * item.quantity).toFixed(2)}`).join('%0A');
    const total = calculateCartTotal(); // Calculate the total price
  
    const message = `
      Hello%20I%20want%20to%20order%20%3A%0A
      ${cartItems}%0A
      Total%20Price%20RM${total.toFixed(2)}%0A
      Name: ${formData.name}%0A
      Tel: ${formData.tel}%0A
      Address: ${formData.address}
    `.trim();
  
    // Create the WhatsApp URL with the order details
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
  
    // Open WhatsApp with the message
    window.open(url, '_blank');
  
    // Close the modal after submission (optional)
    setIsModalOpen(false);
  };
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotalPrice = (quantity: number, price: number) => {
    return quantity * price;
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-8 pb-20 gap-6">
      {/* Left Section */}
      <div className="flex flex-col gap-6">
        <div className="relative w-[300px] h-[200px] sm:w-[500px] sm:h-[300px] overflow-hidden rounded-lg shadow-lg">
          <Image
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={prevSlide}
            className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Previous
          </button>
          <button
            onClick={nextSlide}
            className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-4 border border-gray-500 p-2 rounded-lg">
          <button onClick={decreaseQuantity} className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">-</button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button onClick={increaseQuantity} className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">+</button>
        </div>

        <button
          onClick={addToCart}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Add to Cart
        </button>
      </div>

      <div className="w-[300px] h-[200px] sm:w-[400px] sm:h-[300px] border border-gray-300 p-4 rounded-lg shadow-lg flex flex-col justify-between relative">
        {/* The delete button is now correctly positioned inside the cart box */}
        <button
          onClick={deleteSelectedItems}
          disabled={selectedItems.size === 0}
          className={`absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 transition ${selectedItems.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaTrashAlt size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
        {cart.length > 0 ? (
          <div>
            <ul className="text-gray-700">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(index)}
                      onChange={() => toggleSelection(index)}
                      className="mr-2"
                    />
                    <span>{item.name} x {item.quantity}</span>
                  </div>
                  <span>RM{calculateTotalPrice(item.quantity, item.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600">Your cart is empty</p>
        )}

        <div className="mt-auto">
          <button
            onClick={checkout}
            disabled={cart.length === 0}
            className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Checkout
          </button>
        </div>

        {/* Total Price */}
        <div className="mt-4 flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>RM{calculateCartTotal().toFixed(2)}</span>
        </div>
      </div>


      {/* Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="tel" className="block text-sm font-medium text-gray-700">No. Tel</label>
                <input
                  type="text"
                  id="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
