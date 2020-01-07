import json
import boto3
from botocore.exceptions import ClientError
import decimal
import logging
from boto3.dynamodb.conditions import Key, Attr
from datetime import datetime

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)

def create_presigned_url(bucket_name, object_name, expiration=3600): 
    # Generate a presigned URL for the S3 object
    s3_client = boto3.client('s3', region_name='us-east-2')
    try:
        response = s3_client.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': object_name}, ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response

def wrap_response(statusCode, body):
    return {
        "statusCode": statusCode,
        "body": body
    }
    
def sort_users(users):
    return sorted(users, key=lambda k: k['userID'])

def addUserInfo(info) :
    try:
        info = json.loads(info)
        
        # connect to the db
        dynamodb = boto3.resource('dynamodb')
        
        # determine type of info
        infoType = info['type']
        if infoType == 'sessionScores':
            table = dynamodb.Table('MusicTherapySessionScores')
            table.put_item(
                Item = {
                    "userID": info['userID'],
                    "date": datetime.today().strftime('%Y-%m-%d'),
                    "sessionGoal": info['sessionGoal'],
                    "preSessionScore": info['preSessionScore'],
                    "postSessionScore": info['postSessionScore']
                }
            )
        elif infoType == 'questionnaireAnswers':
            table = dynamodb.Table('MusicTherapyUsers')
            
            # prepare info as json
            content = {
                "date": datetime.today().strftime('%Y-%m-%d'),
                "anxietyScore": info['anxietyScore'],
                "anxietyColor": info['anxietyColor'],
                "happinessColor": info['happinessColor'],
                "calmnessColor": info['calmnessColor'],
                "instrumentPreference": info['instrumentPreference'],
                "tempoPreference": info['tempoPreference'],
                "genrePreference": info['genrePreference']
            }
            
            table.put_item(
                Item = {
                    "userID": info['userID'],
                    "info": json.dumps(content, indent=4, cls=DecimalEncoder)
                }
            );
    except ClientError as e:
        return wrap_response(500, "getAll(): " + e.response['Error']['Message'])
    else:
        return wrap_response(200, json.dumps({"message": "User added successfull"}, indent=4, cls=DecimalEncoder))

def getAll():
    try:
        # connect to the db
        dynamodb = boto3.resource('dynamodb')
        
        # we will only need the table version of the table here
        table = dynamodb.Table('MusicTherapyUsers')
        
        response = table.scan() # this should take less time because labels are table in one item
        api_res = {
            'count': len(response['Items']),
            'users': [] 
        }
        
        for i in range(len(response['Items'])):
            api_res['users'].append({
                'userID': response['Items'][i]['userID'],
                'info': json.loads(response['Items'][i]['info'])
            })
        
        # sort the pictures by name
        api_res['users'] = sort_users(api_res['users'])
            
    except ClientError as e:
        return wrap_response(500, "getAll(): " + e.response['Error']['Message'])
    else:
        return wrap_response(200, json.dumps(api_res, indent=4, cls=DecimalEncoder))
        

def filterAll(userID):
    try:
        # connect to the db
        dynamodb = boto3.resource('dynamodb')
        
        # we will only need the table version of the table here
        table = dynamodb.Table('MusicTherapyUsers')
        
        response = table.get_item(
            Key = {
                'userID': userID
            }    
        )
        
        api_res = {
            'count': 0,
            'users': [] 
        }
        
        if 'Item' in response or 'Items' in response:
            api_res['count'] = 1
            api_res['users'].append({
                'userID': response['Item']['userID'],
                'info': json.loads(response['Item']['info'])
            })
    except ClientError as e:
        return wrap_response(500, "filterAll(): " + e.response['Error']['Message'])
    else:
        return wrap_response(200, json.dumps(api_res, indent=4, cls=DecimalEncoder))

def lambda_handler(event, context):
    if(event['requestContext']['httpMethod'] == 'GET'):
        # if there are no query parameters
        if 'queryStringParameters' not in event or event['queryStringParameters'] is None:
            return getAll()
        elif 'queryStringParameters' in event and 'userID' in event['queryStringParameters']:
            return filterAll(event['queryStringParameters']['userID'])
    elif(event['requestContext']['httpMethod'] == 'POST'):
        return addUserInfo(event['body'])
