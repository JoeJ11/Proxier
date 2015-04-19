ip=$1
port=$2
shellinaboxd -t -b -p $port --service=/:SSH:$ip
