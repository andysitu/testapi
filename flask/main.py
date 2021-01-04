from flask import Flask, g
import sqlite3
import requests

DATABASE = "database.db"

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

app = Flask(__name__)

# Create Table People
with app.app_context():
    query_db("""CREATE TABLE IF NOT EXISTS 
        people (name_first TEXT, name_last TEXT, name_title TEXT, 
                email TEXT, phone TEXT)""")

@app.route('/read_people')
def get_people_data():
    r = requests.get("https://randomuser.me/api?results=1000")
    results = r.json()['results']
    for result in results:
        query_db( \
            "INSERT INTO people (name_first, name_last, name_title,  \
                email, phone) VALUES (?,?,?,?,?)", \
            (result["name"]["first"], result["name"]["last"], result["name"]["title"], \
                result["email"], result["phone"]))
    return "OK"

@app.route('/')
def hello_world():
    return "Hello World!"

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

if __name__ == "__main__":
    app.run(host="localhost", port=8080, debug=True)