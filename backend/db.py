from flask_mysqldb import MySQL

mysql = MySQL()


def configure_db(app):
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = '1234'
    app.config['MYSQL_DB'] = 'weighthubdb'

    mysql.init_app(app)


