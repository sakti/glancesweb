from flask import Flask
from flask import Response
from xmlrpclib import ServerProxy


app = Flask(__name__)
SERVER_HOST = "localhost"
SERVER_PORT = "61209"


@app.route("/")
def dashboard():
    return "Monitoring Dashboard"


@app.route("/status.json")
def get_status():
    server = ServerProxy("http://%s:%s" % (SERVER_HOST, SERVER_PORT))
    data = server.getAll()
    return Response(data, mimetype="application/json")

if __name__ == "__main__":
    app.run(debug=True)
