import axios from "axios";
import express from "express";

const app = express();

app.get("/:placeName", async (req, res, next) => {
  const { placeName } = req.params;

  try {
    const resp = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      { textQuery: placeName },
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
  app.listen(3000);
  // eslint-disable-next-line no-console
  console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
};

run();
