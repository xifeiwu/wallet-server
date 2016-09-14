
if [ $# -gt 2 -o $# -lt 1 ]; then
    echo A Parameter is needed.
    exit 1
fi
action=$1

if ! which sqlite3 > /dev/null; then
    echo The program 'sqlite3' is currently not installed. You can install it by typing:
    echo sudo apt-get install sqlite3
    exit 2
fi

DBFILE=$PWD/db.sqlite3


function initdb(){
    if [ -e $DBFILE ]; then
        echo $DBFILE already exist. Please remove First.
        return 1
    fi
    local initSQL="BEGIN TRANSACTION;\
CREATE TABLE user (id INTEGER PRIMARY KEY, name TEXT, password TEXTs);\
INSERT INTO user VALUES(0, 'xifei', '123456');\
COMMIT;"
    echo $initSQL | sqlite3 $DBFILE
    if [ $? ]; then
        echo Init Sqlite DataBase $DBFILE Success.
    else
        echo Init Sqlite DataBase $DBFILE Fail.
    fi
}

case $action in
    "init")
    if ! initdb ; then
        exit 3
    fi
    ;;
    "remove")
    if [ -e $DBFILE ]; then
        rm -rf $DBFILE
        echo remove Sqlite DataBase $DBFILE Success.
    else
        echo Sqlite DataBase $DBFILE Does Not Exist.
    fi
    ;;
    *)
    echo Parameter is limited to init or remove
    exit 3
    ;;
esac
