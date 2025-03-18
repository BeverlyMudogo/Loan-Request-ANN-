// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function() {
    // Add event listener for the form submission
    document.getElementById('loan-form').addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent the default form submission behavior
  
      // Get the form input values
      const cibil_score = document.getElementById('cibil_score').value;
      const loan_term = document.getElementById('loan_term').value;
      const loan_amount = document.getElementById('loan_amount').value;
      const income_annum = document.getElementById('income_annum').value;
  
      // Prepare the data for the POST request
      const data = {
        cibil_score: parseInt(cibil_score),
        loan_term: parseInt(loan_term),
        loan_amount: parseInt(loan_amount),
        income_annum: parseInt(income_annum)
      };
  
      // Get the result div
      const resultDiv = document.getElementById('result');
      resultDiv.style.display = 'block'; // Make the result area visible
  
      // Use the Fetch API to send the POST request to the FastAPI backend
      fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json()) // Parse the response as JSON
      .then(data => {
        // Check if the prediction status is available
        if (data.Status) {
          resultDiv.innerHTML = `Prediction: ${data.Status}`;
          // Add a class based on whether the loan is approved or rejected
          resultDiv.className = data.Status.includes('Rejected') ? 'error' : 'success';
        } else {
          resultDiv.innerHTML = 'Error: Unable to process the request';
          resultDiv.className = 'error';
        }
      })
      .catch(error => {
        // Handle any errors in the fetch request
        resultDiv.innerHTML = `Error: ${error.message}`;
        resultDiv.className = 'error';
      });
    });
  });
  