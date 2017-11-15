# install environment dependencies
apt-get -qqy update
apt-get -qqy install postgresql curl git
# setup database
su postgres -c "psql -c \"CREATE ROLE vagrant WITH CREATEDB LOGIN PASSWORD 'password';\""
su vagrant -c "createdb spark"
su vagrant -c "psql spark -f /vagrant/spark/spark.sql"
# add helper aliases for project commands
cat "/vagrant/.profile" >> "/home/vagrant/.profile"

# solves potential windows compatibility issue appending `\r` line ends
sudo apt-get install -y dos2unix
sudo dos2unix /home/vagrant/.profile
sudo dos2unix /vagrant/server.sh
sudo dos2unix /vagrant/client.sh