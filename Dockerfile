FROM ubuntu:16.04

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y python3-pip
RUN apt-get install -y apache2
RUN apt-get install -y libapache2-mod-wsgi-py3
RUN apt-get install -y postgresql postgresql-client libpq-dev

RUN rm -rf /etc/apache2/sites-enabled/*
ADD clubhub.conf /etc/apache2/sites-enabled/
ADD clubhub/ /opt/clubhub
VOLUME /opt/media

WORKDIR /opt/clubhub

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

CMD ["/bin/bash", "startserver.sh"]
