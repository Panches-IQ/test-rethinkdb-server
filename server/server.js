const http = require("http");
const db = require("./database");

let count = 0;

const port = 1337;

const server = http.createServer((req, res) => {
	if (!db.get()) return;

	const table = "testtable";

	db.insert(
		{creationDate: (new Date).valueOf()},
		table
		)
		.then(() => {
			console.log("New field added succesfully...");
			db.count(table)
				.then(result => {
					count = result;
					res.write("rethinkdb test: " + count);
					res.end();
				});
		});	
});

const subscribeToChanges = (table) => {
	db.subscribeToChanges(table)
		.then(cursor => {
			cursor.each((err, row) => {
				if (err)
					console.log(err.message);
				console.log(row);
			});
		})
		.catch(err => {
			console.log(err.message);
		});
}

db.connect()
	.then(() => {
		console.log("Connected to db succesfully...");
		subscribeToChanges("testtable");

		server.listen(port, () => {
			console.log("Server is up running on port 1337...");
		});
	})
	.catch(err => {
		console.log(err.message);
	});
