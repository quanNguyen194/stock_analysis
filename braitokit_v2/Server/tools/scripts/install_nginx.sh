echo "=========================================="
echo "Installing Nginx..."
sudo yum -y install epel-release > /dev/null
sudo yum -y install nginx > /dev/null
sudo systemctl start nginx > /dev/null
sudo systemctl enable nginx > /dev/null

echo "Server root: /usr/share/nginx/html"
echo "Config folder: /etc/nginx/conf.d"
echo "Config file: /etc/nginx/nginx.conf"

echo "Install services successfully!"
