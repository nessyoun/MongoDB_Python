from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import *
import json

app = Flask(__name__)


class Connexion:
    def __init__(self):
        conn = 'mongodb://localhost:27017/'
        client = MongoClient(conn)
        db = client.books
        self.collection = db.get_collection("books")
        self.collection1 = db.get_collection("client")
    
    def getCollection(self):
        return self.collection
    
    def getClientCollection(self):
        return self.collection1

class Operations:
    def __init__(self):
        self.collection = Connexion().getCollection()
        self.collection1 = Connexion().getClientCollection()
    
    def insertElement(self,document):
        self.collection.insert_one(document)
        return ("l'element est bien inseré")
    
    def findByCritere(self, filt):
        res = self.collection.find(filt,{'_id':1,'download_number':0,'isbn':0,'longDescription': 0, 'publishedDate': 0, 'thumbnailUrl': 0, 'shortDescription': 0})
        return res
    def findById(self,val):
        res = self.collection.find({"_id":val}).limit(1)
        return res
    
    def countClient(self):
        pipeline = [
            {'$group': {'_id': None, 'count': {'$sum': 1}}}
        ]
        result = list(self.collection1.aggregate(pipeline))
        return result
    
    def deleteElements(self, filt):
        result = self.collection.delete_many(filt)
        return result.deleted_count
    
    def countElements(self):
        pipeline = [
            {'$group': {'_id': None, 'count': {'$sum': 1}}}
        ]
        result = list(self.collection.aggregate(pipeline))
        return result
    
    def countDownloads(self):
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "totalDownloads": {"$sum": "$download_number"}
                }
            }
        ]
        result = list(self.collection.aggregate(pipeline))
    
        # Extract the totalDownloads from the result
        if result:
            total_downloads = result[0]["totalDownloads"]
        else:
            total_downloads = 0
    
        return total_downloads
    
    def top3(self):
        top6 = self.porcentageBooks()
        res = []
    
        for book in top6:
            document = self.collection.find_one(
                {"_id": book[0]},
                {'longDescription': 0, 'publishedDate': 0, 'thumbnailUrl': 0, 'shortDescription': 0}
            )
            if document:
                res.append(document)
    
        return res[:3]
    
    def insertMany(self, documents):
        self.collection.insert_many(documents)
        return "The elements have been successfully inserted"
    
    def porcentageBooks(self):
        total = self.countDownloads()
        books = self.collection.find({}, {"_id": 1, "title": 1, "download_number": 1})
        pcg = []
        
        for i in books:
            prcta = (i["download_number"] / total) * 10000  # calculate percentage
            pcg.append((i["_id"], i["title"], prcta))
    
        pcg.sort(key=lambda x: x[2], reverse=True)  # Sort by download_number (prcta)
    
        return pcg[:6]
    def updateElements(self,id,mod):
        self.collection.update_one({"isbn":id},{'$set':mod})
        return "ok"
# print(Operations().updateElements(631,{"pageCount":int(285)}))

cors = CORS(app, resources={r"/*": {"origins": "http://localhost:5500"}})

@app.route('/find', methods=['GET'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def find():
    filt = { "$text": { "$search": request.args.get('val') } }
    result = Operations().findByCritere(filt)
    return jsonify({"result": [doc for doc in result]}), 200


@app.route('/delete', methods=['GET'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def delete():
    val = request.args.get('fil')
    print(val)
    filt= {"_id":int(val)}
    result = Operations().deleteElements(filt)
    return jsonify({"deleted_count": result}), 200


@app.route('/update', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def update():
    update = request.json
    obj = json.loads(update)
    print(type(obj))
    fil = obj["isbn"]
    result = Operations().updateElements(fil, obj)
    return jsonify({"modified_count": result}), 200



@app.route('/insert_many', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
def insert_many():
    data = request.json
    res = Operations().insertMany(data["books"])
    response = {'message': res}
    return jsonify(response), 200



@app.route('/countElements', methods=['GET'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def countElements():
    result = Operations().countElements()
    result1 = Operations().countClient()
    result2 = Operations().countDownloads()
    return jsonify({"nombre de books": result,
                    "nombre de users": result1,
                    "nombre de telechargements": result2
                    }), 200


@app.route('/top3', methods=['GET'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def top3():
    result = Operations().top3()
    return jsonify({"tableau": result}), 200


@app.route("/insert", methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def insert():
    data = request.json
    
    obj = json.loads(data)
    res=Operations().insertElement(obj)
    response = {'message': res}
    return jsonify(response), 200


@app.route("/porcentageBooks", methods=['GET'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def porcentageBooks():
    data = Operations().porcentageBooks()
    return jsonify({"data": data}), 200

@app.route("/id", methods=['GET'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def findById():
    filt = request.args.get('val')
    result = Operations().findById(int(filt))
    return jsonify({"result": [doc for doc in result]}), 200

if __name__ == '__main__':
    app.run(debug=False)
