MONGO_DATABASE="umbala"
APP_NAME="webapp"

MONGO_HOST="127.0.0.1"
MONGO_PORT="27017"
TIMESTAMP=`date +%F-%H%M`
MONGODUMP_PATH="/usr/bin/mongodump"
BACKUPS_DIR="/backup/mongo/$APP_NAME"
BACKUP_NAME="$APP_NAME-$TIMESTAMP"


if [ "$1" != "" ] && [ "$2" != "" ] && [ "$3" != "" ]
then
	$MONGODUMP_PATH --username $1 --password $2 --authenticationDatabase admin  -d $3

	mkdir -p $BACKUPS_DIR
	mv dump $BACKUP_NAME
	tar -zcvf $BACKUPS_DIR/$BACKUP_NAME.tgz $BACKUP_NAME
	rm -rf $BACKUP_NAME
	echo "Backup db successfully."
	echo "File: $BACKUPS_DIR/$BACKUP_NAME.tgz"
else
	echo "Please enter username, password and db name!"
fi
