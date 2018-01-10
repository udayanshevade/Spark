echo "Setting up frontend..."
cd /vagrant/client

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Killing FE"
    lsof -P | grep ':3000' | awk '{print $2}' | xargs kill -9 &> /dev/null
fi

echo "Installing frontend dependencies..."
npm install

echo "Starting frontend..."
cd ..
npm run client