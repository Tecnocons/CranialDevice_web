from flask import Flask, request
import logging

app = Flask(__name__)

# Configurazione del logger
logging.basicConfig(filename='app.log', level=logging.INFO)

@app.route('/')
def hello_world():
    app.logger.info('Azione: accesso alla pagina principale')
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
