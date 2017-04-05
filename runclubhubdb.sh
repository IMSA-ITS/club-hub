docker run --name clubhubdb -e POSTGRES_PASSWORD=testing123 -e POSTGRES_USER=clubhub -e POSTGRES_DB=clubhubdb -v $(pwd)/backup:/opt/backup -d postgres:9.6
