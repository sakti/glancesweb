from flask import Flask


app = Flask(__name__)


@app.route("/")
def dashboard():
    return "Monitoring Dashboard"


if __name__ == "__main__":
    app.run()
