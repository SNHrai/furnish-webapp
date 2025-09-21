// MongoDB Setup Script for Furnish Web App
// This script creates databases and collections with proper indexes

print("=== Setting up MongoDB databases for Furnish Web App ===");

// Switch to the main application database
use furnish_webapp;

print("Creating furnish_webapp database...");

// Create Users collection with validation and indexes
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "username", "full_name", "hashed_password", "role"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Valid email address"
        },
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 50,
          description: "Username between 3-50 characters"
        },
        full_name: {
          bsonType: "string",
          minLength: 1,
          maxLength: 100,
          description: "Full name between 1-100 characters"
        },
        phone: {
          bsonType: ["string", "null"],
          description: "Optional phone number"
        },
        role: {
          bsonType: "string",
          enum: ["customer", "designer", "admin"],
          description: "User role"
        },
        is_active: {
          bsonType: "bool",
          description: "Account status"
        },
        hashed_password: {
          bsonType: "string",
          description: "Hashed password"
        },
        created_at: {
          bsonType: "date",
          description: "Account creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        },
        last_login: {
          bsonType: ["date", "null"],
          description: "Last login timestamp"
        }
      }
    }
  }
});

// Create indexes for users collection
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "is_active": 1 });
db.users.createIndex({ "created_at": -1 });

print("✓ Users collection created with validation and indexes");

// Create Chat Sessions collection
db.createCollection("chat_sessions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["session_id", "user_id", "created_at"],
      properties: {
        session_id: {
          bsonType: "string",
          description: "Unique session identifier"
        },
        user_id: {
          bsonType: "string",
          description: "User ObjectId as string"
        },
        title: {
          bsonType: "string",
          maxLength: 200,
          description: "Session title"
        },
        created_at: {
          bsonType: "date",
          description: "Session creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        },
        is_active: {
          bsonType: "bool",
          description: "Session status"
        },
        context: {
          bsonType: ["object", "null"],
          description: "Conversation context"
        }
      }
    }
  }
});

// Create indexes for chat_sessions
db.chat_sessions.createIndex({ "session_id": 1 }, { unique: true });
db.chat_sessions.createIndex({ "user_id": 1 });
db.chat_sessions.createIndex({ "user_id": 1, "created_at": -1 });
db.chat_sessions.createIndex({ "is_active": 1 });

print("✓ Chat Sessions collection created with validation and indexes");

// Create Chat Messages collection
db.createCollection("chat_messages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["session_id", "user_id", "message_type", "content", "timestamp"],
      properties: {
        session_id: {
          bsonType: "string",
          description: "Associated session ID"
        },
        user_id: {
          bsonType: "string",
          description: "User ObjectId as string"
        },
        message_type: {
          bsonType: "string",
          enum: ["user", "assistant", "system"],
          description: "Type of message"
        },
        content: {
          bsonType: "string",
          maxLength: 10000,
          description: "Message content"
        },
        timestamp: {
          bsonType: "date",
          description: "Message timestamp"
        },
        metadata: {
          bsonType: ["object", "null"],
          description: "Additional message metadata"
        }
      }
    }
  }
});

// Create indexes for chat_messages
db.chat_messages.createIndex({ "session_id": 1, "timestamp": 1 });
db.chat_messages.createIndex({ "user_id": 1 });
db.chat_messages.createIndex({ "message_type": 1 });
db.chat_messages.createIndex({ "timestamp": -1 });

print("✓ Chat Messages collection created with validation and indexes");

// Create User Preferences collection
db.createCollection("user_preferences", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id"],
      properties: {
        user_id: {
          bsonType: "string",
          description: "User ObjectId as string"
        },
        design_preferences: {
          bsonType: ["object", "null"],
          description: "User's design preferences"
        },
        notification_settings: {
          bsonType: ["object", "null"],
          description: "Notification preferences"
        },
        theme: {
          bsonType: "string",
          enum: ["light", "dark", "system"],
          description: "UI theme preference"
        },
        language: {
          bsonType: "string",
          description: "Preferred language"
        },
        created_at: {
          bsonType: "date",
          description: "Creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.user_preferences.createIndex({ "user_id": 1 }, { unique: true });
print("✓ User Preferences collection created");

// Create Project Templates collection
db.createCollection("project_templates", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "category", "template_data"],
      properties: {
        name: {
          bsonType: "string",
          maxLength: 200,
          description: "Template name"
        },
        category: {
          bsonType: "string",
          enum: ["living-room", "bedroom", "kitchen", "bathroom", "office", "commercial"],
          description: "Template category"
        },
        description: {
          bsonType: "string",
          maxLength: 1000,
          description: "Template description"
        },
        template_data: {
          bsonType: "object",
          description: "Template configuration data"
        },
        preview_images: {
          bsonType: ["array", "null"],
          description: "Array of preview image URLs"
        },
        is_active: {
          bsonType: "bool",
          description: "Template availability status"
        },
        created_by: {
          bsonType: ["string", "null"],
          description: "Creator user ID"
        },
        created_at: {
          bsonType: "date",
          description: "Creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.project_templates.createIndex({ "category": 1 });
db.project_templates.createIndex({ "is_active": 1 });
db.project_templates.createIndex({ "created_at": -1 });
print("✓ Project Templates collection created");

// Insert some sample data
print("\n=== Inserting sample data ===");

// Sample admin user
db.users.insertOne({
  email: "admin@eleganthome.com",
  username: "admin",
  full_name: "System Administrator",
  phone: "+91-9876543210",
  role: "admin",
  is_active: true,
  hashed_password: "$2b$12$example_hashed_password", // This should be properly hashed
  created_at: new Date(),
  updated_at: new Date(),
  last_login: null
});

// Sample designer user
db.users.insertOne({
  email: "designer@eleganthome.com",
  username: "designer1",
  full_name: "Interior Designer",
  phone: "+91-9876543211",
  role: "designer",
  is_active: true,
  hashed_password: "$2b$12$example_hashed_password", // This should be properly hashed
  created_at: new Date(),
  updated_at: new Date(),
  last_login: null
});

print("✓ Sample users created");

// Sample project templates
db.project_templates.insertMany([
  {
    name: "Modern Living Room",
    category: "living-room",
    description: "Contemporary living room design with minimalist approach",
    template_data: {
      style: "modern",
      color_scheme: ["#FFFFFF", "#000000", "#C0C0C0"],
      furniture_types: ["sofa", "coffee-table", "tv-unit", "accent-chair"],
      budget_range: "medium"
    },
    preview_images: [],
    is_active: true,
    created_by: null,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Luxury Bedroom",
    category: "bedroom",
    description: "Elegant bedroom design with luxury finishes",
    template_data: {
      style: "luxury",
      color_scheme: ["#F5F5DC", "#DAA520", "#8B4513"],
      furniture_types: ["bed", "wardrobe", "dresser", "nightstand"],
      budget_range: "high"
    },
    preview_images: [],
    is_active: true,
    created_by: null,
    created_at: new Date(),
    updated_at: new Date()
  }
]);

print("✓ Sample project templates created");

print("\n=== MongoDB setup completed successfully ===");
print("Databases created:");
print("- furnish_webapp (main application database)");
print("\nCollections created:");
print("- users (with email/username uniqueness)");
print("- chat_sessions (for AI chat functionality)");
print("- chat_messages (chat history)");
print("- user_preferences (user settings)");
print("- project_templates (design templates)");
print("\nAll collections have proper validation schemas and indexes for optimal performance.");