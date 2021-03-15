# using for CentOS 7

#########################################################################
# INSTALL NodeJS                                                       #
#########################################################################

if [ ! -d logs ]; then
    mkdir "logs"
fi


echo "Update system..."
sudo yum -y update > /dev/null

#########################################################################
# INSTALL NODEJS                                                        #
#########################################################################

read -p "Do you want to install NodeJS? " yn
if [[ $yn == "Y" || $yn == "y" ]]; then
  sudo chmod +x ./scripts/install_nodejs.sh
  ./scripts/install_nodejs.sh
fi

#########################################################################
# INSTALL MONGODB                                                       #
#########################################################################

read -p "Do you want to install MongoDB? " yn
if [[ $yn == "Y" || $yn == "y" ]]; then
  sudo chmod +x ./scripts/install_mongodb.sh
  ./scripts/install_mongodb.sh
fi


#########################################################################
# INSTALL NGINX                                                         #
#########################################################################
read -p "Do you want to install Nginx Server? " yn

if [[ $yn == "Y" || $yn == "y" ]]; then
  sudo chmod +x ./scripts/install_nginx.sh
  ./scripts/install_nginx.sh
fi



