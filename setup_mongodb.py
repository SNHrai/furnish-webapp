#!/usr/bin/env python3
"""
MongoDB Setup Script for Furnish Web App
This script creates databases and collections with proper indexes and validation
"""

import pymongo
from pymongo import MongoClient
from datetime import datetime
import bcrypt

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def setup_mongodb():
    """Set up MongoDB databases and collections"""
    print("=== Setting up MongoDB databases for Furnish Web App ===")
    
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        
        # Test connection
        client.admin.command('ping')
        print("✓ Connected to MongoDB successfully")
        
        # Get the main application database
        db = client.furnish_webapp
        print("✓ Using database: furnish_webapp")
        
        # Drop existing collections if they exist (for clean setup)
        collections_to_drop = ['users', 'chat_sessions', 'chat_messages', 'user_preferences', 'project_templates']
        for collection_name in collections_to_drop:
            if collection_name in db.list_collection_names():
                db[collection_name].drop()
                print(f"✓ Dropped existing collection: {collection_name}")
        
        # Create Users collection with validation
        users_validator = {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["email", "username", "full_name", "hashed_password", "role"],
                "properties": {
                    "email": {
                        "bsonType": "string",
                        "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                        "description": "Valid email address"
                    },
                    "username": {
                        "bsonType": "string",
                        "minLength": 3,
                        "maxLength": 50,
                        "description": "Username between 3-50 characters"
                    },
                    "full_name": {
                        "bsonType": "string",
                        "minLength": 1,
                        "maxLength": 100,
                        "description": "Full name between 1-100 characters"
                    },
                    "phone": {
                        "bsonType": ["string", "null"],
                        "description": "Optional phone number"
                    },
                    "role": {
                        "bsonType": "string",
                        "enum": ["customer", "designer", "admin"],
                        "description": "User role"
                    },
                    "is_active": {
                        "bsonType": "bool",
                        "description": "Account status"
                    },
                    "hashed_password": {
                        "bsonType": "string",
                        "description": "Hashed password"
                    },
                    "created_at": {
                        "bsonType": "date",
                        "description": "Account creation timestamp"
                    },
                    "updated_at": {
                        "bsonType": "date",
                        "description": "Last update timestamp"
                    },
                    "last_login": {
                        "bsonType": ["date", "null"],
                        "description": "Last login timestamp"
                    }
                }
            }
        }
        
        db.create_collection("users", validator=users_validator)
        
        # Create indexes for users collection
        db.users.create_index("email", unique=True)
        db.users.create_index("username", unique=True)
        db.users.create_index("role")
        db.users.create_index("is_active")
        db.users.create_index([("created_at", -1)])
        
        print("✓ Users collection created with validation and indexes")
        
        # Create Chat Sessions collection
        chat_sessions_validator = {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["session_id", "user_id", "created_at"],
                "properties": {
                    "session_id": {
                        "bsonType": "string",
                        "description": "Unique session identifier"
                    },
                    "user_id": {
                        "bsonType": "string",
                        "description": "User ObjectId as string"
                    },
                    "title": {
                        "bsonType": "string",
                        "maxLength": 200,
                        "description": "Session title"
                    },
                    "created_at": {
                        "bsonType": "date",
                        "description": "Session creation timestamp"
                    },
                    "updated_at": {
                        "bsonType": "date",
                        "description": "Last update timestamp"
                    },
                    "is_active": {
                        "bsonType": "bool",
                        "description": "Session status"
                    },
                    "context": {
                        "bsonType": ["object", "null"],
                        "description": "Conversation context"
                    }
                }
            }
        }
        
        db.create_collection("chat_sessions", validator=chat_sessions_validator)
        
        # Create indexes for chat_sessions
        db.chat_sessions.create_index("session_id", unique=True)
        db.chat_sessions.create_index("user_id")
        db.chat_sessions.create_index([("user_id", 1), ("created_at", -1)])
        db.chat_sessions.create_index("is_active")
        
        print("✓ Chat Sessions collection created with validation and indexes")
        
        # Create Chat Messages collection
        chat_messages_validator = {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["session_id", "user_id", "message_type", "content", "timestamp"],
                "properties": {
                    "session_id": {
                        "bsonType": "string",
                        "description": "Associated session ID"
                    },
                    "user_id": {
                        "bsonType": "string",
                        "description": "User ObjectId as string"
                    },
                    "message_type": {
                        "bsonType": "string",
                        "enum": ["user", "assistant", "system"],
                        "description": "Type of message"
                    },
                    "content": {
                        "bsonType": "string",
                        "maxLength": 10000,
                        "description": "Message content"
                    },
                    "timestamp": {
                        "bsonType": "date",
                        "description": "Message timestamp"
                    },
                    "metadata": {
                        "bsonType": ["object", "null"],
                        "description": "Additional message metadata"
                    }
                }
            }
        }
        
        db.create_collection("chat_messages", validator=chat_messages_validator)
        
        # Create indexes for chat_messages
        db.chat_messages.create_index([("session_id", 1), ("timestamp", 1)])
        db.chat_messages.create_index("user_id")
        db.chat_messages.create_index("message_type")
        db.chat_messages.create_index([("timestamp", -1)])
        
        print("✓ Chat Messages collection created with validation and indexes")
        
        # Create User Preferences collection
        user_preferences_validator = {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["user_id"],
                "properties": {
                    "user_id": {
                        "bsonType": "string",
                        "description": "User ObjectId as string"
                    },
                    "design_preferences": {
                        "bsonType": ["object", "null"],
                        "description": "User's design preferences"
                    },
                    "notification_settings": {
                        "bsonType": ["object", "null"],
                        "description": "Notification preferences"
                    },
                    "theme": {
                        "bsonType": "string",
                        "enum": ["light", "dark", "system"],
                        "description": "UI theme preference"
                    },
                    "language": {
                        "bsonType": "string",
                        "description": "Preferred language"
                    },
                    "created_at": {
                        "bsonType": "date",
                        "description": "Creation timestamp"
                    },
                    "updated_at": {
                        "bsonType": "date",
                        "description": "Last update timestamp"
                    }
                }
            }
        }
        
        db.create_collection("user_preferences", validator=user_preferences_validator)
        db.user_preferences.create_index("user_id", unique=True)
        print("✓ User Preferences collection created")
        
        # Create Project Templates collection
        project_templates_validator = {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["name", "category", "template_data"],
                "properties": {
                    "name": {
                        "bsonType": "string",
                        "maxLength": 200,
                        "description": "Template name"
                    },
                    "category": {
                        "bsonType": "string",
                        "enum": ["living-room", "bedroom", "kitchen", "bathroom", "office", "commercial"],
                        "description": "Template category"
                    },
                    "description": {
                        "bsonType": "string",
                        "maxLength": 1000,
                        "description": "Template description"
                    },
                    "template_data": {
                        "bsonType": "object",
                        "description": "Template configuration data"
                    },
                    "preview_images": {
                        "bsonType": ["array", "null"],
                        "description": "Array of preview image URLs"
                    },
                    "is_active": {
                        "bsonType": "bool",
                        "description": "Template availability status"
                    },
                    "created_by": {
                        "bsonType": ["string", "null"],
                        "description": "Creator user ID"
                    },
                    "created_at": {
                        "bsonType": "date",
                        "description": "Creation timestamp"
                    },
                    "updated_at": {
                        "bsonType": "date",
                        "description": "Last update timestamp"
                    }
                }
            }
        }
        
        db.create_collection("project_templates", validator=project_templates_validator)
        db.project_templates.create_index("category")
        db.project_templates.create_index("is_active")
        db.project_templates.create_index([("created_at", -1)])
        print("✓ Project Templates collection created")
        
        # Insert sample data
        print("\n=== Inserting sample data ===")
        
        # Sample admin user
        admin_user = {
            "email": "admin@eleganthome.com",
            "username": "admin",
            "full_name": "System Administrator",
            "phone": "+91-9876543210",
            "role": "admin",
            "is_active": True,
            "hashed_password": hash_password("admin123"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_login": None
        }
        
        # Sample designer user
        designer_user = {
            "email": "designer@eleganthome.com",
            "username": "designer1",
            "full_name": "Interior Designer",
            "phone": "+91-9876543211",
            "role": "designer",
            "is_active": True,
            "hashed_password": hash_password("designer123"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_login": None
        }
        
        # Sample customer user
        customer_user = {
            "email": "customer@example.com",
            "username": "customer1",
            "full_name": "John Doe",
            "phone": "+91-9876543212",
            "role": "customer",
            "is_active": True,
            "hashed_password": hash_password("customer123"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_login": None
        }
        
        db.users.insert_many([admin_user, designer_user, customer_user])
        print("✓ Sample users created")
        
        # Sample project templates
        templates = [
            {
                "name": "Modern Living Room",
                "category": "living-room",
                "description": "Contemporary living room design with minimalist approach",
                "template_data": {
                    "style": "modern",
                    "color_scheme": ["#FFFFFF", "#000000", "#C0C0C0"],
                    "furniture_types": ["sofa", "coffee-table", "tv-unit", "accent-chair"],
                    "budget_range": "medium"
                },
                "preview_images": [],
                "is_active": True,
                "created_by": None,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Luxury Bedroom",
                "category": "bedroom",
                "description": "Elegant bedroom design with luxury finishes",
                "template_data": {
                    "style": "luxury",
                    "color_scheme": ["#F5F5DC", "#DAA520", "#8B4513"],
                    "furniture_types": ["bed", "wardrobe", "dresser", "nightstand"],
                    "budget_range": "high"
                },
                "preview_images": [],
                "is_active": True,
                "created_by": None,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Scandinavian Kitchen",
                "category": "kitchen",
                "description": "Clean, functional kitchen with Scandinavian design principles",
                "template_data": {
                    "style": "scandinavian",
                    "color_scheme": ["#FFFFFF", "#F0F0F0", "#8FBC8F"],
                    "furniture_types": ["cabinets", "island", "bar-stools", "storage"],
                    "budget_range": "medium"
                },
                "preview_images": [],
                "is_active": True,
                "created_by": None,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        db.project_templates.insert_many(templates)
        print("✓ Sample project templates created")
        
        print("\n=== MongoDB setup completed successfully ===")
        print("Database created: furnish_webapp")
        print("\nCollections created:")
        print("- users (with email/username uniqueness)")
        print("- chat_sessions (for AI chat functionality)")
        print("- chat_messages (chat history)")
        print("- user_preferences (user settings)")
        print("- project_templates (design templates)")
        print("\nSample data created:")
        print("- 3 sample users (admin, designer, customer)")
        print("- 3 project templates")
        print("\nLogin credentials:")
        print("- Admin: admin@eleganthome.com / admin123")
        print("- Designer: designer@eleganthome.com / designer123")
        print("- Customer: customer@example.com / customer123")
        print("\nAll collections have proper validation schemas and indexes for optimal performance.")
        
    except Exception as e:
        print(f"❌ Error setting up MongoDB: {e}")
        return False
    
    finally:
        client.close()
    
    return True

if __name__ == "__main__":
    success = setup_mongodb()
    if success:
        print("\n🎉 MongoDB setup completed successfully!")
    else:
        print("\n❌ MongoDB setup failed!")
        exit(1)