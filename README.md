# Proxier
ManageShellinaboxdRedirection

following softwares are needed: mongodb, nodejs, forever (This can be install via npm. It's a program to 
run the service and keep the service running)

In mongodb a database named "proxies" will be created.

    cd /path/to/project/root/
    forever start ./bin/www
    # forever start ./bin/www-cluster if multiple instances are needed

Details can be found here https://www.npmjs.com/package/forever
