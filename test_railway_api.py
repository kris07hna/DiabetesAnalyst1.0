"""
Test script for Railway deployed API
"""
import requests
import json

# Update this with your actual Railway URL from the dashboard
API_URL = "https://diabetesanalyst10-production-edb2.up.railway.app"

print("🧪 Testing Railway API Deployment\n")
print(f"API URL: {API_URL}\n")

# Test 1: Root endpoint
print("1️⃣ Testing root endpoint (/)...")
try:
    response = requests.get(f"{API_URL}/")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

# Test 2: Health check
print("2️⃣ Testing health endpoint (/health)...")
try:
    response = requests.get(f"{API_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

# Test 3: Model info
print("3️⃣ Testing model info endpoint (/model-info)...")
try:
    response = requests.get(f"{API_URL}/model-info")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

# Test 4: Prediction
print("4️⃣ Testing prediction endpoint (/predict)...")
try:
    test_data = {
        "features": {
            "HighBP": 1,
            "HighChol": 1,
            "CholCheck": 1,
            "BMI": 28.5,
            "Smoker": 0,
            "Stroke": 0,
            "HeartDiseaseorAttack": 0,
            "PhysActivity": 1,
            "Fruits": 1,
            "Veggies": 1,
            "HvyAlcoholConsump": 0,
            "AnyHealthcare": 1,
            "NoDocbcCost": 0,
            "GenHlth": 2,
            "MentHlth": 5,
            "PhysHlth": 3,
            "DiffWalk": 0,
            "Sex": 1,
            "Age": 7,
            "Education": 4,
            "Income": 5
        }
    }
    
    response = requests.post(f"{API_URL}/predict", json=test_data)
    print(f"   Status: {response.status_code}")
    result = response.json()
    print(f"   Prediction: {result.get('prediction')}")
    print(f"   Risk: {result.get('risk_percentage')}%")
    print(f"   Category: {result.get('risk_category')}\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

print("✅ API Testing Complete!")
