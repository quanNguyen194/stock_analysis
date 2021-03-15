echo "Installing NodeJS..."
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash - > /dev/null
sudo yum -y install nodejs

echo "Install NodeJS successfully! Checking status.........."
node -v
