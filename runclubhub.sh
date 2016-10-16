docker build -t clubhub .
docker rm -f clubhub
docker run -d --name clubhub -v $(pwd)/media:/opt/media --link clubhubdb:postgres clubhub
docker inspect clubhub