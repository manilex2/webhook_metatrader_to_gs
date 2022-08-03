const express = require('express');
const PUERTO = 4300;
const app = express();
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
});

app.post('/', async (req, res) => {
  const client = await auth.getClient();
  const googleSheet = google.sheets({ version: 'v4', auth: client });
  let datos = [];
  datos.push(["fila1"]);
  await googleSheet.spreadsheets.values.append({
    /*auth: auth,*/
    spreadsheetId: "",
    range: "A:A",
    valueInputOption: "USER_ENTERED",
    requestBody: {
        "range": "A:A",
        "values": datos
    }
  });
  //console.log('Datos agregados correctamente.');
  res.send("Datos agregados correctamente.");

});

app.listen(process.env.PORT || PUERTO, () => {
  console.log(`Escuchando en puerto ${process.env.PORT || PUERTO}`);
});