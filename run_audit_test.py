import os
import sys

# Test listing models
try:
    from google import genai
    import config
    client = genai.Client(api_key=config.GEMINI_API_KEY)
    print("Available models:")
    for m in client.models.list():
        if 'generateContent' in m.supported_actions:
            print(f"- {m.name}")
except Exception as e:
    print(f"Failed to list models: {e}")
from dotenv import load_dotenv
import json

load_dotenv('.env')

sys.path.append('.')
from tasks import perform_audit_task

def run():
    print("Starting real-time audit on seointelligence.com...")
    try:
        # url, deep_crawl, max_pages, user_id
        result = perform_audit_task("https://seointelligence.com", False, 1, "test_cli_user")
        
        with open('seointelligence_audit.json', 'w') as f:
            json.dump(result, f, indent=2)
            
        print("Audit complete! Results saved to seointelligence_audit.json")
        print(f"Status: {result.get('status')}")
        print(f"Overall Score: {result.get('results', {}).get('healthScore', 'N/A')}")
        
    except Exception as e:
        print(f"Failed to run audit: {e}")

if __name__ == '__main__':
    run()
