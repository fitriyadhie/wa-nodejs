const { Client } = require('whatsapp-web.js');

const client = new Client();

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();


const http = require('node:http');
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer(async (req, res) => {
	
	try {
		let requestBody = await collectRequestBody(req);
	
		// Parse the request body as JSON
		const requestData = JSON.parse(requestBody);
	
		// At this point, 'requestData' is an object representing the JSON data
		const { number, msg } = requestData;

		const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
		const final_number = `91${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India

		const number_details = await client.getNumberId(number); // get mobile number details

		if (number_details) {
		const sendMessageData = await client.sendMessage(number_details._serialized, msg); // send message
		} else {
		console.log(final_number, "Mobile number is not registered");
		}
	
		// Respond to the client
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end(`Received request body: Name - ${number}, Age - ${msg}`);
	  } catch (error) {
		console.error('Error:', error);
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.end('Bad Request');
	  }
	// const data = req.body;
	
	// console.log(req.body, "req.body");
  
	// const number = data.number;
	// const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
	// const final_number = `91${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India

	// const number_details = await client.getNumberId(final_number); // get mobile number details

	// if (number_details) {
	// 	const sendMessageData = await client.sendMessage(number_details._serialized, data.msg); // send message
	// } else {
	// 	console.log(final_number, "Mobile number is not registered");
	// }
	//   res.statusCode = 200;
	//   res.setHeader('Content-Type', 'text/plain');
	  
	//   res.end('Okee\n');
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Promisify the 'data' event to collect the request body
const collectRequestBody = (req) => new Promise((resolve, reject) => {
	let requestBody = '';
  
	req.on('data', chunk => {
	  requestBody += chunk.toString();
	});
  
	req.on('end', () => {
	  resolve(requestBody);
	});
  
	req.on('error', (error) => {
	  reject(error);
	});
  });