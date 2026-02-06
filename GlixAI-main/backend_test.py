#!/usr/bin/env python3
"""
GlixAI Backend API Test Suite
Tests all backend endpoints including new Science Streams, Risk Analytics, Shadow Salary, Sprints, EQ/SQ, and Glix Passport features
"""

import requests
import json
import sys
from datetime import datetime
import uuid

class GlixAIAPITester:
    def __init__(self, base_url="https://portal-crawler-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.test_results = {}
        
    def log_result(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}: PASSED")
        else:
            print(f"❌ {test_name}: FAILED - {details}")
            self.failed_tests.append({"test": test_name, "error": details})
        
        self.test_results[test_name] = {
            "passed": success,
            "details": details
        }

    def make_request(self, method: str, endpoint: str, data: dict = None, expected_status: int = 200) -> tuple:
        """Make HTTP request and return success status and response"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                return False, f"Unsupported method: {method}"
            
            success = response.status_code == expected_status
            if success:
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                return False, f"Status {response.status_code}, Expected {expected_status}. Response: {response.text[:200]}"
                
        except requests.exceptions.Timeout:
            return False, "Request timeout"
        except requests.exceptions.ConnectionError:
            return False, "Connection error"
        except Exception as e:
            return False, f"Request error: {str(e)}"

    # =============================================================================
    # Core API Tests
    # =============================================================================
    
    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.make_request('GET', '')
        if success and isinstance(response, dict):
            required_fields = ["message", "status", "modules"]
            has_required = all(field in response for field in required_fields)
            expected_modules = ["chat", "job_search", "resume_analysis", "roadmap_engine", "risk_analytics", "sprint_generator", "eq_scoring", "science_streams", "passport"]
            has_modules = all(module in response.get("modules", []) for module in expected_modules)
            
            if has_required and has_modules:
                self.log_result("Root API Endpoint", True)
            else:
                self.log_result("Root API Endpoint", False, f"Missing required fields or modules. Response: {response}")
        else:
            self.log_result("Root API Endpoint", False, str(response))

    def test_brand_config(self):
        """Test brand configuration endpoint"""
        success, response = self.make_request('GET', 'brand')
        if success and isinstance(response, dict):
            if "white_label" in response:
                self.log_result("Brand Config", True)
            else:
                self.log_result("Brand Config", False, "Missing white_label config")
        else:
            self.log_result("Brand Config", False, str(response))

    # =============================================================================
    # Science Streams Tests (NEW)
    # =============================================================================
    
    def test_get_streams(self):
        """Test GET /api/streams"""
        success, response = self.make_request('GET', 'streams')
        if success and isinstance(response, dict):
            streams = response.get("streams", [])
            expected_codes = ["pcm", "pcb", "pcmb"]
            found_codes = [s.get("code", "") for s in streams]
            
            if all(code in found_codes for code in expected_codes):
                self.log_result("Get Science Streams", True)
                return streams
            else:
                self.log_result("Get Science Streams", False, f"Missing expected stream codes. Found: {found_codes}")
        else:
            self.log_result("Get Science Streams", False, str(response))
        return []

    def test_match_stream(self):
        """Test POST /api/streams/match"""
        test_data = {
            "stream": "pcm",
            "skills": ["python", "matlab", "calculus"]
        }
        success, response = self.make_request('POST', 'streams/match', test_data)
        if success and isinstance(response, dict):
            required_fields = ["stream", "match", "recommended_roles"]
            if all(field in response for field in required_fields):
                self.log_result("Stream Match", True)
            else:
                self.log_result("Stream Match", False, f"Missing required fields in response: {response}")
        else:
            self.log_result("Stream Match", False, str(response))

    # =============================================================================
    # Risk Analytics Tests (NEW)
    # =============================================================================
    
    def test_automation_risk(self):
        """Test POST /api/analytics/risk"""
        test_data = {"job_title": "software engineer"}
        success, response = self.make_request('POST', 'analytics/risk', test_data)
        if success and isinstance(response, dict):
            risk = response.get("risk", {})
            required_fields = ["risk_score", "risk_level", "human_necessity", "horizon"]
            if all(field in risk for field in required_fields):
                self.log_result("Automation Risk Analysis", True)
                return risk
            else:
                self.log_result("Automation Risk Analysis", False, f"Missing required fields in risk data: {risk}")
        else:
            self.log_result("Automation Risk Analysis", False, str(response))
        return {}

    def test_shadow_salary(self):
        """Test POST /api/analytics/salary"""
        test_data = {"role": "data scientist"}
        success, response = self.make_request('POST', 'analytics/salary', test_data)
        if success and isinstance(response, dict):
            salary = response.get("salary", {})
            required_fields = ["low", "median", "high", "trend", "demand"]
            if all(field in salary for field in required_fields):
                self.log_result("Shadow Salary Analysis", True)
                return salary
            else:
                self.log_result("Shadow Salary Analysis", False, f"Missing required fields in salary data: {salary}")
        else:
            self.log_result("Shadow Salary Analysis", False, str(response))
        return {}

    def test_future_proofing(self):
        """Test POST /api/analytics/future-proof"""
        test_data = {
            "role": "ml engineer",
            "skills": ["python", "machine learning", "tensorflow"]
        }
        success, response = self.make_request('POST', 'analytics/future-proof', test_data)
        if success and isinstance(response, dict):
            fp = response.get("future_proofing", {})
            required_fields = ["future_proofing_score", "adaptability_bonus", "verdict"]
            if all(field in fp for field in required_fields):
                self.log_result("Future Proofing Analysis", True)
            else:
                self.log_result("Future Proofing Analysis", False, f"Missing required fields: {fp}")
        else:
            self.log_result("Future Proofing Analysis", False, str(response))

    # =============================================================================
    # Sprint Generator Tests (NEW)
    # =============================================================================
    
    def test_generate_sprint(self):
        """Test POST /api/sprints/generate"""
        test_data = {"skill": "python"}
        success, response = self.make_request('POST', 'sprints/generate', test_data)
        if success and isinstance(response, dict):
            sprint = response.get("sprint", {})
            required_fields = ["skill", "duration", "days", "completion_badge"]
            if all(field in sprint for field in required_fields):
                # Check if days has 7 entries
                days = sprint.get("days", {})
                if len(days) == 7:
                    self.log_result("Generate Sprint", True)
                else:
                    self.log_result("Generate Sprint", False, f"Sprint should have 7 days, got {len(days)}")
            else:
                self.log_result("Generate Sprint", False, f"Missing required fields: {sprint}")
        else:
            self.log_result("Generate Sprint", False, str(response))

    def test_generate_gap_sprints(self):
        """Test POST /api/sprints/gap"""
        test_data = {"missing_skills": ["react", "docker", "sql"]}
        success, response = self.make_request('POST', 'sprints/gap', test_data)
        if success and isinstance(response, dict):
            sprints = response.get("sprints", [])
            if len(sprints) == 3:  # Should match the number of missing skills
                self.log_result("Generate Gap Sprints", True)
            else:
                self.log_result("Generate Gap Sprints", False, f"Expected 3 sprints, got {len(sprints)}")
        else:
            self.log_result("Generate Gap Sprints", False, str(response))

    # =============================================================================
    # EQ/SQ Analysis Tests (NEW)
    # =============================================================================
    
    def test_analyze_eq_sq(self):
        """Test POST /api/eq-sq/analyze"""
        test_text = """
        I have led multiple cross-functional teams in developing innovative solutions. 
        Collaborated closely with stakeholders to deliver high-quality products. 
        Mentored junior developers and helped them grow in their careers. 
        Successfully resolved conflicts and built consensus among team members.
        """
        test_data = {"text": test_text}
        success, response = self.make_request('POST', 'eq-sq/analyze', test_data)
        if success and isinstance(response, dict):
            assessment = response.get("assessment", {})
            required_fields = ["eq_score", "sq_score", "combined_score", "eq_breakdown", "sq_breakdown"]
            if all(field in assessment for field in required_fields):
                eq_score = assessment.get("eq_score", 0)
                sq_score = assessment.get("sq_score", 0)
                if 0 <= eq_score <= 100 and 0 <= sq_score <= 100:
                    self.log_result("EQ/SQ Analysis", True)
                else:
                    self.log_result("EQ/SQ Analysis", False, f"Scores out of range: EQ={eq_score}, SQ={sq_score}")
            else:
                self.log_result("EQ/SQ Analysis", False, f"Missing required fields: {assessment}")
        else:
            self.log_result("EQ/SQ Analysis", False, str(response))

    # =============================================================================
    # Glix Passport Tests (NEW)
    # =============================================================================
    
    def test_generate_passport(self):
        """Test POST /api/passport/generate"""
        test_data = {
            "name": "Test User",
            "skills": ["python", "machine learning", "react"],
            "target_role": "data scientist",
            "experience_level": "Mid-Level",
            "bio": "Experienced developer with passion for AI and machine learning"
        }
        success, response = self.make_request('POST', 'passport/generate', test_data)
        if success and isinstance(response, dict):
            passport = response.get("passport", {})
            required_fields = ["id", "name", "target_role", "verified_badges", "automation_risk", "salary_insight", "eq_sq_assessment"]
            if all(field in passport for field in required_fields):
                self.log_result("Generate Passport", True)
                return passport.get("id")
            else:
                self.log_result("Generate Passport", False, f"Missing required fields: {list(passport.keys())}")
        else:
            self.log_result("Generate Passport", False, str(response))
        return None

    def test_get_passport(self, passport_id: str):
        """Test GET /api/passport/{passport_id}"""
        if not passport_id:
            self.log_result("Get Passport", False, "No passport ID provided")
            return
            
        success, response = self.make_request('GET', f'passport/{passport_id}')
        if success and isinstance(response, dict):
            passport = response.get("passport", {})
            if passport and "id" in passport:
                self.log_result("Get Passport", True)
            else:
                self.log_result("Get Passport", False, "Invalid passport response")
        else:
            self.log_result("Get Passport", False, str(response))

    # =============================================================================
    # Chat Tests
    # =============================================================================
    
    def test_chat_functionality(self):
        """Test chat endpoints"""
        session_id = str(uuid.uuid4())
        
        # Test sending a message
        chat_data = {
            "session_id": session_id,
            "message": "What is machine learning?",
            "context": ""
        }
        success, response = self.make_request('POST', 'chat', chat_data)
        if success and isinstance(response, dict):
            if "message" in response and "session_id" in response:
                self.log_result("Chat Send Message", True)
                
                # Test getting chat history
                success2, response2 = self.make_request('GET', f'chat/history/{session_id}')
                if success2 and isinstance(response2, dict):
                    messages = response2.get("messages", [])
                    if len(messages) >= 2:  # User + Assistant message
                        self.log_result("Chat History", True)
                    else:
                        self.log_result("Chat History", False, f"Expected at least 2 messages, got {len(messages)}")
                else:
                    self.log_result("Chat History", False, str(response2))
            else:
                self.log_result("Chat Send Message", False, "Missing required fields in chat response")
        else:
            self.log_result("Chat Send Message", False, str(response))

        # Test getting sessions
        success, response = self.make_request('GET', 'chat/sessions')
        if success and isinstance(response, dict):
            sessions = response.get("sessions", [])
            if isinstance(sessions, list):
                self.log_result("Chat Sessions", True)
            else:
                self.log_result("Chat Sessions", False, "Sessions should be a list")
        else:
            self.log_result("Chat Sessions", False, str(response))

    # =============================================================================
    # Job Search Tests
    # =============================================================================
    
    def test_job_search(self):
        """Test job search with science streams"""
        test_data = {
            "query": "python developer",
            "location": "San Francisco",
            "skills": ["python", "django"],
            "stream": "pcm"
        }
        success, response = self.make_request('POST', 'jobs/search', test_data)
        if success and isinstance(response, dict):
            jobs = response.get("jobs", [])
            if isinstance(jobs, list):
                # Check if jobs have risk scores and shadow salary
                if jobs:
                    first_job = jobs[0]
                    required_fields = ["title", "company", "risk_score", "shadow_salary"]
                    if all(field in first_job for field in required_fields):
                        self.log_result("Job Search with Analytics", True)
                    else:
                        self.log_result("Job Search with Analytics", False, f"Missing analytics fields in job: {list(first_job.keys())}")
                else:
                    self.log_result("Job Search with Analytics", True)  # Empty results are valid
            else:
                self.log_result("Job Search with Analytics", False, "Jobs should be a list")
        else:
            self.log_result("Job Search with Analytics", False, str(response))

    # =============================================================================
    # Resume Analysis Tests
    # =============================================================================
    
    def test_resume_text_analysis(self):
        """Test POST /api/resume/analyze-text (JSON body fix)"""
        test_resume = """
        John Doe
        Software Engineer
        
        Experience:
        - Led development of ML models using Python and TensorFlow
        - Collaborated with cross-functional teams to deliver products
        - Mentored junior developers and improved team productivity
        
        Skills: Python, Machine Learning, React, SQL, Docker
        Education: B.S. Computer Science
        """
        
        test_data = {"text": test_resume}
        success, response = self.make_request('POST', 'resume/analyze-text', test_data)
        if success and isinstance(response, dict):
            required_fields = ["parsed", "ai_analysis", "eq_sq"]
            if all(field in response for field in required_fields):
                # Check if EQ/SQ assessment is properly included
                eq_sq = response.get("eq_sq", {})
                if "eq_score" in eq_sq and "sq_score" in eq_sq:
                    self.log_result("Resume Text Analysis with EQ/SQ", True)
                else:
                    self.log_result("Resume Text Analysis with EQ/SQ", False, "Missing EQ/SQ scores")
            else:
                self.log_result("Resume Text Analysis with EQ/SQ", False, f"Missing required fields: {list(response.keys())}")
        else:
            self.log_result("Resume Text Analysis with EQ/SQ", False, str(response))

    # =============================================================================
    # Roadmap Tests
    # =============================================================================
    
    def test_roadmap_generation(self):
        """Test roadmap generation with sprints"""
        test_data = {
            "current_skills": ["python", "sql"],
            "target_role": "data scientist",
            "timeline_weeks": 16
        }
        success, response = self.make_request('POST', 'roadmap/generate', test_data)
        if success and isinstance(response, dict):
            required_fields = ["structured_roadmap", "ai_roadmap", "sprints"]
            if all(field in response for field in required_fields):
                sprints = response.get("sprints", [])
                if isinstance(sprints, list):
                    self.log_result("Roadmap Generation with Sprints", True)
                else:
                    self.log_result("Roadmap Generation with Sprints", False, "Sprints should be a list")
            else:
                self.log_result("Roadmap Generation with Sprints", False, f"Missing required fields: {list(response.keys())}")
        else:
            self.log_result("Roadmap Generation with Sprints", False, str(response))

    # =============================================================================
    # Skills Tests
    # =============================================================================
    
    def test_skills_endpoints(self):
        """Test skills-related endpoints"""
        # Test available roles
        success, response = self.make_request('GET', 'skills/roles')
        if success and isinstance(response, dict):
            roles = response.get("roles", [])
            if roles and isinstance(roles, list):
                # Check if roles have risk and salary data
                first_role = roles[0]
                if "risk_score" in first_role and "salary_range" in first_role:
                    self.log_result("Skills Roles with Analytics", True)
                else:
                    self.log_result("Skills Roles with Analytics", False, "Missing risk/salary data in roles")
            else:
                self.log_result("Skills Roles with Analytics", False, "No roles returned")
        else:
            self.log_result("Skills Roles with Analytics", False, str(response))

        # Test skill expansion
        test_data = {"term": "hplc"}
        success, response = self.make_request('POST', 'skills/expand', test_data)
        if success and isinstance(response, dict):
            expanded = response.get("expanded", "")
            if "Liquid Chromatography" in expanded:
                self.log_result("Skill Expansion (Science Terms)", True)
            else:
                self.log_result("Skill Expansion (Science Terms)", False, f"Expected HPLC expansion, got: {expanded}")
        else:
            self.log_result("Skill Expansion (Science Terms)", False, str(response))

    # =============================================================================
    # Main Test Runner
    # =============================================================================
    
    def run_all_tests(self):
        """Run all API tests"""
        print("=" * 80)
        print("🚀 GlixAI Backend API Test Suite")
        print(f"Testing against: {self.base_url}")
        print("=" * 80)
        
        try:
            # Core API tests
            self.test_root_endpoint()
            self.test_brand_config()
            
            # NEW: Science Streams tests
            print("\n📚 Testing Science Streams...")
            self.test_get_streams()
            self.test_match_stream()
            
            # NEW: Risk Analytics tests  
            print("\n⚠️  Testing Risk Analytics...")
            self.test_automation_risk()
            self.test_shadow_salary()
            self.test_future_proofing()
            
            # NEW: Sprint Generator tests
            print("\n🏃 Testing Sprint Generator...")
            self.test_generate_sprint()
            self.test_generate_gap_sprints()
            
            # NEW: EQ/SQ Analysis tests
            print("\n❤️  Testing EQ/SQ Analysis...")
            self.test_analyze_eq_sq()
            
            # NEW: Glix Passport tests
            print("\n🎫 Testing Glix Passport...")
            passport_id = self.test_generate_passport()
            if passport_id:
                self.test_get_passport(passport_id)
            
            # Existing functionality tests
            print("\n💬 Testing Chat Functionality...")
            self.test_chat_functionality()
            
            print("\n🔍 Testing Job Search...")
            self.test_job_search()
            
            print("\n📄 Testing Resume Analysis...")
            self.test_resume_text_analysis()
            
            print("\n🗺️  Testing Roadmap Generation...")
            self.test_roadmap_generation()
            
            print("\n🛠️  Testing Skills Endpoints...")
            self.test_skills_endpoints()
            
        except KeyboardInterrupt:
            print("\n⚠️  Tests interrupted by user")
        except Exception as e:
            print(f"\n💥 Unexpected error during testing: {e}")
        
        # Print final results
        self.print_summary()
        
        return self.tests_passed == self.tests_run

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed} ✅")
        print(f"Failed: {len(self.failed_tests)} ❌")
        print(f"Success Rate: {round((self.tests_passed/self.tests_run)*100, 1) if self.tests_run > 0 else 0}%")
        
        if self.failed_tests:
            print("\n💥 FAILED TESTS:")
            for i, failure in enumerate(self.failed_tests, 1):
                print(f"{i}. {failure['test']}: {failure['error']}")
        
        print("\n" + "=" * 80)


if __name__ == "__main__":
    tester = GlixAIAPITester()
    success = tester.run_all_tests()
    
    # Save results to JSON for frontend testing
    results = {
        "timestamp": datetime.now().isoformat(),
        "base_url": tester.base_url,
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "failed_tests": len(tester.failed_tests),
        "success_rate": round((tester.tests_passed/tester.tests_run)*100, 1) if tester.tests_run > 0 else 0,
        "test_details": tester.test_results,
        "failures": tester.failed_tests
    }
    
    with open("/app/test_reports/backend_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    sys.exit(0 if success else 1)