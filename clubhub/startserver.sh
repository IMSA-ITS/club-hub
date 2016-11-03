chown -R www-data:www-data /opt/media
python3 manage.py makemigrations main
python3 manage.py makemigrations
python3 manage.py migrate
echo "yes" | python3 manage.py collectstatic

tail -f /var/log/apache2/* &
apachectl -DFOREGROUND
