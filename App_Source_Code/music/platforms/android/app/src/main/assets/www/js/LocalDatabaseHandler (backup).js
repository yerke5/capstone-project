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
				function(){
					console.log("table create success");
				},
				function(){
					console.log("table create error");
				});
			else
				tx.executeSql('CREATE TABLE IF NOT EXISTS ' + options.tableName + '(key unique, value)');
		});
	},
	insert: function(key, value, callback) {
		if(this.db == null) {
			this.open();
			this.createTable();
		}
		this.db.transaction(function (tx) {   
			if(callback == null) {
				tx.executeSql('INSERT INTO UserInfo(key, value) VALUES (?, ?)', [key, value]);
			} else {
				tx.executeSql('INSERT INTO UserInfo(key, value) VALUES (?, ?)', [key, value], function(tx, results) {
					callback(results);
				}, function(t, error) {
					console.log("local db insert error", error.message);
				}); 
			}
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
	get: function(key, callback) {
		if(this.db == null) {
			this.open();
			this.createTable();
		}
		this.db.transaction(function (tx) {   
			tx.executeSql('SELECT * FROM UserInfo WHERE key=?', [key], function(tx, results) {
				callback(results);
			}, function(t, error) {
				console.log("local db get error", error.message);
			});
		});
	}
}