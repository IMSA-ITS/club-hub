Club Hub
================

*For a working example of what Club Hub can do, check out* [clubhub.live](https://clubhub.live "Club Hub") *and* [clubhub.live/present](https://clubhub.live/present "Club Hub LIVE").

See what's next in one glance: Club Hub is a framework that automatically displays event and poster information cleanly and intuitively. It is designed for schools and other organizations with mass comminications needs.
Along with its online event listing, it also features an automated slideshow solution for use on digital displays across campus. This is a 
website that can be displayed via computers connected to these monitors, or through Google Chromcasts.

Club Hub is run as a django application, which means that it's easy to deploy on your own server for your organization's needs! With django's database 
management features, sorting and approving posters for display on Club Hub is a breeze. Read on below to learn more.

Download
----------------

Use `git` to pull from this repository:

`git clone https://github.com/geosir/clubhub`

Organization
----------------

The cloned directory contains the following:

1. Scripts to help setup Club Hub's application and database containers.
2. A Dockerfile used by the scripts to spawn the Club Hub container.
3. `clubhub.conf`, an Apache configuration file used by the Dockerfile.
4. The Club Hub source code needed to build the site.

Install
----------------

Installing the backend:

1. Begin by configuring `clubhub/clubhub/settings.py` to suit your needs. Make sure to generate a new `SECRET_KEY` and to change `ALLOWED_HOSTS` to your domain name(s). Update your `DATABASES` information to suit your application. Finally, uptade your `SENDGRID_API_KEY` to match your account. *Note that you need to have a valid SendGrid key in order for Club Hub to work.*
2. Update the information in `runclubhubdb.sh` to match the database user, name, and password you specified in `settings.py`.
3. Run `runclubhubdb.sh` AND THEN run `runclubhub.sh`. Let them work their magic :)
4. You need to create an adminstrator account to begin administering Club Hub. Do `docker exec -it clubhub /bin/bash`. Once you're in the container shell, run `python3 manage.py createsuperuser`.
5. While you're still in the container shell, fix permissions for `/opt/media` by running `chmod -R www-data:www-data /opt/media`. This seems to be a bug that should be fixed soon.

Now Club Hub is set up! All you need to do now is point your webserver to Club Hub's Docker IP (which can be seen with `docker inspect clubhub | grep IPAddress`). I use nginx in my own deployment (my sample configuration with CloudFlare and LetsEncrypt can be seen in `clubhub_nginx.conf`), but you can use any setup you'd like as long as you proxy pass to the Club Hub container.

You'll also see several new folders around: `backup` and `media`. These folders allow you to save vital clubhub assets. The Club Hub database will be backed up and stored in `backup` on a weekly basis, and all posters uploaded to Club Hub will be stored in `media`.

Using and Administering Club Hub
----------------

*To see a working deployment of Club Hub, check out* [clubhub.live](https://clubhub.live "IMSA Club Hub").

Now that Club Hub is set up, you can navigate its pages on the web! The homepage is a summary of upcoming events, featuring the event date, poster, event name, event host, description, time, and location. Each of these columns (except for the poster) are sortable, and each of the fields in the table (except for poster and description) are filterable. Try it out by clicking on the table headers and cells!

Club Hub users submit new posters at the `/submit` page. This is accessible directly, as well as through the "Register an Event" button on the bottom of the page. Submitting an event is as easy as completing the online form and uploading a poster. These submissions are aggregated in the adminstration panel, Club Hub Central.

Club Hub Central can be accessed at the `/admin` URL. You can log in with the superuser credentials you created during installation; after logging in, you can create more users with different passwords and privileges.

Administering events is easy. First, enter the event view by clicking on the "Events" link in the administration panel. Then, simply select the events you want to approve for display and choose "Approve selected events" in the Actions dropdown and hit "Go". You can also modify individual events by clicking on their name.

To deploy Club Hub on digital displays, you can direct the displays to show the `/present` page. If your organization supports Chromecasts (your school or enterprise network may require special configuration), you can also use `/present/cast` to cast to the Chromecasts.

*As of October 16, 2016, there seems to be a memory leak bug affecting the chromecast firmware during extended media-heavy casts. I have written a dirty workaround for this by programmatically moving the mouse to recast the app. This `clubhubassure.py` script will be included shortly.*

Attribution
----------------

The original idea and framework was formulated, designed, tested, and coded by [George Moe](https://george.moe "George's Website") over the span of nearly two years. Attribution would be very much appreciated.

This work is distributed under a GPLv3 license. See LICENSE for more details.

Contact and Support
----------------

If you have any questions or comments, or if you would like a flavor of Club Hub custom built for your use case, you can contact George Moe at [george@george.moe](mailto:george@george.moe "Email George Moe").
