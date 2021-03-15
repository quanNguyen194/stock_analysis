echo "=========================================="
echo "Installing MongoDB..."

# create repo file
if [ ! -f /etc/yum.repos.d/mongodb-org-4.4.repo ]; then
cat <<EOF >/etc/yum.repos.d/mongodb-org-4.4.repo
[mongodb-org-4.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/4.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
EOF
fi

# run install
sudo yum repolist > /dev/null
sudo yum -y install mongodb-org

echo "Install success, checking status..."
mongod --version
echo "Setting auto startup..."

# config mongodb
if [ ! -f /etc/security/limits.d/99-mongodb-nproc.conf ]; then
cat <<EOF >/etc/security/limits.d/99-mongodb-nproc.conf
mongod soft nofile 64000
mongod hard nofile 64000
mongod soft nproc 64000
mongod hard nproc 64000
EOF
fi

echo "MongoDB config: /etc/security/limits.d/99-mongodb-nproc.conf"

# start service
sudo systemctl start mongod > /dev/null
sudo systemctl enable mongod > /dev/null

read -p "Do you want to create a admin user? " yn

if [[ $yn == "Y" || $yn == "y" ]]; then
read -p "Enter username: " username
password=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1)

mongo <<EOF
use admin
db.createUser({user: "${username}", pwd: "${password}", roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]})
exit
EOF

echo "Created monogo user: user=${username}, pwd: ${password}"
fi
