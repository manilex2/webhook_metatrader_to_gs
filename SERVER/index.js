require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

const PUERTO = 80;
const app = express();

const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
});

app.use(bodyParser.json());

app.post('/',async (req, res) => {
  const client = await auth.getClient();
  const googleSheet = google.sheets({ version: 'v4', auth: client });
  
  let params = req.body;
  
  // Obtención de parametros
  let id_bot = params.id;
  let ticket = params.ticket;
  let date = params.date;
  let type = params.type;
  let size = params.size;
  let price = params.price;
  let stopLoss = params.stop_loss;
  let takeprofit = params.take_profit;
  let profit = "";
  let balance = "";
  
  if(params.hasOwnProperty('profit')){
    profit = params.profit;
    balance = params.balance;
  }

  let datos = [];
  datos.push([ticket,date,type,size,price,stopLoss,takeprofit,profit,balance,id_bot]);

  await googleSheet.spreadsheets.values.append({
    /*auth: auth,*/
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: process.env.ID_HOJA_RANGO,
    valueInputOption: "USER_ENTERED",
    requestBody: {
        "range": process.env.ID_HOJA_RANGO,
        "values": datos
    }
  });
  res.send("Datos agregados correctamente.");

});

app.listen(process.env.PORT || PUERTO, () => {
  console.log(`Escuchando en puerto ${process.env.PORT || PUERTO}`);
});