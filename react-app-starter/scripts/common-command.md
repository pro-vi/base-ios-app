lsof -i :8080-8089 | grep LISTEN
lsof -t -i :8080-8089 | xargs -r kill -9
