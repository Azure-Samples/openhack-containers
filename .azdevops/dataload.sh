. ./.env.sh

sleep 20

docker exec sql1 /opt/mssql-tools/bin/sqlcmd -S localhost -U $OH_SQL_USER -P $OH_SQL_PASSWORD -Q "CREATE DATABASE mydrivingDB"

docker run --rm --name dataload \
--network $OH_PROJECT_NAME \
-e "ACCEPT_EULA=Y" \
-e "SQLFQDN=$OH_SQL_SERVER" \
-e "SQLUSER=$OH_SQL_USER" \
-e "SQLPASS=$OH_SQL_PASSWORD" \
-e "SQLDB=$OH_SQL_DBNAME" \
openhack/data-load:v1

docker exec sql1 /opt/mssql-tools/bin/sqlcmd -S localhost -U $OH_SQL_USER -P $OH_SQL_PASSWORD -Q "select name from sys.databases; use mydrivingdb; select name from sys.tables"
