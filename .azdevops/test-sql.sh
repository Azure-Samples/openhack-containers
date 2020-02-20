. ./.env.sh

sleep 20

docker exec sql1 /opt/mssql-tools/bin/sqlcmd -S localhost -U $OH_SQL_USER -P $OH_SQL_PASSWORD -Q "CREATE DATABASE mydrivingDB"

docker exec sql1 /opt/mssql-tools/bin/sqlcmd -S localhost -U $OH_SQL_USER -P $OH_SQL_PASSWORD -Q "select name from sys.databases; select name from sys.tables"
