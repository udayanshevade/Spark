echo "Installing dependencies"
cd /vagrant
npm install

echo "Setting up frontend..."
cd /vagrant/spark/client

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Killing FE"
    lsof -P | grep ':3000' | awk '{print $2}' | xargs kill -9 &> /dev/null
fi

echo "Installing frontend dependencies..."
npm install

echo "Setting up backend..."
cd /vagrant/spark

if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "Killing BE"
    lsof -P | grep ':5001' | awk '{print $2}' | xargs kill -9 &> /dev/null
fi

echo "Installing frontend dependencies..."
npm install

echo "Serving project..."
cd /vagrant/spark
npm run dev