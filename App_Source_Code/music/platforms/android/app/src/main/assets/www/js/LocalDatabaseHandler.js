var LocalDatabaseHandler = {
	db: null,
	open: function(options) {
		if(options == null)
			this.db = openDatabase('user', '1.0', 'Test DB', 2 * 1024 * 1024);
		else
			this.db = openDatabase(options.databaseName, options.version, options.description, options.size);
	},
	createTable: function(options) {
		this.db.transaction(function (tx) {  
			if(options == null)
				tx.executeSql('CREATE TABLE IF NOT EXISTS UserInfo(key unique, value)', [],
				null,
				function(){
					console.log("createTable(): table create error");
				});
			else
				tx.executeSql('CREATE TABLE IF NOT EXISTS ' + options.tableName + '(key unique, value)');
		});
	},
	insert: function(key, value, callback, update) {
		if(this.db == null) {
			this.open();
			this.createTable();
		}
		var self = this;
		this.db.transaction(function (tx) {
			var insertErrorFunction = function(t, error) { MessageHandler.showError('Sorry, there was an error inserting your data to the database. Error: ' + error.message);};
			var selectErrorFunction = function(t, error) { MessageHandler.showError('Sorry, there was an error getting your data from the database. Error: ' + error.message);};
			// check if record exists
			tx.executeSql('SELECT * FROM UserInfo WHERE key = ?', [key], 
				function(tx, results) {
					var len = results.rows.length;
					if(len == 0) {
						// insert
						tx.executeSql('INSERT INTO UserInfo(key, value) VALUES (?, ?)', [key, value], callback, insertErrorFunction); 
					} else if(update != null && update) {
						self.update(key, value, callback);
					}
				}, selectErrorFunction);
		});
	},
	update: function(key, value, callback) {
		console.log("local storage update started");
		if(this.db == null) {
			this.open();
			this.createTable();
		}
		//this.open();
		//this.createTable();
		this.db.transaction(function (tx) {
			console.log("db transaction started");
			console.log({"key": key, "value": value});
			//console.log({key: key, value: value.replace('"', "'").replace('\"', "\'")});
			//tx.executeSql("INSERT INTO UserInfo(key, value) VALUES('currentTheme', 'water')", [], null, function(t, error){console.log("insert error !!!", error.message);});
			tx.executeSql("UPDATE UserInfo SET value=? WHERE key=?", [value, key], callback, function(t, error){
				console.log("update error: ", error.message);
			});
		});
	},
	get: function(key, callback, errorFunction) {
		if(this.db == null) {
			this.open();
			this.createTable();
		}
		this.db.transaction(function (tx) {   
			tx.executeSql('SELECT * FROM UserInfo WHERE key=?', [key], 
				function(tx, results) {
					callback(results);
				}, (errorFunction == null) ? 
					(function(tx, error) {
						MessageHandler.showError("There was an error reading from local database: " + error.message);
					}) : 
					errorFunction
				);
		});
	},
	getMultiple: function(keys, callback) {
		// prepare query
		var query = 'SELECT value FROM UserInfo WHERE key IN(';
		var marks = [];
		for(var i = 0; i < keys.length; i++) {
			marks.push("?");
		}
		query += marks.join(",") + ")";
		values = [];
		if(this.db == null) {
			this.open();
			this.createTable();
		}
		this.db.transaction(function (tx) {   
			tx.executeSql(query, [key], 
				function(tx, results) {
					callback(results);
				}, (errorFunction == null) ? 
					(function(tx, error) {
						MessageHandler.showError("There was an error reading from local database: " + error.message);
					}) : 
					errorFunction
				);
		});
	},
	remove: function(key, callback) {
		if(this.db == null) {
			this.open();
			this.createTable();
		}
		this.db.transaction(function (tx) {   
			tx.executeSql('DELETE FROM UserInfo WHERE key=?', [key], 
			function(tx, results) {
				callback(results);
			}, function(tx, error) {
				MessageHandler.showError("There was an error reading from local database: " + error.message);
			});
		});
	}
}