import CheckoutItem from "@/Pages/Checkout/Partials/CheckoutItem";

export default function CheckoutTotal({ carts }) {
  // Filter out carts with invalid book_owner data
  const validCarts = carts.filter(cart => cart && cart.book_owner && typeof cart.book_owner.price === 'number');

  const subTotal = validCarts
    .map((cart) => cart.book_owner.price * cart.quantity)
    .reduce((totalPrice, currentPrice) => totalPrice + currentPrice, 0)
    .toLocaleString("en-MA", {
      style: "currency",
      currency: "MAD",
      maximumFractionDigits: 2,
    });

  const shipping = (10).toLocaleString("en-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  });

  const totalAll = (
    validCarts
      .map((cart) => cart.book_owner.price * cart.quantity)
      .reduce((totalPrice, currentPrice) => totalPrice + currentPrice, 0) + 10
  ).toLocaleString("en-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex flex-col space-y-4 text-gray-900 dark:text-white">
      {validCarts.map((cart) => (
        <CheckoutItem key={cart.id} cart={cart} />
      ))}

      <div className="flex flex-col space-y-2 border-y border-gray-200 dark:border-gray-600 py-4 text-sm">
        <div className="flex justify-between items-center">
          <p>Subtotal</p>
          <p className="font-medium">{subTotal}</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Shipping</p>
          <p className="font-medium">{shipping}</p>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <p>Total</p>
        <p className="font-medium text-lg">{totalAll}</p>
      </div>
    </div>
  );
}
