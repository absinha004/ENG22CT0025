const express = require("express");
const axios = require("axios");

const app = express();
const windowsize = 10;
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MjA1MTc3LCJpYXQiOjE3NDcyMDQ4NzcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImEzYmZlOTkwLTliMDItNGRlMS05NTMzLTk3ZDgzYTk2YzEyNyIsInN1YiI6ImFic2luaGEwMDRAZ21haWwuY29tIn0sImVtYWlsIjoiYWJzaW5oYTAwNEBnbWFpbC5jb20iLCJuYW1lIjoiYWJoaW5hdiBzaW5oYSIsInJvbGxObyI6ImVuZzIyY3QwMDI1IiwiYWNjZXNzQ29kZSI6IkN2dFBjVSIsImNsaWVudElEIjoiYTNiZmU5OTAtOWIwMi00ZGUxLTk1MzMtOTdkODNhOTZjMTI3IiwiY2xpZW50U2VjcmV0IjoicmFxYnpQQmhhZUZIcFdaTiJ9.SzfOvBLUY9H1svBBiLDo7Ihx3rW_vyxRDzjzsRO7kmc";
let nums = [];

async function fetch(number) {
  let api = "";
  switch (number) {
    case "p":
      api = "http://20.244.56.144/evaluation-service/primes";
      break;
    case "f":
      api = "http://20.244.56.144/evaluation-service/fibo";
      break;
    case "e":
      api = "http://20.244.56.144/evaluation-service/even";
      break;
    case "r":
      api = "http://20.244.56.144/evaluation-service/rand";
      break;
    default:
      return [];
  }
  try {
    const response = await axios.get(api, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.numbers;
  } catch (e) {
    console.error("Error!!!");
    return [];
  }
}

function Avg(num) {
  if (num.length === 0) {
    return 0;
  }
  let sum = 0;
  for (i = 0; i < num.length; i++) {
    sum = sum + num[i];
  }
  return parseFloat((sum / num.length).toFixed(2));
}

app.get("/numbers/:numId", async (req, res) => {
  const { numId } = req.params;
  const possible = ["p", "f", "e", "r"];

  if (!possible.includes(numId)) {
    return res.status(400).json({ error: "Invalid!" });
  }

  const prev = [...nums];

  const numbers = await fetch(numId);

  if (numbers.length > 0) {
    numbers.forEach((num) => {
      if (!nums.includes(num)) {
        if (nums.length < windowsize) {
          nums.push(num);
        } else {
          nums.shift();
          nums.push(num);
        }
      }
    });
  }
  const curr = [...nums];
  const avg = Avg(nums);

  res.json({
    windowPrevState: prev,
    windowCurrState: curr,
    numbers: numbers,
    avg: avg,
  });
});
app.listen(3000, () => {
  console.log("Listening on 3000");
});
