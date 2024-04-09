import React, { useEffect, useRef, useState } from "react";

const RESULTS = [
  "Office Door Temperature",
  "Office Gateway",
  "Office Pressure",
  "Office Fuel Level",
  "Office Fuel Consumption",
  "Truck Gateway",
  "Truck Temperature",
  "Truck Pressure",
  "Truck Fuel Level",
  "Truck Fuel Consumption",
];

export function AutoComplete() {
  const [value, setValue] = useState<string>("");

  const { loading, data } = useSearch(value);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <label>
        Search products
        <br />
        <input
          type="text"
          value={value}
          onChange={(event) => handleChange(event)}
        />
      </label>
      <ul>
        {value.length ? (
          loading ? (
            <li>Loading...</li>
          ) : !data?.length ? (
            <li>No matches 🤷</li>
          ) : (
            data.map((result: string) => {
              return <li>{result}</li>;
            })
          )
        ) : null}
      </ul>
    </div>
  );
}

type ReturnSenors = {
  loading: boolean;
  data: string[];
};

type DataCache = Record<string, string[]>;

const useSearch = (input: string): ReturnSenors => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<string[]>([]);
  const cache = useRef<DataCache>({});

  useEffect(() => {
    const getCachedData = async (input: string) =>
      cache.current[input] ? cache.current[input] : await fetchProducts(input);

    const fetchResults = async () => {
      setLoading(true);

      const response = await getCachedData(input);

      cache.current = {
        ...cache.current,
        [input]: response,
      };

      setData(response);

      setLoading(false);
    };

    fetchResults();
  }, [input]);

  return { loading, data };
};

const fetchProducts = async (input: string): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        RESULTS.filter((sensor) =>
          sensor.toLowerCase().includes(input.toLowerCase())
        )
      );
    }, Math.random() * 1000 + 200);
  });
};
