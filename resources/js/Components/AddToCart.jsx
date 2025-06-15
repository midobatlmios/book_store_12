import { useState } from "react";
import { Button } from "flowbite-react";
import { router } from "@inertiajs/react";

import { useCartDrawer } from "@/Hooks/useCartDrawer";

export default function AddToCart({ id, quantity }) {
  const drawer = useCartDrawer();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    console.log('Adding to cart:', { bookId: id, bookQuantity: quantity });

    router.visit(route("cart.store"), {
      method: 'post',
      data: { bookId: id, bookQuantity: quantity },
      preserveScroll: true,
      preserveState: true,
      onStart: () => {
        setIsDisabled(true);
      },
      onSuccess: () => {
        setIsDisabled(false);
        drawer.onOpen();
      },
      onError: (errors) => {
        console.error('Error adding to cart:', errors);
        setIsDisabled(false);
      }
    });
  };

  return (
    <Button
      fullSized
      type="button"
      disabled={isDisabled}
      onClick={(e) => handleClick(e)}
      className="rounded-full"
    >
      Add to Cart
    </Button>
  );
}
