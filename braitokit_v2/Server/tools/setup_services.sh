sudo cp services/webapp.service /etc/systemd/system/webapp.service
systemctl enable webapp.service
systemctl start webapp.service

echo "Setup service completed!"
