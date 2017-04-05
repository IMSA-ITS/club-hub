docker build -t clubhub .
docker rm -f clubhub
docker run -d --name clubhub -v $(pwd)/media:/opt/media --link clubhubdb:postgres --publish 7080:80 clubhub
docker inspect clubhub
