from flask import Flask
from flask import Response
from flask import render_template
from flask import session
from flask import redirect
from flask import url_for
from flask import request
from flask import abort
from xmlrpclib import ServerProxy
import socket


app = Flask(__name__)
app.secret_key = "development key"


@app.route("/")
def dashboard():
    if "glances_server" not in session:
        return redirect(url_for("setting"))
    return render_template("dashboard.html")


@app.route("/setting", methods=["GET", "POST"])
def setting():
    if request.method == "POST":
        server = request.form["server"]
        port = request.form["port"]
        session["glances_server"] = "%s:%s" % (server, port)
        return redirect(url_for("dashboard"))
    return render_template("setting.html")


@app.route("/status.json")
def get_status():
    if "glances_server" not in session:
        abort(401)
    server = ServerProxy("http://%s" % session.get("glances_server"))
    try:
        data = server.getAll()
    except socket.error:
        data = ''
    return Response(data, mimetype="application/json")

if __name__ == "__main__":
    app.run(debug=True)
