echo on
docker version > nul
if %errorlevel% == 1 echo "Docker n'est pas installé ou n'est pas démarré" & exit /b 1

docker pull cassandra:latest > nul
if %errorlevel% == 0 echo "Installation de la base de données terminées"

docker network create cassandra
docker run --rm -d -p 9042:9042 --name cassandra --hostname cassandra --network cassandra cassandra

docker run --rm --network cassandra -v "./data.cql:/scripts/data.cql" -e CQLSH_HOST=cassandra -e CQLSH_PORT=9042 nuvo/docker-cqlsh
::docker run --rm -it --network cassandra nuvo/docker-cqlsh cqlsh cassandra 9042 --cqlversion='3.4.5'
cmd /k