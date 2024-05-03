# build
docker build -t chat-bot-mysql .
# run
docker run --name chat-bot-mysql -p 3306:3306 -d chat-bot-mysql