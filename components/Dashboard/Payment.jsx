import { useState } from "react";
import getStripe from "../../components/Utils/get-stripejs";
export default function Checkout() {
  const [input, setInput] = useState({
    customDonation: undefined,
    text: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (input.customDonation === undefined || input.text == "") {
      alert("INVALID VALUE");
      return;
    }
    try {
      //Create a Stripe Checkout Session
      const res = await fetch("/api/stripe/checkout_sessions", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
          amount: input.customDonation,
          name: input.text,
        }),
      });
      const result = await res.json();
      const stripe = await getStripe();
      console.log(result);
      const { error } = await stripe.redirectToCheckout({
        sessionId: result.id,
      });
      console.warn(error);
    } catch (err) {
      alert(err);
    }
  }

  // //Create a Cehckout Sesssion
  // const response = await fetchPostJSON("/api/stripe/checkout_sessions", {
  //     amount: input.customDonation,
  //     name: input.text,
  //   });
  //   if (response.statusCode === 500) {
  //     console.error(response.message);
  //     return;
  //   }

  //   const stripe = await getStripe();
  //   const { error } = await stripe!.redirectToCheckout({
  //     sessionId: response.id,
  //   });
  //   console.warn(error.message);
  //   setLoading(false);

  return (
    <div className="card h-80 max-h-80 overflow-auto">
      <div className="border-b border-gray-200 p-3">
        <h3 className="text-base leading-6 dark:text-white">
          Credit Card Transaction
        </h3>
      </div>
      <div className="px-3 py-4">
        <div className="w-96 h-56 m-auto bg-red-100 rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-110 hidden sm:block">
          <img
            className="relative object-cover w-100 h-100 rounded-xl"
            src="https://i.imgur.com/kGkSg1v.png"
          />
          <div className="w-full px-8 absolute top-8">
            <div className="flex justify-between">
              <div className="">
                <p className="font-light">Name</p>
                <p className="font-medium tracking-widest">
                  James Worldwide Inc
                </p>
              </div>
              <img
                className="w-14 h-14"
                src="https://i.imgur.com/bbPHJVe.png"
              />
            </div>
            <div className="pt-1">
              <p className="font-light">Card Number</p>
              <p className="font-medium tracking-more-wider">
                1234 5678 9012 3456
              </p>
            </div>
            <div className="pt-6 pr-6">
              <div className="flex justify-between">
                <div className="">
                  <p className="font-light text-xs">Valid</p>
                  <p className="font-medium tracking-wider text-sm">11/15</p>
                </div>
                <div className="">
                  <p className="font-light text-xs">Expiry</p>
                  <p className="font-medium tracking-wider text-sm">03/25</p>
                </div>

                <div className="">
                  <p className="font-light text-xs">CVV</p>
                  <p className="font-bold tracking-more-wider text-sm">999</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-2">
          <p className="text-center font-thin text-lg">
            Please make sure you have Credit Card Authorization Form ready
          </p>
        </div>
        {/* INPUT FIELD FOR PRICE AND DESCRIPTION */}
        <div className="flex justify-between mt-2">
          <div className="w-1/2 mr-2">
            <label
              htmlFor="price"
              className="block text-sm font-medium dark:text-white"
            >
              Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-2 sm:text-sm border-gray-300 rounded-md py-2 text-black"
                placeholder="0.00"
                pattern="[0-9]{0,5}"
                min={1.0}
                max={10000.0}
                step={0.01}
                onChange={(e) =>
                  setInput({
                    ...input,
                    customDonation: parseFloat(e.target.value),
                  })
                }
                value={input.customDonation}
              />
            </div>
          </div>

          <div className="w-100">
            <label
              htmlFor="description"
              className="block text-sm font-medium dark:text-white"
            >
              Description
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="description"
                name="description"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 sm:text-sm border-gray-300 rounded-md py-2 text-black"
                placeholder="Description"
                value={input.text}
                onChange={(e) => setInput({ ...input, text: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* CHECKOUT BUTTON */}
        <button
          onClick={handleSubmit}
          className="my-2 p-2 w-100 rounded font-semibold bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
        >
          Checkout
        </button>
      </div>
      {/* FAKE CARD */}
    </div>
  );
}
