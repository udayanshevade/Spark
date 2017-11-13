# install environment dependencies
apt-get -qqy update
apt-get -qqy install postgresql curl git
# setup database
su postgres -c "createuser -dRS vagrant"
su vagrant -c "createdb spark"
su vagrant -c "psql spark -f /vagrant/spark/spark.sql"
# add helper aliases for project commands
cat "/vagrant/.profile" >> "/home/vagrant/.profile"

# solves potential windows compatibility issue appending `\r` line ends
sudo apt-get install -y dos2unix
sudo dos2unix /home/vagrant/.bash_profile
sudo dos2unix /vagrant/dev.sh