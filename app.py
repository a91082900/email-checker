from flask import Flask, send_file, render_template, request
from uuid import uuid4
from collections import defaultdict
from pywebpush import webpush, WebPushException
from json import loads, dumps
import threading

subscriptions = []
def send_notification(uuid):
    for sub_info in subscriptions:
        try:
            data = {
                'title': 'Your Email Has Been Read',
                'body': f'id {uuid} has been read {check_list[uuid]} times',
            }
            webpush(subscription_info=sub_info, data=dumps(data),
                    vapid_private_key='Y-IR1LpDkQpzAwloK6432rCXdobSvgB7FiVB63koq-U',
                    vapid_claims={"sub": "mailto: <test@example.com>"})
        except WebPushException as ex:
            print('Error: ', ex)

app = Flask(__name__)
check_list = defaultdict(int)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/image/<id>')
def image(id):
    print('id:', id)
    if id not in check_list:
        print('id not found')
    check_list[id] += 1
    # print('check_list:', check_list)
    # send notification to admin
    threading.Thread(target=send_notification, args=(id,)).start()
    return send_file('static/image.png', mimetype='image/png')

@app.route('/register')
def register():
    uuid = str(uuid4())
    print('uuid:', uuid)
    check_list[uuid] = 0
    # alternative name required for user
    return uuid

@app.route('/view')
def view():
    return render_template('view.html', check_list=check_list)

@app.route('/subscribe', methods=['POST'])
def subscribe():
    global subscription_info
    sub_info = request.json
    print('sub_info:', sub_info)
    if sub_info not in subscriptions:
        subscriptions.append(sub_info)
    return 'subscribed'
    
if __name__ == '__main__':
    app.run()