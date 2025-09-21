#!/usr/bin/env python3
"""
Database Connection Test Script for Furnish Web App
This script tests connections to both MongoDB and MySQL databases
"""

import pymongo
from pymongo import MongoClient
import pymysql
from pymysql import Error
import sys

def test_mongodb_connection():
    """Test MongoDB connection and basic operations"""
    print("=== Testing MongoDB Connection ===")
    
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        
        # Test connection
        client.admin.command('ping')
        print("✓ MongoDB connection successful")
        
        # Get database
        db = client.furnish_webapp
        
        # Test collections exist
        collections = db.list_collection_names()
        expected_collections = ['users', 'chat_sessions', 'chat_messages', 'user_preferences', 'project_templates']
        
        print(f"✓ Found {len(collections)} collections: {', '.join(collections)}")
        
        for expected in expected_collections:
            if expected in collections:
                print(f"✓ Collection '{expected}' exists")
            else:
                print(f"❌ Collection '{expected}' missing")
                return False
        
        # Test data access
        user_count = db.users.count_documents({})
        template_count = db.project_templates.count_documents({})
        
        print(f"✓ Found {user_count} users in database")
        print(f"✓ Found {template_count} project templates")
        
        # Test sample user login
        admin_user = db.users.find_one({"email": "admin@eleganthome.com"})
        if admin_user:
            print("✓ Sample admin user found")
        else:
            print("❌ Sample admin user not found")
            return False
        
        client.close()
        print("✓ MongoDB test completed successfully\n")
        return True
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False

def test_mysql_connection():
    """Test MySQL connection and basic operations"""
    print("=== Testing MySQL Connection ===")
    
    try:
        # Connect to MySQL
        connection = pymysql.connect(
            host='localhost',
            database='furnish_quotations',
            user='root',
            password='rootuser'
        )
        
        if connection:
            print("✓ MySQL connection successful")
            
            cursor = connection.cursor()
            
            # Test database exists
            cursor.execute("SELECT DATABASE();")
            database = cursor.fetchone()
            print(f"✓ Connected to database: {database[0]}")
            
            # Test table exists
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            table_names = [table[0] for table in tables]
            
            print(f"✓ Found {len(table_names)} tables: {', '.join(table_names)}")
            
            if 'quotations' not in table_names:
                print("❌ Quotations table not found")
                return False
            
            # Test data access
            cursor.execute("SELECT COUNT(*) FROM quotations;")
            quotation_count = cursor.fetchone()[0]
            print(f"✓ Found {quotation_count} quotations in database")
            
            # Test sample data
            cursor.execute("SELECT id, name, status FROM quotations LIMIT 2;")
            sample_quotations = cursor.fetchall()
            
            print("✓ Sample quotations:")
            for quotation in sample_quotations:
                print(f"  - ID: {quotation[0]}, Name: {quotation[1]}, Status: {quotation[2]}")
            
            # Test JSON data access
            cursor.execute("SELECT JSON_UNQUOTE(JSON_EXTRACT(client_info, '$.clientName')) as client_name FROM quotations LIMIT 1;")
            client_name = cursor.fetchone()[0]
            print(f"✓ JSON data extraction working: Client = {client_name}")
            
            # Test stored procedures
            try:
                cursor.callproc('GetUserQuotationCount', ['user-123'])
                for result in cursor.stored_results():
                    count = result.fetchone()[0]
                    print(f"✓ Stored procedure test: User has {count} quotations")
            except Error as e:
                print(f"⚠️  Stored procedure test failed: {e}")
            
            cursor.close()
            connection.close()
            print("✓ MySQL test completed successfully\n")
            return True
            
    except Error as e:
        print(f"❌ MySQL connection failed: {e}")
        return False

def test_service_ports():
    """Test if database services are running on expected ports"""
    print("=== Testing Service Ports ===")
    
    import socket
    
    services = [
        ("MongoDB", "localhost", 27017),
        ("MySQL", "localhost", 3306)
    ]
    
    all_ports_open = True
    
    for service_name, host, port in services:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(3)
            result = sock.connect_ex((host, port))
            sock.close()
            
            if result == 0:
                print(f"✓ {service_name} is running on {host}:{port}")
            else:
                print(f"❌ {service_name} is not accessible on {host}:{port}")
                all_ports_open = False
                
        except Exception as e:
            print(f"❌ Error testing {service_name}: {e}")
            all_ports_open = False
    
    print()
    return all_ports_open

def main():
    """Run all database connection tests"""
    print("🔍 Database Connection Test Suite for Furnish Web App")
    print("=" * 60)
    
    # Test service ports first
    ports_ok = test_service_ports()
    
    # Test database connections
    mongodb_ok = test_mongodb_connection()
    mysql_ok = test_mysql_connection()
    
    # Summary
    print("=== Test Summary ===")
    
    if ports_ok:
        print("✓ All database services are running")
    else:
        print("❌ Some database services are not running")
    
    if mongodb_ok:
        print("✓ MongoDB connection and operations successful")
    else:
        print("❌ MongoDB connection or operations failed")
        
    if mysql_ok:
        print("✓ MySQL connection and operations successful")
    else:
        print("❌ MySQL connection or operations failed")
    
    if all([ports_ok, mongodb_ok, mysql_ok]):
        print("\n🎉 All database tests passed! Your databases are ready.")
        return 0
    else:
        print("\n❌ Some tests failed. Please check the database configurations.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)