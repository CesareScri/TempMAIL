import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/api/new", async (req, res) => {
  try {
    const user = await getRandomUser();
    const emailID = `${user}@labworld.org`;
    const request = await fetch(
      `https://embedded.cryptogmail.com/api/emails?inbox=${emailID}`
    );

    if (request.status === 404) {
      // Email created successfully
      res.json({
        success: true,
        message: "Email created successfully",
        emailID,
        isNew: true,
      });
    } else if (request.status === 200) {
      try {
        // A new message has arrived, so we expect the body to be JSON
        const data = await request.json();
        res.json(data);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        res.status(500).send("Failed to parse response");
      }
    } else {
      // Handle other status codes or unexpected behaviors here if necessary
      console.error("Unexpected response status:", request.status);
      res.status(500).send("Unexpected response from email service");
    }
  } catch (error) {
    console.error("Error: something went wrong!", error);
    res.status(500).send("Internal Server Error");
  }
});

function getRandomUser() {
  const names = [
    "Alex",
    "Bobby",
    "Charlie",
    "Dani",
    "Eve",
    "Frankie",
    "Grace",
    "Haley",
    "Izzy",
    "Jack",
  ];

  const randomNumber = Math.floor(Math.random() * 1000);

  const randomName = names[Math.floor(Math.random() * names.length)];

  return `${randomName}${randomNumber}`;
}

app.get("/api/inbox=:id", async (req, res) => {
  const emailID = req.params.id;
  try {
    const request = await fetch(
      `https://embedded.cryptogmail.com/api/emails?inbox=${emailID}`
    );
    const response = await request.json();

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ msg: `No message.`, email: emailID, success: true });
  }
});

app.get("/api/body=:id", async (req, res) => {
  const body = req.params.id;
  try {
    const request = await fetch(
      `https://embedded.cryptogmail.com/api/emails/${body}`,
      {
        headers: {
          Accept: "text/html,text/plain",
        },
      }
    );
    const response = await request.text();
    res
      .json({ success: true, msg: "Message received.", data: response })
      .status(200);
  } catch (error) {
    console.log(error);
    res
      .json({ success: false, msg: "Faild to parse data.", data: error })
      .status(400);
  }
});

app.get("/api/user=:id", async (req, res) => {
  const body = req.params.id;
  try {
    const request = await fetch(
      `https://embedded.cryptogmail.com/api/emails/${body}`,
      {
        headers: {
          Accept: "*/*",
        },
      }
    );
    const response = await request.json();
    res
      .json({ success: true, msg: "Message received.", data: response })
      .status(200);
  } catch (error) {
    console.log(error);
    res
      .json({ success: false, msg: "Faild to parse data.", data: error })
      .status(400);
  }
});
