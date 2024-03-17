import axios from "axios";
import express from "express";

const jenosizeRoute = express.Router();

jenosizeRoute.get("/game24/:number", async (req, res, next) => {
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

interface Place {
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  photos: {
    name: string;
    widthPx: number;
    heightPx: number;
  }[];
  photo: string;
}

jenosizeRoute.get("/place/:placeName", async (req, res, next) => {
  const { placeName } = req.params;

  const API_KEY = "AIzaSyClulrZcf-CYhUdzT_dWwpzCJDoOUSmCmg";

  try {
    const resp = await axios.post<{ places: Place[] }>(
      "https://places.googleapis.com/v1/places:searchText",
      {
        textQuery: placeName,
        includedType: "restaurant",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.photos",
        },
      },
    );

    const places = await Promise.all(
      (resp.data.places || []).map(async (place) => {
        const photo = place.photos?.[0];
        if (!photo) return place;

        const photoRes = await axios.get(
          `https://places.googleapis.com/v1/${photo.name}/media?key=${API_KEY}&maxHeightPx=${photo.heightPx}&maxWidthPx=${photo.widthPx}&skipHttpRedirect=true`,
        );

        return { ...place, photo: photoRes.data.photoUri };
      }),
    );

    return res.send(places);
  } catch (err) {
    return next(err);
  }
});

interface Board {
  index: number;
  value: "Player" | "Bot" | "";
}

jenosizeRoute.post("/xo", async (req, res, next) => {
  const board = req.body.board as Board[];

  try {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    if (!board.find((item) => item.value === "")) return res.json(board);

    const random = (max: number) => Math.floor(Math.random() * (max - 0.01));

    const nextMove = () => {
      const winingFlag = winConditions.map((winCondition) => {
        const indexes = winCondition.map((a) => board[a].value || a);
        const playerFlag = indexes.filter((y) => y === "Player").length === 2;
        const botFlag = indexes.filter((y) => y === "Bot").length === 2;
        return { indexes, playerFlag, botFlag };
      });

      // Bot about to win
      const botWinFlagged = winingFlag.filter(
        (item) => item.botFlag && item.indexes.some((index) => Number.isFinite(index)),
      );
      if (botWinFlagged.length !== 0) {
        const index = random(botWinFlagged.length);
        return botWinFlagged[index].indexes.find((item) => Number.isFinite(item)) as number;
      }

      // Player about to win
      const playerWinFlagged = winingFlag.filter(
        (item) => item.playerFlag && item.indexes.some((index) => Number.isFinite(index)),
      );
      if (playerWinFlagged.length !== 0) {
        const index = random(playerWinFlagged.length);
        return playerWinFlagged[index].indexes.find((yy) => Number.isFinite(yy)) as number;
      }

      // None about to win
      const availableMove = board.filter((item) => item.value === "");
      const index = Math.floor(Math.random() * (availableMove.length - 0.01));
      return availableMove[index].index;
    };

    const index = nextMove();
    board[index] = { ...board[index], value: "Bot" } as Board;
    return res.send(board);
  } catch (err) {
    return next(err);
  }
});

export default jenosizeRoute;
