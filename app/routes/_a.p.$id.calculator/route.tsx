import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { UserService } from "@berkziya/ozen-bot";

export async function loader({ params }: LoaderFunctionArgs) {
  const playerId = parseInt(params.id!);
  const client = UserService.getInstance();
  const user = client.getUser(playerId);
  invariant(user, "No user found");

  return {
    initialRates: {
      berryToGold: 18e3 / 10e12,

      goldToOil: 2988364,
      goldToOre: 3429115,
      goldToUranium: 376941,
      goldToDiamonds: 462,
      goldToHelium: 955,
      goldToDamage: 3e6 / 30,

      goldToBerry: 250e6 / 1,

      oilToBerry: 160 / 1,
      oreToBerry: 106 / 1,
      uraniumToBerry: 1e3 / 1,
      diamondsToBerry: 800e3 / 1,
      heliumToBerry: 505e3 / 1,
      damageToBerry: 7e3 / 1,

      berryToMoney: 18 / 1e12,
      MoneyToBerry: 1e12 / 21,
    },
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const rates = {
    berryToGold: parseFloat(formData.get("berryToGold") as string),

    goldToOil: parseFloat(formData.get("goldToOil") as string),
    goldToOre: parseFloat(formData.get("goldToOre") as string),
    goldToUranium: parseFloat(formData.get("goldToUranium") as string),
    goldToDiamonds: parseFloat(formData.get("goldToDiamonds") as string),
    goldToHelium: parseFloat(formData.get("goldToHelium") as string),
    goldToDamage: parseFloat(formData.get("goldToDamage") as string),
    goldToBerry: parseFloat(formData.get("goldToBerry") as string),
    oilToBerry: parseFloat(formData.get("oilToBerry") as string),
    oreToBerry: parseFloat(formData.get("oreToBerry") as string),
    uraniumToBerry: parseFloat(formData.get("uraniumToBerry") as string),
    diamondsToBerry: parseFloat(formData.get("diamondsToBerry") as string),
    heliumToBerry: parseFloat(formData.get("heliumToBerry") as string),
    damageToBerry: parseFloat(formData.get("damageToBerry") as string),
    berryToMoney: parseFloat(formData.get("berryToMoney") as string),
    MoneyToBerry: parseFloat(formData.get("MoneyToBerry") as string),
  };

  const gold = 18e3;

  const resources = {
    oil: gold * rates.goldToOil,
    ore: gold * rates.goldToOre,
    uranium: gold * rates.goldToUranium,
    diamonds: gold * rates.goldToDiamonds,
    helium: gold * rates.goldToHelium,
    damage: gold * rates.goldToDamage,
    fixed: gold,
  };

  const berry: { [key: string]: number } = {
    oil: resources.oil * rates.oilToBerry,
    ore: resources.ore * rates.oreToBerry,
    uranium: resources.uranium * rates.uraniumToBerry,
    diamonds: resources.diamonds * rates.diamondsToBerry,
    helium: resources.helium * rates.heliumToBerry,
    damage: resources.damage * rates.damageToBerry,
    fixed: resources.fixed * rates.goldToBerry,
  };

  const backToGold: { [key: string]: number } = {
    oil: berry.oil * rates.berryToGold,
    ore: berry.ore * rates.berryToGold,
    uranium: berry.uranium * rates.berryToGold,
    diamonds: berry.diamonds * rates.berryToGold,
    helium: berry.helium * rates.berryToGold,
    damage: berry.damage * rates.berryToGold,
    fixed: berry.fixed * rates.berryToGold,
  };

  Object.keys(backToGold).forEach((key) => {
    backToGold[key] = Math.floor(backToGold[key]);
  });
  const conversion: { [key: string]: number } = {
    oil: berry.oil * rates.berryToMoney,
    ore: berry.ore * rates.berryToMoney,
    uranium: berry.uranium * rates.berryToMoney,
    diamonds: berry.diamonds * rates.berryToMoney,
    helium: berry.helium * rates.berryToMoney,
    damage: berry.damage * rates.berryToMoney,
    fixed: berry.fixed * rates.berryToMoney,
  };
  Object.keys(conversion).forEach((key) => {
    conversion[key] = Math.floor(conversion[key]);
  });
  const bestConversion = Object.keys(conversion).reduce((best, key) => {
    if (conversion[key] > conversion[best]) {
      return key;
    }
    return best;
  }, "oil");

  return { bestConversion, conversion, backToGold };
}

export default function Convert() {
  const { initialRates } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [rates, setRates] = useState<{ [key: string]: number }>(() => {
    // if (typeof window !== 'undefined') {
    //   const localStorageRates = localStorage.getItem('rates');
    //   return localStorageRates ? JSON.parse(localStorageRates) : initialRates;
    // }
    return initialRates;
  });

  useEffect(() => {
    localStorage.setItem("rates", JSON.stringify(rates));
  }, [rates]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRates((prevRates) => ({
      ...prevRates,
      [name]: parseFloat(value) || 0,
    }));
  };

  return (
    <div className="flex">
      <div className="w-3/4 p-4">
        <h2>Enter Conversion Rates</h2>
        <Form method="post">
          {Object.keys(rates).map((rate) => (
            <div key={rate} className="mb-2">
              <label htmlFor={rate}>{rate}</label>
              <input
                type="number"
                id={rate}
                name={rate}
                value={rates[rate]}
                onChange={handleInputChange}
                className="ml-2 border p-1"
              />
            </div>
          ))}
          <button type="submit" className="mt-4 p-2 bg-blue-500 text-white">
            Calculate Best Conversion
          </button>
        </Form>
      </div>
      <div className="w-1/4 p-4">
        <h2>Best Conversion</h2>
        {actionData && actionData.bestConversion && (
          <div>
            <p>{actionData.bestConversion}</p>
            <h3>Conversion</h3>
            <p>{JSON.stringify(actionData.conversion)}</p>
            <h3>Back to Gold</h3>
            <p>{JSON.stringify(actionData.backToGold)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
