#!/usr/bin/env python3
"""
Backend API Testing Suite for Interior Design Platform
Tests all backend endpoints including authentication and AI chat services
"""

import requests
import json
import uuid
from datetime import datetime

# Configuration
BASE_URL = "https://home-design-hub.preview.emergentagent.com/api"
TEST_USER_DATA = {
    "email": "test@eleganthome.com",
    "username": "testuser",
    "full_name": "Test User",
    "password": "testpass123"
}

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.access_token = None
        self.test_results = []
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
    def test_health_check(self):
        """Test GET /api/health endpoint"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_result("Health Check", True, "Service is healthy", data)
                    return True
                else:
                    self.log_result("Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Health Check", False, f"Request failed: {str(e)}")
            return False
    
    def test_user_registration(self):
        """Test POST /api/auth/register endpoint"""
        try:
            # Add unique identifier to avoid conflicts
            unique_id = str(uuid.uuid4())[:8]
            test_data = TEST_USER_DATA.copy()
            test_data["email"] = f"test_{unique_id}@eleganthome.com"
            test_data["username"] = f"testuser_{unique_id}"
            
            response = requests.post(
                f"{self.base_url}/auth/register",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                # Verify user data is returned without password
                if (data.get("email") == test_data["email"] and 
                    data.get("username") == test_data["username"] and
                    data.get("full_name") == test_data["full_name"] and
                    "password" not in data):
                    self.log_result("User Registration", True, "User registered successfully", data)
                    # Store test user data for login test
                    self.test_user_data = test_data
                    return True
                else:
                    self.log_result("User Registration", False, f"Invalid response format: {data}")
                    return False
            else:
                self.log_result("User Registration", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("User Registration", False, f"Request failed: {str(e)}")
            return False
    
    def test_user_login(self):
        """Test POST /api/auth/login endpoint"""
        if not hasattr(self, 'test_user_data'):
            self.log_result("User Login", False, "No test user available - registration must succeed first")
            return False
            
        try:
            login_data = {
                "email": self.test_user_data["email"],
                "password": self.test_user_data["password"]
            }
            
            response = requests.post(
                f"{self.base_url}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token") and data.get("token_type") == "bearer":
                    self.access_token = data["access_token"]
                    self.log_result("User Login", True, "Login successful, JWT token received", {"token_type": data["token_type"]})
                    return True
                else:
                    self.log_result("User Login", False, f"Invalid token response: {data}")
                    return False
            else:
                self.log_result("User Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("User Login", False, f"Request failed: {str(e)}")
            return False
    
    def test_get_current_user(self):
        """Test GET /api/auth/me endpoint"""
        if not self.access_token:
            self.log_result("Get Current User", False, "No access token available - login must succeed first")
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.base_url}/auth/me",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if (data.get("email") and data.get("username") and 
                    data.get("full_name") and "password" not in data):
                    self.log_result("Get Current User", True, "User profile retrieved successfully", data)
                    return True
                else:
                    self.log_result("Get Current User", False, f"Invalid user data format: {data}")
                    return False
            else:
                self.log_result("Get Current User", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Get Current User", False, f"Request failed: {str(e)}")
            return False
    
    def test_ai_chat_message(self):
        """Test POST /api/chat/message endpoint"""
        if not self.access_token:
            self.log_result("AI Chat Message", False, "No access token available - login must succeed first")
            return False
            
        try:
            chat_data = {
                "message": "I want to design a modern living room with a budget of 15 lakhs",
                "session_id": None  # New session
            }
            
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(
                f"{self.base_url}/chat/message",
                json=chat_data,
                headers=headers,
                timeout=30  # Longer timeout for AI response
            )
            
            if response.status_code == 200:
                data = response.json()
                if (data.get("response") and data.get("session_id")):
                    self.log_result("AI Chat Message", True, "AI chat response received successfully", {
                        "response_length": len(data["response"]),
                        "session_id": data["session_id"]
                    })
                    self.chat_session_id = data["session_id"]
                    return True
                else:
                    self.log_result("AI Chat Message", False, f"Invalid chat response format: {data}")
                    return False
            else:
                self.log_result("AI Chat Message", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("AI Chat Message", False, f"Request failed: {str(e)}")
            return False
    
    def test_get_chat_sessions(self):
        """Test GET /api/chat/sessions endpoint"""
        if not self.access_token:
            self.log_result("Get Chat Sessions", False, "No access token available - login must succeed first")
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.base_url}/chat/sessions",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get Chat Sessions", True, f"Retrieved {len(data)} chat sessions", {
                        "session_count": len(data)
                    })
                    return True
                else:
                    self.log_result("Get Chat Sessions", False, f"Invalid sessions response format: {data}")
                    return False
            else:
                self.log_result("Get Chat Sessions", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Get Chat Sessions", False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests in sequence"""
        print("🚀 Starting Backend API Tests for Interior Design Platform")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test sequence - order matters for authentication flow
        tests = [
            self.test_health_check,
            self.test_user_registration,
            self.test_user_login,
            self.test_get_current_user,
            self.test_ai_chat_message,
            self.test_get_chat_sessions
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            print("-" * 40)
        
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend API is working correctly.")
        else:
            print(f"⚠️  {total - passed} test(s) failed. Check the details above.")
        
        return passed == total
    
    def get_summary(self):
        """Get test summary for reporting"""
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        summary = {
            "total_tests": total,
            "passed": passed,
            "failed": total - passed,
            "success_rate": f"{(passed/total*100):.1f}%" if total > 0 else "0%",
            "results": self.test_results
        }
        
        return summary

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Print detailed summary
    summary = tester.get_summary()
    print(f"\n📋 Final Summary:")
    print(f"   Total Tests: {summary['total_tests']}")
    print(f"   Passed: {summary['passed']}")
    print(f"   Failed: {summary['failed']}")
    print(f"   Success Rate: {summary['success_rate']}")
    
    # Exit with appropriate code
    exit(0 if success else 1)