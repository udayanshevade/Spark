echo "Installing dependencies and starting app..."
cd /vagrant/spark

if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "Killing BE"
    lsof -P | grep ':5001' | awk '{print $2}' | xargs kill -9 &> /dev/null
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Killing FE"
    lsof -P | grep ':3000' | awk '{print $2}' | xargs kill -9 &> /dev/null
fi

npm start