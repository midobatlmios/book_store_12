import { Link } from "@inertiajs/react";
import { Button } from "flowbite-react";
import { useState } from "react";
import { router } from "@inertiajs/react";

export default function CartTableRow({ cart }) {
  const [quantity, setQuantity] = useState(cart.quantity);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    setIsDisabled(true);

    router.visit(route("cart.update", cart.id), {
      method: 'put',
      data: { bookQuantity: newQuantity },
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setIsDisabled(false);
      },
      onError: () => {
        setIsDisabled(false);
        setQuantity(cart.quantity);
      }
    });
  };

  const handleRemove = () => {
    setIsDisabled(true);

    router.visit(route("cart.destroy", cart.id), {
      method: 'delete',
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setIsDisabled(false);
      },
      onError: () => {
        setIsDisabled(false);
      }
    });
  };

  if (!cart || !cart.book_owner) {
    return null;
  }

  return (
    <tr className="border-b dark:border-gray-700">
      <td className="py-4">
        <div className="flex items-center">
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border dark:border-gray-700">
            <img
              src={`/book-images/${cart.book_owner.image}`}
              alt={cart.book_owner.title}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="ml-4 flex flex-1 flex-col">
            <div>
              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                <h3>
                  <Link href={route("book.show", cart.book_owner.id)}>
                    {cart.book_owner.title}
                  </Link>
                </h3>
                <p className="ml-4">
                  {cart.book_owner.price.toLocaleString("en-MA", {
                    style: "currency",
                    currency: "MAD",
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {cart.book_owner.author}
              </p>
            </div>
            <div className="flex flex-1 items-end justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Button
                  size="xs"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={isDisabled || quantity <= 1}
                >
                  -
                </Button>
                <span className="text-gray-500 dark:text-gray-400">
                  {quantity}
                </span>
                <Button
                  size="xs"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={isDisabled}
                >
                  +
                </Button>
              </div>

              <div className="flex">
                <Button
                  size="xs"
                  color="failure"
                  onClick={handleRemove}
                  disabled={isDisabled}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
