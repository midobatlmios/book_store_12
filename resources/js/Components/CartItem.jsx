import { useState } from "react";
import { Link } from "@inertiajs/react";

import CartQuantity from "@/Components/CartQuantity";

export default function CartItem({ cart }) {
  const [isDisabled, setIsDisabled] = useState(false);

  // Add validation to ensure cart and bookOwner exist
  if (!cart || !cart.bookOwner) {
    return null;
  }

  const price = (cart.bookOwner.price * cart.quantity).toLocaleString(
    "en-MA",
    {
      style: "currency",
      currency: "MAD",
      maximumFractionDigits: 2,
    }
  );

  return (
    <div className="flex items-center space-x-3 md:space-x-6">
      <Link
        href={route("book.show", cart.bookOwner.id)}
        className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 rounded-md shrink-0 transition-transform ease-in-out hover:scale-105"
      >
        <img
          src={`/book-images/${cart.bookOwner.image}`}
          alt={cart.bookOwner.title}
          className={`w-28 h-40 object-cover rounded-md ${
            isDisabled ? "animate-pulse" : ""
          }`}
        />
      </Link>
      <div className="flex flex-col text-gray-900 dark:text-white">
        <p className={`font-medium ${isDisabled ? "animate-pulse" : ""}`}>
          {price}
        </p>
        <Link
          href={route("book.show", cart.bookOwner.id)}
          className="hover:underline"
        >
          <p className={`font-medium ${isDisabled ? "animate-pulse" : ""}`}>
            {cart.bookOwner.title}
          </p>
        </Link>
        <CartQuantity
          cart={cart}
          isDisabled={isDisabled}
          setIsDisabled={setIsDisabled}
        />
      </div>
    </div>
  );
}
