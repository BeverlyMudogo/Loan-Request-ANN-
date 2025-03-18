from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

#Load the model
model = tf.keras.models.load_model('ANN.keras')

app = FastAPI()

# Allow CORS (Cross-Origin Requests) from your frontend (127.0.0.1:5500)
origins = [
    "http://127.0.0.1:5500",  # Allow frontend running locally
    "http://localhost:5500",   # Allow frontend running on localhost
    # Add any other origins that might be making requests
]

# Add the CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins to access the app
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


class LoanRequest(BaseModel):
    cibil_score: int 
    loan_term: int 
    loan_amount: int 
    income_annum: int
    
class LoanPrediction(BaseModel):
    predicted_class: int
    Status: str
    
@app.post('/predict/', response_model=LoanPrediction)
def predict(data: LoanRequest):
    # convert input data to np array
    input_data = np.array(
        [[data.cibil_score, data.loan_term, data.loan_amount, data.income_annum]]
    )
    
    # make predictions
    predicted_class = model.predict(input_data)[0][0]
    #convert prediction
    predicted_class = 1 if predicted_class > 0.5 else 0
    Status = {0: '0-loan request Rejected', 1:'Loan request Approved'}
    
    #return the prediction result
    return LoanPrediction(
        predicted_class = predicted_class,
        Status = Status[predicted_class]
    )