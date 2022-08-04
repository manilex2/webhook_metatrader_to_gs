require('dotenv').config();

const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
});

exports.handler = async (event) => {
  /*let forbiden = true;
  if(event.hasOwnProperty("queryStringParameters")){
    if(event.queryStringParameters.hasOwnProperty("api_key")){
      let api_key = event.queryStringParameters.api_key;
      if(api_key == process.env.API_KEY){
        forbiden = false;
      }
    }
  }

  if(forbiden){
    const res_error = {
      statusCode: 403,
      headers: {
          'Content-Type': 'application/json',
      },
      body: {"error": "API Key Invalida"}
    };
    return res_error;
  }*/

  const client = await auth.getClient();
  const googleSheet = google.sheets({ version: 'v4', auth: client });
  

  let queryParams = event.queryStringParameters;
  
  let params = JSON.parse(event.body);
  
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
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: process.env.ID_HOJA_RANGO,
    valueInputOption: "USER_ENTERED",
    requestBody: {
        "range": process.env.ID_HOJA_RANGO,
        "values": datos
    }
  });
    
  const response = {
      statusCode: 200,
      headers: {
          'Content-Type': 'text/plain',
      }
  };
  return response;
};