const r = require("rethinkdb");

const dbConfig = {
	host: "localhost",
	port: 28015
};

let connection = null;

const db = {
	
	connect: () => {
		return new Promise((resolve, reject) => {
			r.connect(dbConfig)
			.then(conn => {
				connection = conn;
				resolve();
			})
			.catch(err => {
				reject(err);
			});
		});			
	},

	insert: (data, table) => {
		table = table || "testtable";

		return r.table(table)
			.insert(data)
			.run(connection);
	},

	get: () => {
		return connection;
	},

	subscribeToChanges: (table) => {
		table = table || "testtable";
		return r.table(table).changes().run(connection);
	},

	count: (table) => {
		table = table || "testtable";
		return r.table(table).count().run(connection);
	}
};

module.exports = db;
