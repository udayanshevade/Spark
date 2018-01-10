echo "Setting up backend..."
cd /vagrant/

if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "Killing BE"
    lsof -P | grep ':5001' | awk '{print $2}' | xargs kill -9 &> /dev/null
fi

echo "Installing backend dependencies..."
npm install

echo "Starting backend server..."
npm run server