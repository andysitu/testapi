from flask import Flask, g, current_app, jsonify, request
import sqlite3
import requests

DATABASE = "database.db"

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def query_db(query, args=(), one=False):
    db = get_db()
    cur = db.cursor()
    cur.execute(query, args)
    db.commit()
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

app = Flask(__name__)

# Create Table People
with app.app_context():
    # query_db("DROP TABLE IF EXISTS people")                                                                                                                                               
    sql = "CREATE TABLE IF NOT EXISTS people (people_id INTEGER PRIMARY KEY, name_first VARCHAR(255), name_last VARCHAR(255), name_title VARCHAR(255), email VARCHAR(255), phone VARCHAR(255))"
    query_db(sql)

@app.route('/read_people')
def get_people_data():
    r = query_db("select count(*) from people")
    if r and r[0] and r[0][0] > 1000:
        return "Already have 1000"
    else:
        r = requests.get("https://randomuser.me/api?results=1000")
        results = r.json()['results']
        sql = "INSERT INTO people (name_first,name_last,name_title,email,phone) VALUES (?,?,?,?,?)"
        for result in results:
            arg = (result["name"]["first"], result["name"]["last"], result["name"]["title"], result["email"], result["phone"])
            query_db(sql, arg)
        return "OK"

@app.route('/view_people')
def view_people():
    return current_app.send_static_file("view/view_people.html")

@app.route('/get_people')
def get_people():
    result = query_db("""SELECT 
        people_id, name_first,name_last,name_title,email,phone
        FROM people LIMIT 100""")
    for i in range(len(result)):
        result[i] = {
            "people_id": result[i][0],
            "name_first": result[i][1],
            "name_last": result[i][2],
            "name_title": result[i][3],
            "email": result[i][4],
            "phone": result[i][5],
        }
    return jsonify(result)

@app.route('/people/<people_id>', methods=['PATCH'])
def people(people_id):
    print(people_id)
    if request.method == "PATCH":
        if not request.json:
            return "Missing JSON"
        body = request.json
        if body["property"] == 'phone' and body['value']:
            query_db("UPDATE people SET phone=(?) WHERE people_id=(?)", (body['value'],people_id))
        elif body["property"] == 'email' and body['value']:
            query_db("UPDATE people SET email=(?) WHERE people_id=(?)", (body['value'],people_id))
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