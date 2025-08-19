#!/usr/bin/env python3
"""
Backend API Testing for CALC.IT Application
Tests FastAPI endpoints, MongoDB connection, and CORS configuration
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Get backend URL from frontend .env file
BACKEND_URL = "https://calcit-hub.preview.emergentagent.com/api"

def test_root_endpoint():
    """Test GET /api/ endpoint"""
    print("🔍 Testing GET /api/ endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("   ✅ Root endpoint working correctly")
                return True
            else:
                print("   ❌ Unexpected response message")
                return False
        else:
            print(f"   ❌ Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False

def test_cors_headers():
    """Test CORS configuration"""
    print("🔍 Testing CORS headers...")
    try:
        # Test preflight request
        headers = {
            'Origin': 'https://calcit-hub.preview.emergentagent.com',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        
        response = requests.options(f"{BACKEND_URL}/status", headers=headers, timeout=10)
        print(f"   Preflight Status Code: {response.status_code}")
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
        print(f"   CORS Headers: {cors_headers}")
        
        if response.status_code in [200, 204]:
            print("   ✅ CORS preflight working")
            return True
        else:
            print(f"   ❌ CORS preflight failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ CORS test failed: {e}")
        return False

def test_post_status_endpoint():
    """Test POST /api/status endpoint"""
    print("🔍 Testing POST /api/status endpoint...")
    try:
        test_data = {
            "client_name": "CALC.IT_Test_Client"
        }
        
        headers = {'Content-Type': 'application/json'}
        response = requests.post(f"{BACKEND_URL}/status", 
                               json=test_data, 
                               headers=headers, 
                               timeout=10)
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['id', 'client_name', 'timestamp']
            
            if all(field in data for field in required_fields):
                if data['client_name'] == test_data['client_name']:
                    print("   ✅ POST status endpoint working correctly")
                    return True, data['id']
                else:
                    print("   ❌ Client name mismatch in response")
                    return False, None
            else:
                print(f"   ❌ Missing required fields in response: {required_fields}")
                return False, None
        else:
            print(f"   ❌ Expected 200, got {response.status_code}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {e}")
        return False, None
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False, None

def test_get_status_endpoint():
    """Test GET /api/status endpoint"""
    print("🔍 Testing GET /api/status endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/status", timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Response type: {type(data)}")
            print(f"   Number of records: {len(data) if isinstance(data, list) else 'Not a list'}")
            
            if isinstance(data, list):
                if len(data) > 0:
                    # Check structure of first record
                    first_record = data[0]
                    required_fields = ['id', 'client_name', 'timestamp']
                    if all(field in first_record for field in required_fields):
                        print("   ✅ GET status endpoint working correctly")
                        return True
                    else:
                        print(f"   ❌ Records missing required fields: {required_fields}")
                        return False
                else:
                    print("   ✅ GET status endpoint working (empty list)")
                    return True
            else:
                print("   ❌ Response is not a list")
                return False
        else:
            print(f"   ❌ Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False

def test_mongodb_integration():
    """Test MongoDB integration by creating and retrieving data"""
    print("🔍 Testing MongoDB integration...")
    
    # First create a record
    success, record_id = test_post_status_endpoint()
    if not success:
        print("   ❌ Failed to create record for MongoDB test")
        return False
    
    # Then retrieve records to verify persistence
    print("   Verifying data persistence...")
    try:
        response = requests.get(f"{BACKEND_URL}/status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                # Look for our created record
                found_record = any(record.get('id') == record_id for record in data)
                if found_record:
                    print("   ✅ MongoDB integration working - data persisted")
                    return True
                else:
                    print("   ❌ Created record not found in database")
                    return False
            else:
                print("   ❌ No data returned from database")
                return False
        else:
            print(f"   ❌ Failed to retrieve data: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ MongoDB integration test failed: {e}")
        return False

def test_api_error_handling():
    """Test API error handling"""
    print("🔍 Testing API error handling...")
    try:
        # Test invalid endpoint
        response = requests.get(f"{BACKEND_URL}/nonexistent", timeout=10)
        print(f"   Invalid endpoint status: {response.status_code}")
        
        # Test invalid POST data
        invalid_data = {"invalid_field": "test"}
        response = requests.post(f"{BACKEND_URL}/status", json=invalid_data, timeout=10)
        print(f"   Invalid POST data status: {response.status_code}")
        
        if response.status_code in [400, 422]:  # FastAPI returns 422 for validation errors
            print("   ✅ API error handling working correctly")
            return True
        else:
            print(f"   ❌ Expected 400/422 for invalid data, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error handling test failed: {e}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print("=" * 60)
    print("🚀 CALC.IT Backend API Testing Started")
    print(f"🌐 Testing Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    test_results = {}
    
    # Test basic connectivity
    test_results['root_endpoint'] = test_root_endpoint()
    print()
    
    # Test CORS
    test_results['cors_headers'] = test_cors_headers()
    print()
    
    # Test POST endpoint
    test_results['post_status'] = test_post_status_endpoint()[0]
    print()
    
    # Test GET endpoint
    test_results['get_status'] = test_get_status_endpoint()
    print()
    
    # Test MongoDB integration
    test_results['mongodb_integration'] = test_mongodb_integration()
    print()
    
    # Test error handling
    test_results['error_handling'] = test_api_error_handling()
    print()
    
    # Summary
    print("=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests PASSED!")
        return True
    else:
        print("⚠️  Some backend tests FAILED!")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)