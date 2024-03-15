import axios from "axios";
import express from "express";

const app = express();

app.get("/game24/:number", async (req, res, next) => {
  try {
    const { number } = req.params;

    const inputNumbers = number.split("").map(Number);

    const operateTwoNumbers = (number1: number, number2: number) => {
      return [
        number1 + number2,
        number1 - number2,
        number2 - number1,
        number1 * number2,
        number1 / number2,
        number2 / number1,
      ];
    };

    const solveGame24 = (numbers: number[]) => {
      // console.log({ numbers });
      const size = numbers.length;

      if (size === 1) {
        if (Math.abs(numbers[0] - 24) < 1e-6) return true;
        return false;
      }

      for (let i = 0; i < size; i += 1) {
        for (let j = i + 1; j < size; j += 1) {
          const nonOperateNumber = [];
          for (let k = 0; k < size; k += 1) {
            if (k !== i && k !== j) nonOperateNumber.push(numbers[k]);
          }

          const operatedValues = operateTwoNumbers(numbers[i], numbers[j]);
          // eslint-disable-next-line no-restricted-syntax
          for (const value of operatedValues) {
            if (solveGame24([value, ...nonOperateNumber])) return true;
          }
        }
      }
      return false;
    };

    return res.send(solveGame24(inputNumbers) ? "true" : "false");
  } catch (err) {
    return next(err);
  }
});

app.get("/:placeName", async (req, res, next) => {
  const { placeName } = req.params;

  try {
    const resp = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      {
        textQuery: placeName,
        includedType: "restaurant",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": "AIzaSyClulrZcf-CYhUdzT_dWwpzCJDoOUSmCmg",
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress",
        },
      },
    );

    return res.send(resp.data);
  } catch (err) {
    return next(err);
  }
});

const run = () => {
  app.listen(3001);
  console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
};

run();
