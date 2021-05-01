from flask import Flask

app= Flask(__name__)
@app.route('/flask',methods=['GET'])
def index():
     return 'Flask Server'

@app.route('/predict',method=['GET','POST'])
def my_function():
    if request.method == "POST":
        data = {}    #empty dict to store data
        data['title'] = request.json['title']
        data['release_date'] = request.json['movie_release_date']

       #do whatever you want with the data here e.g look up in database or something
       # if you want to print to console

        print(data, file=sys.stderr)

        #then return something back to frontend on success

        # this returns back received data and you should see it in browser console
        # because of the console.log() in the script.
        return jsonify(data)
# @app.route('/predict',methods=['GET','POST'])
# def predict():
#     '''
#     For rendering results on HTML GUI
#     '''
#     sent = request.form['Comment']
#     new_corpus=[]
#     sent = re.sub('[^a-zA-Z]',' ',sent)
#     sent = sent.lower()
#     sent = sent.split()
#     sent = [ps.stem(word) for word in sent if not word in stopwords.words('english')]
#     sent = ' '.join(sent)
#     new_corpus.append(sent)
#     tf1_new = TfidfVectorizer(vocabulary = tf1.vocabulary_)
#     X_tf1 = tf1_new.fit_transform(new_corpus)
#     x_new=X_tf1.toarray()
#     prediction = model.predict(x_new)
#     if prediction[0] == 1:
#         return render_template('index.html', prediction_text='Statement is Positive ')
#     else:
#         return render_template('index.html', prediction_text='Statement is Negative ')

if __name__=="__main__":
    app.run(port=5500, debug=True)

